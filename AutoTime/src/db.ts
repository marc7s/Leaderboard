import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../../Backend/.env', quiet: true });

import { randomBytes } from 'crypto';
import { JwtTokenBody } from '../../Backend/src/shared/utils';
import type { GameLap } from './laps';

/** The Backend that stores the lap times. Set BACKEND_URL when it runs on another computer. */
const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.BACKEND_PORT}`;

/** An error returned by the Backend, e.g. 'Time already exists' */
export class BackendError extends Error {}

/** The car setup values, for the games that send them (F1 2021) */
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

/**
 * Sends a lap time to the Backend. AutoTime signs its own access token with the
 * ACCESS_TOKEN_SECRET it shares with the Backend.
 */
export async function addTime(userID: number, time: string, lap: GameLap): Promise<boolean> {
  const body = {
    time,
    userID,
    gameName: lap.game,
    trackName: lap.track.name,
    carName: lap.car.name,
    weatherName: lap.weather,
    tyreName: lap.tyre.name,
    setup: lap.setup,
    valid: lap.valid,
    track: { fullName: lap.track.fullName, country: lap.track.country },
    car: { fullName: lap.car.fullName },
    tyre: { fullName: lap.tyre.fullName },
  };

  const token = new JwtTokenBody(
    { id: 0, username: 'AutoTime' },
    randomBytes(64).toString('hex')
  ).sign();

  const response = await fetch(`${backendUrl}/api/db/add-auto-time`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new BackendError(error?.errorMessage ?? `Backend responded with ${response.status}`);
  }
  return true;
}
