"""
Reads lap times from Assetto Corsa Competizione and sends them to AutoTime.

Run it on the computer that runs the game (Windows), while AutoTime is running:
    pip install -r requirements.txt
    python acc.py

ACC shares its data through shared memory, read with pyaccsharedmemory. No settings are needed in
the game.
"""
import time

from pyaccsharedmemory import ACC_STATUS, ACC_TRACK_GRIP_STATUS, accSharedMemory

from autotime_client import POLL_INTERVAL_S, AutoTimeClient, LapTracker, readable_name, require_windows

GAME = "Assetto Corsa Competizione"

# ACC's track names: (short name, full name, country). The short names match the tracks of the
# F1 games where it is the same circuit, so they share the track in the database.
TRACKS = {
    "barcelona": ("Catalunya", "Circuit de Catalunya", "ES"),
    "brands_hatch": ("Brands Hatch", "Brands Hatch Circuit", "GB"),
    "cota": ("COTA", "Circuit of the Americas", "US"),
    "donington": ("Donington Park", "Donington Park", "GB"),
    "hungaroring": ("Hungaroring", "Hungaroring", "HU"),
    "imola": ("Imola", "Autodromo Internazionale Enzo e Dino Ferrari", "IT"),
    "indianapolis": ("Indianapolis", "Indianapolis Motor Speedway", "US"),
    "kyalami": ("Kyalami", "Kyalami Grand Prix Circuit", "ZA"),
    "laguna_seca": ("Laguna Seca", "WeatherTech Raceway Laguna Seca", "US"),
    "misano": ("Misano", "Misano World Circuit Marco Simoncelli", "IT"),
    "monza": ("Monza", "Autodromo Nazionale di Monza", "IT"),
    "mount_panorama": ("Mount Panorama", "Mount Panorama Circuit", "AU"),
    "nurburgring": ("Nürburgring", "Nürburgring GP-Strecke", "DE"),
    "nurburgring_24h": ("Nürburgring 24h", "Nürburgring 24h Layout", "DE"),
    "oulton_park": ("Oulton Park", "Oulton Park Circuit", "GB"),
    "paul_ricard": ("Paul Ricard", "Circuit Paul Ricard", "FR"),
    "red_bull_ring": ("Red Bull Ring", "Red Bull Ring", "AT"),
    "silverstone": ("Silverstone", "Silverstone Circuit", "GB"),
    "snetterton": ("Snetterton", "Snetterton Circuit", "GB"),
    "spa": ("Spa", "Circuit de Spa-Francorchamps", "BE"),
    "suzuka": ("Suzuka", "Suzuka International Racing Course", "JP"),
    "valencia": ("Valencia", "Circuit Ricardo Tormo", "ES"),
    "watkins_glen": ("Watkins Glen", "Watkins Glen International", "US"),
    "zandvoort": ("Zandvoort", "Circuit Zandvoort", "NL"),
    "zolder": ("Zolder", "Circuit Zolder", "BE"),
}

# Cars whose readable name would be wrong. Other cars get a name from their ACC name,
# e.g. 'bmw_m4_gt3' -> 'BMW M4 GT3'.
CAR_NAMES = {
    "amr_v12_vantage_gt3": "Aston Martin V12 Vantage GT3",
    "amr_v8_vantage_gt3": "Aston Martin V8 Vantage GT3",
    "amr_v8_vantage_gt4": "Aston Martin V8 Vantage GT4",
    "jaguar_g3": "Emil Frey Jaguar G3",
    "lamborghini_gallardo_rex": "Reiter Engineering R-EX GT3",
    "porsche_991_gt3_r": "Porsche 911 GT3 R",
    "porsche_991ii_gt3_r": "Porsche 911 II GT3 R",
    "porsche_992_gt3_r": "Porsche 992 GT3 R",
}

TYRES = {
    "dry_compound": {"name": "ACC Dry", "fullName": "ACC Pirelli Dry"},
    "wet_compound": {"name": "ACC Wet", "fullName": "ACC Pirelli Wet"},
}

WET_GRIP = {ACC_TRACK_GRIP_STATUS.ACC_DAMP, ACC_TRACK_GRIP_STATUS.ACC_WET, ACC_TRACK_GRIP_STATUS.ACC_FLOODED}


def clean(text: str) -> str:
    """pyaccsharedmemory keeps the padding at the end of strings"""
    return text.split("\x00")[0].strip()


def track_info(track_id: str) -> dict:
    key = track_id.strip().lower().replace(" ", "_")
    if key in TRACKS:
        name, full_name, country = TRACKS[key]
        return {"name": name, "fullName": full_name, "country": country}
    # An unknown track can only be added once it exists in the database
    return {"name": readable_name(track_id)}


def car_info(car_model: str) -> dict:
    name = CAR_NAMES.get(car_model.strip().lower()) or readable_name(car_model)
    return {"name": name}


def main() -> None:
    require_windows(GAME)
    client = AutoTimeClient(GAME)
    memory = accSharedMemory()
    tracker = LapTracker()
    session_started = time.time()
    print(f"Reading {GAME}. Press Ctrl+C to stop.")

    try:
        while True:
            data = memory.read_shared_memory()
            # No new data while the game is paused or in the menus
            if data is None or data.Graphics.status != ACC_STATUS.ACC_LIVE:
                time.sleep(POLL_INTERVAL_S)
                continue

            graphics, static = data.Graphics, data.Static
            client.telemetry()
            lap = tracker.update(
                completed_laps=graphics.completed_lap,
                last_lap_ms=graphics.last_time,
                valid_now=graphics.is_valid_lap,
                in_pit_lane=graphics.is_in_pit_lane or graphics.is_in_pit,
            )
            if graphics.completed_lap == 0:
                session_started = time.time()

            if lap is not None:
                track_id, car_model, compound = clean(static.track), clean(static.car_model), clean(graphics.tyre_compound)
                client.submit_lap({
                    "id": f"{GAME}-{track_id}-{car_model}-{session_started:.0f}-{lap.number}-{lap.millis}",
                    "millis": lap.millis,
                    "valid": lap.valid,
                    "track": track_info(track_id),
                    "car": car_info(car_model),
                    "weather": "Wet" if graphics.track_grip_status in WET_GRIP else "Dry",
                    "tyre": TYRES.get(compound, {"name": compound or "Unknown"}),
                })
            time.sleep(POLL_INTERVAL_S)
    except KeyboardInterrupt:
        pass
    finally:
        memory.close()


if __name__ == "__main__":
    main()
