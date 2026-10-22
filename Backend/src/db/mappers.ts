// Converts database rows (typed by Prisma) into the API types shared with the Frontend.
import type { Prisma } from '../generated/prisma/client';
import type {
  Car,
  Class,
  Config,
  Country,
  Driver,
  Game,
  Setup,
  Track,
  Tyre,
  User,
  Weather,
} from '../shared/api';
import { LapRecordType, TimeSummary } from '../shared/dataStructures';
import { millisToTime } from './time';

/** Relations to load with a config to describe it in full */
export const configInclude = {
  game: true,
  track: { include: { country: true } },
  car: true,
  weather: true,
  tyre: true,
  setup: true,
} as const satisfies Prisma.ConfigInclude;

export type ConfigRow = Prisma.ConfigGetPayload<{ include: typeof configInclude }>;
export type TrackRow = Prisma.TrackGetPayload<{ include: { country: true } }>;

/** Relations to load with a lap time to summarise it */
export const timeInclude = {
  user: true,
  config: { include: configInclude },
} as const satisfies Prisma.TimeInclude;

export type TimeRow = Prisma.TimeGetPayload<{ include: typeof timeInclude }>;

export function toUser(user: Prisma.UserGetPayload<{}>): User {
  return { id: user.id, username: user.username };
}

export function toGame(game: Prisma.GameGetPayload<{}>): Game {
  return { id: game.id, name: game.name };
}

export function toCountry(country: Prisma.CountryGetPayload<{}>): Country {
  return {
    id: country.id,
    fullName: country.fullName,
    shortName: country.shortName,
    alpha2Code: country.alpha2Code.toLowerCase(),
  };
}

export function toTrack(track: TrackRow): Track {
  return {
    id: track.id,
    fullName: track.fullName,
    shortName: track.shortName,
    country: toCountry(track.country),
  };
}

export function toCar(car: Prisma.CarGetPayload<{}>): Car {
  return { id: car.id, fullName: car.fullName, shortName: car.shortName };
}

export function toWeather(weather: Prisma.WeatherGetPayload<{}>): Weather {
  return { id: weather.id, name: weather.name };
}

export function toTyre(tyre: Prisma.TyreGetPayload<{}>): Tyre {
  return { id: tyre.id, fullName: tyre.fullName, shortName: tyre.shortName };
}

export function toSetup(setup: Prisma.SetupGetPayload<{}>): Setup {
  return {
    id: setup.id,
    // Descriptions are optional in the database; the API has always returned null for them
    description: setup.description as string,
    custom: setup.custom,
    manual: setup.manual,
  };
}

export function toConfig(config: ConfigRow): Config {
  return {
    id: config.id,
    // Descriptions are optional in the database; the API has always returned null for them
    description: config.description as string,
    game: toGame(config.game),
    track: toTrack(config.track),
    car: toCar(config.car),
    weather: toWeather(config.weather),
    tyre: toTyre(config.tyre),
    setup: toSetup(config.setup),
  };
}

export function toTimeSummary(time: TimeRow, record: LapRecordType): TimeSummary {
  const config = time.config;
  return {
    id: time.id,
    time: millisToTime(time.millis),
    millis: time.millis,
    username: time.user.username,
    game: config.game.name,
    car: config.car.shortName,
    weather: config.weather.name,
    valid: time.valid,
    setupDescription: config.setup.description as string,
    customSetup: config.setup.custom,
    authentic: false,
    record: record,
  };
}

export function toDriver(
  driver: Prisma.AuthenticDriverGetPayload<{ include: { country: true } }>
): Driver {
  return {
    firstName: driver.firstName,
    lastName: driver.lastName,
    shortName: driver.shortName,
    number: driver.number,
    country: toCountry(driver.country),
  };
}

export function toClass(authenticClass: Prisma.AuthenticClassGetPayload<{}>): Class {
  return { id: authenticClass.id, name: authenticClass.name };
}
