import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../../Backend/.env', quiet: true });

import { randomBytes } from 'crypto';
import { JwtTokenBody } from '../../Backend/src/shared/utils';
import { AT_CarSetupEntry } from './specification/carSetupsTypes';

/** The Backend that stores the lap times. Set BACKEND_URL when it runs on another computer. */
const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.BACKEND_PORT}`;

/** An error returned by the Backend, e.g. 'Time already exists' */
export class BackendError extends Error {}

/**
 * Sends a lap time to the Backend. AutoTime signs its own access token with the
 * ACCESS_TOKEN_SECRET it shares with the Backend.
 */
export async function addTime(
  time: string,
  userID: number,
  gameName: string,
  trackName: string,
  carName: string,
  weatherName: string,
  tyreName: string,
  setup: AT_CarSetupEntry,
  valid: boolean
): Promise<boolean> {
  const body = {
    time,
    userID,
    gameName,
    trackName,
    carName,
    weatherName,
    tyreName,
    setup: {
      frontWing: setup.FrontWing,
      rearWing: setup.RearWing,
      onThrottle: setup.OnThrottle,
      offThrottle: setup.OffThrottle,
      frontCamber: setup.FrontCamber,
      rearCamber: setup.RearCamber,
      frontToe: setup.FrontToe,
      rearToe: setup.RearToe,
      frontSuspension: setup.FrontSuspension,
      rearSuspension: setup.RearSuspension,
      frontAntiRollBar: setup.FrontAntiRollBar,
      rearAntiRollBar: setup.RearAntiRollBar,
      frontSuspensionHeight: setup.FrontSuspensionHeight,
      rearSuspensionHeight: setup.RearSuspensionHeight,
      brakePressure: setup.BrakePressure,
      brakeBias: setup.BrakeBias,
      rearLeftTyrePressure: setup.RearLeftTyrePressure,
      rearRightTyrePressure: setup.RearRightTyrePressure,
      frontLeftTyrePressure: setup.FrontLeftTyrePressure,
      frontRightTyrePressure: setup.FrontRightTyrePressure,
      ballast: setup.Ballast,
      fuelLoad: setup.FuelLoad,
    },
    valid,
  };
  console.log({ time, userID, gameName, trackName, carName, weatherName, tyreName, valid });

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
