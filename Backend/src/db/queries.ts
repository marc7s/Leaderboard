// Read queries. Each replaces one of the SQL Server functions from the old database.
import type { Config, Country, Setup, Track, User } from '../shared/api';
import type { Car, Game, Tyre, Weather } from '../shared/api';
import {
  AuthenticTrackRecord,
  LapRecord,
  LapRecordType,
  TimeSummary,
  TrackSummary,
} from '../shared/dataStructures';
import { prisma } from './client';
import {
  configInclude,
  TimeRow,
  timeInclude,
  toCar,
  toClass,
  toConfig,
  toCountry,
  toDriver,
  toGame,
  toSetup,
  toTimeSummary,
  toTrack,
  toTyre,
  toUser,
  toWeather,
} from './mappers';
import { passwordMatches } from './password';
import { millisToTime } from './time';

const byId = { id: 'asc' } as const;
// Fastest first; equal times in the order they were added
const fastestFirst = [{ millis: 'asc' as const }, { id: 'asc' as const }];

export async function getUsers(): Promise<User[]> {
  return (await prisma.user.findMany({ orderBy: byId })).map(toUser);
}

export async function getUserFromUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { username } });
  return user && toUser(user);
}

/** Returns the admin with this username and password, or null. The username is case-sensitive. */
export async function login(username: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (user == null || user.username !== username || !user.admin || user.password == null) return null;
  return passwordMatches(password, user.password) ? toUser(user) : null;
}

export async function getGames(): Promise<Game[]> {
  const games = await prisma.game.findMany({ where: { authentic: false }, orderBy: byId });
  return games.map(toGame);
}

export async function getCars(): Promise<Car[]> {
  return (await prisma.car.findMany({ orderBy: byId })).map(toCar);
}

export async function getWeathers(): Promise<Weather[]> {
  return (await prisma.weather.findMany({ orderBy: byId })).map(toWeather);
}

export async function getTyres(): Promise<Tyre[]> {
  return (await prisma.tyre.findMany({ orderBy: byId })).map(toTyre);
}

export async function getSetups(): Promise<Setup[]> {
  return (await prisma.setup.findMany({ orderBy: byId })).map(toSetup);
}

export async function getCountries(): Promise<Country[]> {
  return (await prisma.country.findMany({ orderBy: byId })).map(toCountry);
}

export async function getTracks(): Promise<Track[]> {
  const tracks = await prisma.track.findMany({ include: { country: true }, orderBy: byId });
  return tracks.map(toTrack);
}

export async function getTrackFromShortName(shortName: string): Promise<Track | null> {
  const track = await prisma.track.findUnique({ where: { shortName }, include: { country: true } });
  return track && toTrack(track);
}

/** Named configs that users can pick when adding a time */
export async function getConfigs(): Promise<Config[]> {
  const configs = await prisma.config.findMany({
    where: { authentic: false, description: { not: null } },
    include: configInclude,
    orderBy: byId,
  });
  return configs.map(toConfig);
}

// ---------------------------------------------------------------------------
// Records
//
// A record is the fastest time for a config, counted separately for valid and invalid laps.
// A valid record that is as fast as or faster than a real-world (authentic) lap time on the
// same track has also beaten the authentic record.

/** IDs of all record times, and the slowest authentic time per track */
async function getRecordContext() {
  const times = await prisma.time.findMany({
    select: { id: true, millis: true, configId: true, valid: true },
    orderBy: fastestFirst,
  });
  // Times are sorted fastest first, so the first time seen per config and validity is the record
  const recordIds = new Set<number>();
  const seen = new Set<string>();
  for (const time of times) {
    const key = `${time.configId}:${time.valid}`;
    if (seen.has(key)) continue;
    seen.add(key);
    recordIds.add(time.id);
  }

  const authenticTimes = await prisma.authenticTime.findMany({
    select: { millis: true, config: { select: { trackId: true } } },
  });
  const slowestAuthenticByTrack = new Map<number, number>();
  for (const time of authenticTimes) {
    const trackId = time.config.trackId;
    slowestAuthenticByTrack.set(trackId, Math.max(time.millis, slowestAuthenticByTrack.get(trackId) ?? 0));
  }

  return {
    recordType(time: TimeRow): LapRecordType {
      if (!recordIds.has(time.id)) return LapRecordType.NoRecord;
      const authentic = slowestAuthenticByTrack.get(time.config.trackId);
      const beatAuthentic = time.valid && authentic !== undefined && time.millis <= authentic;
      return beatAuthentic ? LapRecordType.RecordAndBeatAuthentic : LapRecordType.Record;
    },
    recordIds,
  };
}

/** Keeps each user's fastest time per config and validity. Expects times sorted fastest first. */
function personalBests(times: TimeRow[]): TimeRow[] {
  const seen = new Set<string>();
  return times.filter((time) => {
    const key = `${time.userId}:${time.configId}:${time.valid}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getRecords(): Promise<LapRecord[]> {
  const context = await getRecordContext();
  const times = await prisma.time.findMany({
    where: { id: { in: [...context.recordIds] } },
    include: timeInclude,
    orderBy: byId,
  });
  return times.map((time) => ({
    config: toConfig(time.config),
    timeSummary: toTimeSummary(time, context.recordType(time)),
  }));
}

export async function getNumberOfRecordsFromUsername(username: string): Promise<number> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (user == null) return 0;

  const { recordIds } = await getRecordContext();
  return prisma.time.count({ where: { userId: user.id, id: { in: [...recordIds] } } });
}

async function getTrackTimes(trackId: number): Promise<TimeSummary[]> {
  const context = await getRecordContext();
  const times = await prisma.time.findMany({
    where: { config: { trackId } },
    include: timeInclude,
    orderBy: fastestFirst,
  });
  return personalBests(times).map((time) => toTimeSummary(time, context.recordType(time)));
}

export async function getTrackSummary(shortName: string): Promise<TrackSummary> {
  const track = await getTrackFromShortName(shortName);
  if (track == null) throw new Error('Track not found');

  return { track, times: await getTrackTimes(track.id) };
}

/** A user's personal bests, grouped by track */
export async function getUserSummary(username: string): Promise<TrackSummary[]> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (user == null) throw new Error('User not found');

  const context = await getRecordContext();
  const times = await prisma.time.findMany({
    where: { userId: user.id },
    include: timeInclude,
    orderBy: fastestFirst,
  });

  const summaries = new Map<number, TrackSummary>();
  for (const time of personalBests(times)) {
    const track = time.config.track;
    if (!summaries.has(track.id)) summaries.set(track.id, { track: toTrack(track), times: [] });
    summaries.get(track.id)!.times.push(toTimeSummary(time, context.recordType(time)));
  }
  return [...summaries.values()];
}

/** The fastest real-world lap time on a track, if there is one */
export async function getAuthenticRecord(trackId: number): Promise<AuthenticTrackRecord | null> {
  const time = await prisma.authenticTime.findFirst({
    where: { config: { trackId } },
    include: {
      class: true,
      driver: { include: { country: true } },
      config: { include: configInclude },
    },
    orderBy: fastestFirst,
  });
  if (time == null) return null;

  const config = time.config;
  // Authentic times have no user. The Frontend shows the driver's name instead.
  const timeSummary = {
    id: time.id,
    time: millisToTime(time.millis),
    millis: time.millis,
    game: config.game.name,
    car: config.car.shortName,
    weather: config.weather.name,
    valid: time.valid,
    setupDescription: config.setup.description,
    customSetup: config.setup.custom,
    authentic: true,
    record: LapRecordType.NoRecord,
  } as TimeSummary;

  return {
    driver: toDriver(time.driver),
    class: toClass(time.class),
    timeSummary,
    config: toConfig(config),
  };
}
