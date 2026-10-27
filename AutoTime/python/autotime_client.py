"""
Shared code for the Python game readers: sends laps to AutoTime and follows the player's laps.

Only uses the Python standard library. The readers sign their own access token with the
ACCESS_TOKEN_SECRET in Backend/.env, the same way AutoTime signs its requests to the Backend.

Settings (read from Backend/.env, and overridden by environment variables of the same name):
- ACCESS_TOKEN_SECRET: needed to talk to AutoTime
- AUTOTIME_PORT: the port AutoTime runs on, on this computer
- AUTOTIME_URL: where AutoTime runs, if it is on another computer, e.g. http://192.168.1.10:5002
"""
import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

ENV_FILE = Path(__file__).resolve().parents[2] / "Backend" / ".env"
POLL_INTERVAL_S = 1 / 60
TELEMETRY_INTERVAL_S = 2


def require_windows(game: str) -> None:
    """The games share their data through Windows shared memory"""
    if os.name != "nt":
        raise SystemExit(f"The {game} reader must run on Windows, on the computer that runs the game.")


def load_settings() -> dict:
    settings = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            settings[key.strip()] = value.strip().strip("'\"")
    for key in ("ACCESS_TOKEN_SECRET", "AUTOTIME_PORT", "AUTOTIME_URL"):
        if key in os.environ:
            settings[key] = os.environ[key]
    return settings


def _base64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def sign_token(secret: str) -> str:
    """An HS256 JSON Web Token that AutoTime accepts, valid for 4 hours"""
    now = int(time.time())
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "user": {"id": 0, "username": "AutoTime Python"},
        "token": secrets.token_hex(64),
        "iat": now,
        "exp": now + 4 * 60 * 60,
    }
    signing_input = ".".join(
        _base64url(json.dumps(part, separators=(",", ":")).encode()) for part in (header, payload)
    )
    signature = hmac.new(secret.encode(), signing_input.encode(), hashlib.sha256).digest()
    return f"{signing_input}.{_base64url(signature)}"


def readable_name(identifier: str) -> str:
    """Turns a game's internal name into a readable one, e.g. 'bmw_m4_gt3' -> 'BMW M4 GT3'"""
    words = []
    for word in re.split(r"[_\s]+", identifier.strip()):
        if not word:
            continue
        letters = len(word) - len(word.lstrip("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"))
        if any(c.isdigit() for c in word):
            # 'gt3' -> 'GT3', '720s' -> '720S', but 'evo2' -> 'Evo2'
            words.append(word.capitalize() if letters >= 3 else word.upper())
        elif word.lower() in {"ii", "iii"}:
            words.append(word.upper())
        elif word.lower() in {"amg", "amr", "bmw", "gt", "gtr", "lms", "ktm", "nsx", "rs", "ks"}:
            words.append(word.upper())
        elif word.lower() == "mclaren":
            words.append("McLaren")
        else:
            words.append(word.capitalize())
    return " ".join(words)


class AutoTimeClient:
    def __init__(self, game: str):
        settings = load_settings()
        secret = settings.get("ACCESS_TOKEN_SECRET")
        if not secret:
            raise SystemExit(f"ACCESS_TOKEN_SECRET is not set. Add it to {ENV_FILE} or set the environment variable.")
        self.game = game
        self.secret = secret
        self.url = settings.get("AUTOTIME_URL") or f"http://localhost:{settings.get('AUTOTIME_PORT', '5002')}"
        self.url = self.url.rstrip("/") + "/api"
        self._token = ""
        self._token_expires = 0.0
        self._last_telemetry = 0.0
        self._connected: Optional[bool] = None

    def _post(self, path: str, body: dict) -> dict:
        if time.time() > self._token_expires:
            self._token = sign_token(self.secret)
            self._token_expires = time.time() + 60 * 60
        request = urllib.request.Request(
            self.url + path,
            data=json.dumps(body).encode(),
            headers={"content-type": "application/json", "authorization": f"Bearer {self._token}"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=5) as response:
            return json.loads(response.read() or b"{}")

    def _set_connected(self, connected: bool, error: Optional[Exception] = None) -> None:
        if connected != self._connected:
            if connected:
                print(f"Connected to AutoTime at {self.url}")
            else:
                print(f"Cannot reach AutoTime at {self.url}: {error}")
        self._connected = connected

    def telemetry(self) -> None:
        """Tells AutoTime the game is running. Sent at most every few seconds."""
        if time.time() - self._last_telemetry < TELEMETRY_INTERVAL_S:
            return
        self._last_telemetry = time.time()
        try:
            self._post("/telemetry", {"game": self.game})
            self._set_connected(True)
        except (urllib.error.URLError, OSError) as error:
            self._set_connected(False, error)

    def submit_lap(self, lap: dict) -> Optional[str]:
        """Sends a finished lap to AutoTime. Returns what happened to it, or None if it failed."""
        lap = {"game": self.game, **lap}
        print(f"Lap: {lap['millis'] / 1000:.3f}s at {lap['track']['name']} in {lap['car']['name']}"
              f"{'' if lap['valid'] else ' (invalid)'}")
        for attempt in range(3):
            try:
                result = self._post("/lap", lap).get("result")
                self._set_connected(True)
                print(f"  -> {result}")
                return result
            except urllib.error.HTTPError as error:
                print(f"  -> AutoTime rejected the lap: {error.read().decode(errors='replace')}")
                return None
            except (urllib.error.URLError, OSError) as error:
                self._set_connected(False, error)
                time.sleep(1 + attempt)
        print("  -> The lap was not added since AutoTime could not be reached")
        return None


@dataclass
class FinishedLap:
    number: int
    millis: int
    valid: bool


class LapTracker:
    """
    Follows the laps of the player's car in a game with shared memory (AC and ACC), and returns
    each finished lap once. Laps that went through the pit lane (such as out laps) are skipped.
    """

    def __init__(self):
        self.completed_laps: Optional[int] = None
        self.last_lap_ms = 0
        self.valid = True
        self.used_pit_lane = False
        # A lap that has finished, waiting for the game to update the last lap time
        self.pending: Optional[tuple] = None

    def update(self, completed_laps: int, last_lap_ms: int, valid_now: bool, in_pit_lane: bool) -> Optional[FinishedLap]:
        finished = None
        if self.completed_laps is None or completed_laps < self.completed_laps:
            # Started following, or a new session started
            self._reset()
        elif completed_laps > self.completed_laps:
            # The game may update the last lap time a moment after the lap count
            if not self.used_pit_lane and completed_laps == self.completed_laps + 1:
                self.pending = (completed_laps, self.valid, self.last_lap_ms, time.time())
            self._reset()
        self.completed_laps = completed_laps
        self.last_lap_ms = last_lap_ms

        if self.pending is not None and completed_laps < self.pending[0]:
            # A new session started before the lap time arrived
            self.pending = None
        if self.pending is not None:
            number, valid, previous_ms, finished_at = self.pending
            if last_lap_ms != previous_ms or time.time() - finished_at > 1:
                self.pending = None
                if last_lap_ms > 0:
                    finished = FinishedLap(number, last_lap_ms, valid)

        self.valid = self.valid and valid_now
        self.used_pit_lane = self.used_pit_lane or in_pit_lane
        return finished

    def _reset(self) -> None:
        self.valid = True
        self.used_pit_lane = False
