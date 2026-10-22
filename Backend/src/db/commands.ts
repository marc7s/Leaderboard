// Write operations. Each replaces one of the SQL Server stored procedures from the old database,
// with the same checks and error messages.
import type { Prisma } from '../generated/prisma/client';
import { prisma } from './client';
import { parseTime } from './time';

type Tx = Prisma.TransactionClient;

/** The setup values AutoTime reads from the game */
export interface AutoTimeSetup {
  frontWing: number;
  rearWing: number;
  onThrottle: number;
  offThrottle: number;
  frontCamber: number;
  rearCamber: number;
  frontToe: number;
  rearToe: number;
  frontSuspension: number;
  rearSuspension: number;
  frontAntiRollBar: number;
  rearAntiRollBar: number;
  frontSuspensionHeight: number;
  rearSuspensionHeight: number;
  brakePressure: number;
  brakeBias: number;
  rearLeftTyrePressure: number;
  rearRightTyrePressure: number;
  frontLeftTyrePressure: number;
  frontRightTyrePressure: number;
  ballast: number;
  fuelLoad: number;
}

export interface AutoTime {
  time: string;
  userId: number;
  gameName: string;
  trackName: string;
  carName: string;
  weatherName: string;
  tyreName: string;
  setup: AutoTimeSetup;
  valid: boolean;
}

interface ConfigIds {
  gameId: number;
  trackId: number;
  carId: number;
  weatherId: number;
  tyreId: number;
  setupId: number;
}

/** Throws the given message unless the row exists */
function mustExist<T>(row: T | null, message: string): T {
  if (row == null) throw new Error(message);
  return row;
}

/** Throws the given message if the row exists */
function mustNotExist(row: unknown, message: string): void {
  if (row != null) throw new Error(message);
}

function toMillis(time: string): number {
  const millis = parseTime(time);
  if (millis === null) throw new Error('Time is not a valid time');
  return millis;
}

// ---------------------------------------------------------------------------
// Users, games, cars, weathers, tyres, countries and tracks

export async function createUser(username: string): Promise<boolean> {
  mustNotExist(await prisma.user.findUnique({ where: { username } }), 'User already exists');
  await prisma.user.create({ data: { username } });
  return true;
}

export async function updateUser(userId: number, newUsername: string): Promise<boolean> {
  mustExist(await prisma.user.findUnique({ where: { id: userId } }), 'User does not exist');
  await prisma.user.update({ where: { id: userId }, data: { username: newUsername } });
  return true;
}

export async function createGame(name: string): Promise<boolean> {
  mustNotExist(await prisma.game.findUnique({ where: { name } }), 'Game already exists');
  await prisma.game.create({ data: { name } });
  return true;
}

export async function updateGame(gameId: number, newName: string): Promise<boolean> {
  mustExist(await prisma.game.findUnique({ where: { id: gameId } }), 'Game does not exist');
  await prisma.game.update({ where: { id: gameId }, data: { name: newName } });
  return true;
}

export async function createCar(fullName: string, shortName: string): Promise<boolean> {
  mustNotExist(await prisma.car.findUnique({ where: { fullName } }), 'Full name already exists');
  mustNotExist(await prisma.car.findUnique({ where: { shortName } }), 'Short name already exists');
  await prisma.car.create({ data: { fullName, shortName } });
  return true;
}

export async function updateCar(carId: number, newFullName: string, newShortName: string): Promise<boolean> {
  mustExist(await prisma.car.findUnique({ where: { id: carId } }), 'Car does not exist');
  await prisma.car.update({ where: { id: carId }, data: { fullName: newFullName, shortName: newShortName } });
  return true;
}

export async function createWeather(name: string): Promise<boolean> {
  mustNotExist(await prisma.weather.findUnique({ where: { name } }), 'Weather already exists');
  await prisma.weather.create({ data: { name } });
  return true;
}

export async function updateWeather(weatherId: number, newName: string): Promise<boolean> {
  mustExist(await prisma.weather.findUnique({ where: { id: weatherId } }), 'Weather does not exist');
  await prisma.weather.update({ where: { id: weatherId }, data: { name: newName } });
  return true;
}

export async function createTyre(fullName: string, shortName: string): Promise<boolean> {
  mustNotExist(await prisma.tyre.findUnique({ where: { fullName } }), 'Full name already exists');
  mustNotExist(await prisma.tyre.findUnique({ where: { shortName } }), 'Short name already exists');
  await prisma.tyre.create({ data: { fullName, shortName } });
  return true;
}

export async function updateTyre(tyreId: number, newFullName: string, newShortName: string): Promise<boolean> {
  mustExist(await prisma.tyre.findUnique({ where: { id: tyreId } }), 'Tyre does not exist');
  await prisma.tyre.update({ where: { id: tyreId }, data: { fullName: newFullName, shortName: newShortName } });
  return true;
}

export async function createCountry(fullName: string, shortName: string, alpha2Code: string): Promise<boolean> {
  mustNotExist(await prisma.country.findUnique({ where: { fullName } }), 'Full name already exists');
  mustNotExist(await prisma.country.findUnique({ where: { shortName } }), 'Short name already exists');
  mustNotExist(await prisma.country.findUnique({ where: { alpha2Code } }), 'Alpha 2 code already exists');
  await prisma.country.create({ data: { fullName, shortName, alpha2Code } });
  return true;
}

export async function updateCountry(
  countryId: number,
  newFullName: string,
  newShortName: string,
  newAlpha2Code: string
): Promise<boolean> {
  mustExist(await prisma.country.findUnique({ where: { id: countryId } }), 'Country does not exist');
  const sameCode = await prisma.country.findUnique({ where: { alpha2Code: newAlpha2Code } });
  if (sameCode != null && sameCode.id !== countryId) throw new Error('Alpha 2 code already exists');
  await prisma.country.update({
    where: { id: countryId },
    data: { fullName: newFullName, shortName: newShortName, alpha2Code: newAlpha2Code },
  });
  return true;
}

export async function createTrack(countryId: number, fullName: string, shortName: string): Promise<boolean> {
  mustNotExist(await prisma.track.findUnique({ where: { fullName } }), 'Full name already exists');
  mustNotExist(await prisma.track.findUnique({ where: { shortName } }), 'Short name already exists');
  mustExist(await prisma.country.findUnique({ where: { id: countryId } }), 'Country does not exist');
  await prisma.track.create({ data: { fullName, shortName, countryId } });
  return true;
}

export async function updateTrack(
  trackId: number,
  countryId: number,
  newFullName: string,
  newShortName: string
): Promise<boolean> {
  mustExist(await prisma.track.findUnique({ where: { id: trackId } }), 'Track does not exist');
  mustExist(await prisma.country.findUnique({ where: { id: countryId } }), 'Country does not exist');
  await prisma.track.update({
    where: { id: trackId },
    data: { countryId, fullName: newFullName, shortName: newShortName },
  });
  return true;
}

// ---------------------------------------------------------------------------
// Configs

/** Checks that everything a config refers to exists, with the same messages as before */
async function checkConfigParts(tx: Tx, ids: ConfigIds, checkSetup: boolean): Promise<void> {
  mustExist(await tx.game.findUnique({ where: { id: ids.gameId } }), 'Game does not exist');
  mustExist(await tx.track.findUnique({ where: { id: ids.trackId } }), 'Track does not exist');
  mustExist(await tx.car.findUnique({ where: { id: ids.carId } }), 'Car does not exist');
  mustExist(await tx.weather.findUnique({ where: { id: ids.weatherId } }), 'Weather does not exist');
  mustExist(await tx.tyre.findUnique({ where: { id: ids.tyreId } }), 'Tyre does not exist');
  if (checkSetup) mustExist(await tx.setup.findUnique({ where: { id: ids.setupId } }), 'Setup does not exist');
}

async function addConfig(tx: Tx, description: string | null, ids: ConfigIds): Promise<number> {
  if (description !== null)
    mustNotExist(await tx.config.findFirst({ where: { description } }), 'Description already exists');
  await checkConfigParts(tx, ids, true);
  const config = await tx.config.create({ data: { description, ...ids } });
  return config.id;
}

export async function createConfig(description: string, ids: ConfigIds): Promise<boolean> {
  await prisma.$transaction((tx) => addConfig(tx, description, ids));
  return true;
}

export async function updateConfig(configId: number, description: string, ids: ConfigIds): Promise<boolean> {
  await prisma.$transaction(async (tx) => {
    mustExist(await tx.config.findUnique({ where: { id: configId } }), 'Config does not exist');
    mustNotExist(
      await tx.config.findFirst({ where: { description, id: { not: configId } } }),
      'Description already exists'
    );
    await checkConfigParts(tx, ids, true);
    await tx.config.update({ where: { id: configId }, data: { description, ...ids } });
  });
  return true;
}

/** Finds the config with exactly these parts, or creates one without a description */
async function getOrAddConfig(tx: Tx, ids: ConfigIds): Promise<number> {
  const existing = await tx.config.findFirst({ where: ids, orderBy: { id: 'asc' } });
  return existing ? existing.id : addConfig(tx, null, ids);
}

// ---------------------------------------------------------------------------
// Times

async function insertTime(
  tx: Tx,
  millis: number,
  userId: number,
  configId: number,
  valid: boolean,
  addedManually: boolean
): Promise<void> {
  const duplicate = await tx.time.findFirst({ where: { millis, userId, configId, valid } });
  mustNotExist(duplicate, 'Time already exists');
  await tx.time.create({ data: { millis, userId, configId, valid, addedManually } });
}

/** Adds a time from the add time page, either for an existing config or for config parts */
export async function addTime(
  time: string,
  userId: number,
  valid: boolean,
  config: { configId: number } | ConfigIds
): Promise<boolean> {
  const millis = toMillis(time);
  await prisma.$transaction(async (tx) => {
    const configId = 'configId' in config ? config.configId : await getOrAddConfig(tx, config);
    mustExist(await tx.user.findUnique({ where: { id: userId } }), 'User does not exist');
    mustExist(await tx.config.findUnique({ where: { id: configId } }), 'Config does not exist');
    await insertTime(tx, millis, userId, configId, valid, true);
  });
  return true;
}

export async function removeTime(timeId: number): Promise<void> {
  mustExist(await prisma.time.findUnique({ where: { id: timeId } }), 'Time ID does not exist');
  await prisma.time.delete({ where: { id: timeId } });
}

/**
 * Adds a time recorded by AutoTime. The game, track, car, weather and tyre are given by name.
 * The setup and config are reused if an identical one exists, and created otherwise.
 */
export async function addAutoTime(autoTime: AutoTime): Promise<boolean> {
  const millis = toMillis(autoTime.time);
  await prisma.$transaction(async (tx) => {
    const user = mustExist(await tx.user.findUnique({ where: { id: autoTime.userId } }), 'User does not exist');
    const game = mustExist(await tx.game.findUnique({ where: { name: autoTime.gameName } }), 'Game does not exist');
    const track = mustExist(
      await tx.track.findUnique({ where: { shortName: autoTime.trackName } }),
      'Track does not exist'
    );
    const car = mustExist(await tx.car.findUnique({ where: { shortName: autoTime.carName } }), 'Car does not exist');
    const weather = mustExist(
      await tx.weather.findUnique({ where: { name: autoTime.weatherName } }),
      'Weather does not exist'
    );
    const tyre = mustExist(
      await tx.tyre.findUnique({ where: { shortName: autoTime.tyreName } }),
      'Tyre does not exist'
    );

    const setup =
      (await tx.setup.findFirst({ where: autoTime.setup, orderBy: { id: 'asc' } })) ??
      (await tx.setup.create({ data: { custom: true, manual: false, ...autoTime.setup } }));

    const ids = {
      gameId: game.id,
      trackId: track.id,
      carId: car.id,
      weatherId: weather.id,
      tyreId: tyre.id,
      setupId: setup.id,
    };
    const config =
      (await tx.config.findFirst({
        where: { description: null, authentic: false, ...ids },
        orderBy: { id: 'asc' },
      })) ?? (await tx.config.create({ data: { description: null, authentic: false, ...ids } }));

    await insertTime(tx, millis, user.id, config.id, autoTime.valid, false);
  });
  return true;
}
