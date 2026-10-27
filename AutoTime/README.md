# AutoTime
AutoTime logs lap times from these games for the driver selected on the AutoTime Dashboard:

| Game | How AutoTime reads it | Car | Track | Weather | Tyre | Setup | Valid lap |
|---|---|---|---|---|---|---|---|
| F1 2021 | UDP telemetry | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Assetto Corsa Competizione | Shared memory, Python reader | ✓ | ✓ | ✓ | ✓ | Default | ✓ |
| Assetto Corsa | Shared memory, Python reader | ✓ | ✓ | Always dry | ✓ | Default | 3+ wheels off track |
| Dirt Rally 2.0 | UDP telemetry | ✓ (some cars share a name) | ✓ | Always dry | Unknown | Default | Always valid |

Start AutoTime with `npm run dev`. It listens for F1 2021 and Dirt Rally 2.0 by itself. For the Assetto Corsa games, also start the game's Python reader (see below).

The first time AutoTime sees a game, car, track or tyre, it adds it to the database. A track also needs a country, so a track AutoTime has no country for must be added on the Edit Tracks page first. AutoTime logs the name to use.

## F1 2021
1. Go to `Game Options` -> `Settings` -> `Telemetry Settings`
2. Set the following settings:
* **UDP Telemetry**: On
* **UDP Broadcast Mode**: Off
* **UDP IP Address**: *The IP Address of your AutoTime Client*
* **UDP Port**: *The port you set in the environment variable TELEMETRY_UDP_PORT* (20777 by default)
* **UDP Send Rate**: 10hz
* **UDP Format**: 2021

## Dirt Rally 2.0
1. Open `Documents\My Games\DiRT Rally 2.0\hardwaresettings\hardware_settings_config.xml`.
2. Change the `udp` line to:
```xml
<udp enabled="true" extradata="3" ip="127.0.0.1" port="20778" delay="1" />
```
Use the IP address of the AutoTime computer if it is another one, and the port in `DIRT_RALLY_UDP_PORT` (20778 by default). It must not be the same port as F1 2021.

The game does not send the names of the stage or car, so AutoTime identifies them from the stage length, the start position and the engine data, using the tables of [dirt-rally-time-recorder](https://github.com/soong-construction/dirt-rally-time-recorder). This means:
* A time is only logged if the stage was started from the start line.
* A few cars send identical data and are logged as one car, e.g. `Škoda Fabia R5 / Volkswagen Polo GTI R5`.
* Rallycross is not supported.

## Assetto Corsa Competizione and Assetto Corsa (Python readers)
The two Assetto Corsa games share their data through shared memory, which only works on the Windows computer that runs the game. A Python reader reads it and sends each lap to AutoTime's API. Nothing needs to be set in the games.

1. Install Python 3.9 or newer on the game computer.
2. Install the readers' dependency (only needed for ACC):
```
cd AutoTime/python
pip install -r requirements.txt
```
3. Start AutoTime, then start the reader for the game in another terminal:
```
python acc.py   # Assetto Corsa Competizione
python ac.py    # Assetto Corsa
```

The readers use the `ACCESS_TOKEN_SECRET` and `AUTOTIME_PORT` in `Backend/.env`. If AutoTime runs on another computer, set `AUTOTIME_URL` (e.g. `http://192.168.1.10:5002`) as an environment variable or in that file.

Both readers skip laps that went through the pit lane, such as out laps.

* **Assetto Corsa Competizione** uses [pyaccsharedmemory](https://pypi.org/project/pyaccsharedmemory/). The weather is wet when the track is damp, wet or flooded. Car names are made from ACC's internal names, e.g. `bmw_m4_gt3` becomes `BMW M4 GT3`.
* **Assetto Corsa** reads the car and track names from the game's `content` folder, including mods. Set `AC_PATH` if the game is not in `C:\Program Files (x86)\Steam\steamapps\common\assettocorsa`.

## AutoTime API for other readers
Readers for other games can be written in any language. They send their laps to AutoTime with an `Authorization: Bearer <token>` header. The token is a JSON Web Token signed with HS256 and `ACCESS_TOKEN_SECRET` (see `sign_token` in `python/autotime_client.py`).

`POST /api/telemetry` with `{ "game": "<game name>" }`: tells AutoTime the game is running. Send it every few seconds.

`POST /api/lap`: adds a finished lap for the current driver. It responds with `{ "result": "added" | "duplicate" | "no-driver" | "failed" }`.
```json
{
  "id": "unique id of this lap, so it is only added once",
  "game": "Assetto Corsa Competizione",
  "millis": 101234,
  "valid": true,
  "weather": "Dry",
  "track": { "name": "Zolder", "fullName": "Circuit Zolder", "country": "BE" },
  "car": { "name": "BMW M4 GT3", "fullName": "optional" },
  "tyre": { "name": "ACC Dry", "fullName": "ACC Pirelli Dry" }
}
```
`weather` is `Dry` or `Wet`. `name` is the short name used in the database. `fullName` and `country` (an alpha-2 code or a country name) are only used when AutoTime adds a new track, car or tyre.
