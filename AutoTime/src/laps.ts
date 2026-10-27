// The common path for lap times from every game: the game integrations (and the Python readers,
// through the API) describe a finished lap as a GameLap, and submitLap sends it to the Backend.
import { log, logError } from '../../Backend/src/shared/utils';
import { TimeSummary, LapRecordType } from '../../Backend/src/shared/dataStructures';

import { addTime, AutoTimeSetup, BackendError } from './db';
import { Cache, getCurrentDriver } from './state';
import { formatLapTime } from './utils';

/** The names AutoTime uses for the games. Laps are stored under these games in the database. */
export const Games = {
  F1_2021: 'F1 2021',
  AssettoCorsaCompetizione: 'Assetto Corsa Competizione',
  AssettoCorsa: 'Assetto Corsa',
  DirtRally2: 'Dirt Rally 2.0',
} as const;

export type Weather = 'Dry' | 'Wet';

/** A finished lap (or rally stage), described with the names used in the database */
export interface GameLap {
  /** Unique for this lap, so that the same lap is never added twice */
  id: string;
  game: string;
  millis: number;
  valid: boolean;
  /** The track's short name. The full name and country are used to create it if it is new. */
  track: { name: string; fullName?: string; country?: string };
  /** The car's short name. The full name is used to create it if it is new. */
  car: { name: string; fullName?: string };
  weather: Weather;
  /** The tyre's short name. The full name is used to create it if it is new. */
  tyre: { name: string; fullName?: string };
  /** Only for games that send the car setup */
  setup?: AutoTimeSetup;
  /** Shown on the AutoTime dashboard, e.g. the name of a preset setup */
  setupName?: string;
  customSetup?: boolean;
}

export type SubmitResult = 'added' | 'duplicate' | 'no-driver' | 'failed';

/** Laps that are being sent to the Backend right now */
const pending = new Set<string>();

/** Sends a finished lap to the Backend for the current driver */
export async function submitLap(lap: GameLap): Promise<SubmitResult> {
  const driver = getCurrentDriver();
  const time = formatLapTime(lap.millis);
  const label = `${lap.game}: ${time} at ${lap.track.name} in ${lap.car.name}${lap.valid ? '' : ' (invalid)'}`;

  if (driver == null) {
    log(`Lap not added since no driver is selected. ${label}`);
    return 'no-driver';
  }
  if (pending.has(lap.id) || Cache.IncludesTime(lap.id)) return 'duplicate';

  const summary: TimeSummary = {
    id: Date.now(),
    time,
    millis: lap.millis,
    username: driver.username,
    game: lap.game,
    car: lap.car.name,
    weather: lap.weather,
    valid: lap.valid,
    setupDescription: lap.setupName ?? 'Default',
    customSetup: lap.customSetup ?? false,
    authentic: false,
    record: LapRecordType.NoRecord,
  };

  pending.add(lap.id);
  try {
    await addTime(driver.id, time, lap);
    Cache.AddTime(lap.id, summary);
    log(`Added lap for ${driver.username}. ${label}`);
    return 'added';
  } catch (err) {
    if (err instanceof BackendError && err.message === 'Time already exists') {
      Cache.AddTime(lap.id, summary);
      log(`Tried to add duplicate time. ${label}`);
      return 'duplicate';
    }
    logError(`Could not add lap. ${label}\n${err instanceof Error ? err.message : err}`);
    return 'failed';
  } finally {
    pending.delete(lap.id);
  }
}
