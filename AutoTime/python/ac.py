"""
Reads lap times from Assetto Corsa and sends them to AutoTime.

Run it on the computer that runs the game (Windows), while AutoTime is running:
    python ac.py

AC shares its data through shared memory. There is no package for reading it, so the layout is
defined here with ctypes, following the shared memory documentation from Kunos (only the first
fields are needed). Car and track names are read from the game's content folder. Set AC_PATH if
the game is not installed in the default Steam folder.

A lap is invalid if three or more wheels leave the track at any point during it.
"""
import ctypes
import json
import mmap
import os
import time
from ctypes import c_float, c_int32, c_wchar
from pathlib import Path

from autotime_client import POLL_INTERVAL_S, AutoTimeClient, LapTracker, readable_name, require_windows

GAME = "Assetto Corsa"
AC_LIVE = 2
MAX_TYRES_OUT = 2
DEFAULT_AC_PATH = r"C:\Program Files (x86)\Steam\steamapps\common\assettocorsa"
# Country names in the game's track files that differ from the ones in the database
COUNTRY_ALIASES = {"UK": "GB", "United Kingdom": "GB", "England": "GB", "Scotland": "GB", "Wales": "GB"}


class Physics(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        ("packetId", c_int32),
        ("gas", c_float),
        ("brake", c_float),
        ("fuel", c_float),
        ("gear", c_int32),
        ("rpms", c_int32),
        ("steerAngle", c_float),
        ("speedKmh", c_float),
        ("velocity", c_float * 3),
        ("accG", c_float * 3),
        ("wheelSlip", c_float * 4),
        ("wheelLoad", c_float * 4),
        ("wheelsPressure", c_float * 4),
        ("wheelAngularSpeed", c_float * 4),
        ("tyreWear", c_float * 4),
        ("tyreDirtyLevel", c_float * 4),
        ("tyreCoreTemperature", c_float * 4),
        ("camberRAD", c_float * 4),
        ("suspensionTravel", c_float * 4),
        ("drs", c_float),
        ("tc", c_float),
        ("heading", c_float),
        ("pitch", c_float),
        ("roll", c_float),
        ("cgHeight", c_float),
        ("carDamage", c_float * 5),
        ("numberOfTyresOut", c_int32),
    ]


class Graphics(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        ("packetId", c_int32),
        ("status", c_int32),
        ("session", c_int32),
        ("currentTime", c_wchar * 15),
        ("lastTime", c_wchar * 15),
        ("bestTime", c_wchar * 15),
        ("split", c_wchar * 15),
        ("completedLaps", c_int32),
        ("position", c_int32),
        ("iCurrentTime", c_int32),
        ("iLastTime", c_int32),
        ("iBestTime", c_int32),
        ("sessionTimeLeft", c_float),
        ("distanceTraveled", c_float),
        ("isInPit", c_int32),
        ("currentSectorIndex", c_int32),
        ("lastSectorTime", c_int32),
        ("numberOfLaps", c_int32),
        ("tyreCompound", c_wchar * 33),
        ("replayTimeMultiplier", c_float),
        ("normalizedCarPosition", c_float),
        ("carCoordinates", c_float * 3),
        ("penaltyTime", c_float),
        ("flag", c_int32),
        ("idealLineOn", c_int32),
        ("isInPitLane", c_int32),
    ]


class Static(ctypes.Structure):
    _pack_ = 4
    _fields_ = [
        ("smVersion", c_wchar * 15),
        ("acVersion", c_wchar * 15),
        ("numberOfSessions", c_int32),
        ("numCars", c_int32),
        ("carModel", c_wchar * 33),
        ("track", c_wchar * 33),
        ("playerName", c_wchar * 33),
        ("playerSurname", c_wchar * 33),
        ("playerNick", c_wchar * 33),
        ("sectorCount", c_int32),
        ("maxTorque", c_float),
        ("maxPower", c_float),
        ("maxRpm", c_int32),
        ("maxFuel", c_float),
        ("suspensionMaxTravel", c_float * 4),
        ("tyreRadius", c_float * 4),
        ("maxTurboBoost", c_float),
        ("airTemp", c_float),
        ("roadTemp", c_float),
        ("penaltiesEnabled", c_int32),
        ("aidFuelRate", c_float),
        ("aidTireRate", c_float),
        ("aidMechanicalDamage", c_float),
        ("aidAllowTyreBlankets", c_int32),
        ("aidStability", c_float),
        ("aidAutoClutch", c_int32),
        ("aidAutoBlip", c_int32),
        ("hasDRS", c_int32),
        ("hasERS", c_int32),
        ("hasKERS", c_int32),
        ("kersMaxJ", c_float),
        ("engineBrakeSettingsCount", c_int32),
        ("ersPowerControllerCount", c_int32),
        ("trackSPlineLength", c_float),
        ("trackConfiguration", c_wchar * 33),
    ]


class SharedMemory:
    def __init__(self):
        self._maps = []
        self.physics = self._open(Physics, "Local\\acpmf_physics")
        self.graphics = self._open(Graphics, "Local\\acpmf_graphics")
        self.static = self._open(Static, "Local\\acpmf_static")

    def _open(self, structure, name):
        memory = mmap.mmap(-1, ctypes.sizeof(structure), name)
        self._maps.append(memory)
        return structure.from_buffer(memory)

    def close(self):
        # The structures must be released before the memory can be closed
        self.physics = self.graphics = self.static = None
        for memory in self._maps:
            memory.close()


def read_ui_json(path: Path) -> dict:
    """Reads one of the game's ui_*.json files. Some are not strictly valid JSON."""
    try:
        return json.loads(path.read_text(encoding="utf-8-sig", errors="replace"), strict=False)
    except (OSError, ValueError):
        return {}


class Names:
    """Looks up the readable names of cars and tracks in the game's content folder"""

    def __init__(self):
        self.content = Path(os.environ.get("AC_PATH", DEFAULT_AC_PATH)) / "content"
        if not self.content.exists():
            print(f"Assetto Corsa not found at {self.content.parent}. Set AC_PATH to use the names from the game.")

    def car(self, model: str) -> dict:
        ui = read_ui_json(self.content / "cars" / model / "ui" / "ui_car.json")
        name = str(ui.get("name") or "").strip() or readable_name(model.removeprefix("ks_"))
        return {"name": name}

    def track(self, track: str, layout: str) -> dict:
        ui_folder = self.content / "tracks" / track / "ui"
        ui = read_ui_json(ui_folder / layout / "ui_track.json") if layout else {}
        ui = ui or read_ui_json(ui_folder / "ui_track.json")

        name = str(ui.get("name") or "").strip()
        if not name:
            name = readable_name(track.removeprefix("ks_"))
            if layout:
                name += f" {readable_name(layout)}"
        info = {"name": name}
        country = str(ui.get("country") or "").strip()
        if country:
            info["country"] = COUNTRY_ALIASES.get(country, country)
        return info


def main() -> None:
    require_windows(GAME)
    client = AutoTimeClient(GAME)
    memory = SharedMemory()
    names = Names()
    tracker = LapTracker()
    session_started = time.time()
    print(f"Reading {GAME}. Press Ctrl+C to stop.")

    try:
        while True:
            graphics, physics, static = memory.graphics, memory.physics, memory.static
            if graphics.status != AC_LIVE:
                time.sleep(POLL_INTERVAL_S)
                continue

            client.telemetry()
            lap = tracker.update(
                completed_laps=graphics.completedLaps,
                last_lap_ms=graphics.iLastTime,
                valid_now=physics.numberOfTyresOut <= MAX_TYRES_OUT,
                in_pit_lane=bool(graphics.isInPitLane or graphics.isInPit),
            )
            if graphics.completedLaps == 0:
                session_started = time.time()

            if lap is not None:
                car_model, track, layout = static.carModel, static.track, static.trackConfiguration
                compound = graphics.tyreCompound.strip() or "Unknown"
                client.submit_lap({
                    "id": f"{GAME}-{track}-{layout}-{car_model}-{session_started:.0f}-{lap.number}-{lap.millis}",
                    "millis": lap.millis,
                    "valid": lap.valid,
                    "track": names.track(track, layout),
                    "car": names.car(car_model),
                    # Assetto Corsa has no rain
                    "weather": "Dry",
                    "tyre": {"name": compound},
                })
            time.sleep(POLL_INTERVAL_S)
    except KeyboardInterrupt:
        pass
    finally:
        memory.close()


if __name__ == "__main__":
    main()
