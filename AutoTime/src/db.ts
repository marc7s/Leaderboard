import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../../Backend/.env' });

import * as sql from 'tedious';

import { getDBConnection } from '../../Backend/src/shared/database';
import { AT_CarSetupEntry } from './specification/carSetupsTypes';

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
  return new Promise((resolve, reject) => {
    console.log({
      time: time,
      userID: userID,
      gameName: gameName,
      trackName: trackName,
      carName: carName,
      weatherName: weatherName,
      tyreName: tyreName,
      valid: valid,
    });
    getDBConnection(sql, process.env.NODE_ENV != 'production')
      .then((conn) => {
        const query =
          'EXECUTE AddAutoTime @Time, @UserID, @GameName, @TrackName, @CarName, @WeatherName, @TyreName, ' +
          '@SetupFrontWing, @SetupRearWing, @SetupOnThrottle, @SetupOffThrottle, @SetupFrontCamber, @SetupRearCamber, ' +
          '@SetupFrontToe, @SetupRearToe, @SetupFrontSuspension, @SetupRearSuspension, @SetupFrontAntiRollBar, ' +
          '@SetupRearAntiRollBar, @SetupFrontSuspensionHeight, @SetupRearSuspensionHeight, @SetupBrakePressure, @SetupBrakeBias, ' +
          '@SetupRearLeftTyrePressure, @SetupRearRightTyrePressure, @SetupFrontLeftTyrePressure, @SetupFrontRightTyrePressure, ' +
          '@SetupBallast, @SetupFuelLoad, @Valid';

        const req: sql.Request = new sql.Request(
          query,
          (err, rowCount, rows) => {
            if (err) reject(err);
          }
        );

        req.addParameter('Time', sql.TYPES.VarChar, time);
        req.addParameter('UserID', sql.TYPES.Int, userID);
        req.addParameter('GameName', sql.TYPES.VarChar, gameName);
        req.addParameter('TrackName', sql.TYPES.VarChar, trackName);
        req.addParameter('CarName', sql.TYPES.VarChar, carName);
        req.addParameter('WeatherName', sql.TYPES.VarChar, weatherName);
        req.addParameter('TyreName', sql.TYPES.VarChar, tyreName);

        req.addParameter('SetupFrontWing', sql.TYPES.Int, setup.FrontWing);
        req.addParameter('SetupRearWing', sql.TYPES.Int, setup.RearWing);
        req.addParameter('SetupOnThrottle', sql.TYPES.Int, setup.OnThrottle);
        req.addParameter('SetupOffThrottle', sql.TYPES.Int, setup.OffThrottle);
        req.addParameter(
          'SetupFrontCamber',
          sql.TYPES.Float,
          setup.FrontCamber
        );
        req.addParameter('SetupRearCamber', sql.TYPES.Float, setup.RearCamber);
        req.addParameter('SetupFrontToe', sql.TYPES.Float, setup.FrontToe);
        req.addParameter('SetupRearToe', sql.TYPES.Float, setup.RearToe);
        req.addParameter(
          'SetupFrontSuspension',
          sql.TYPES.Int,
          setup.FrontSuspension
        );
        req.addParameter(
          'SetupRearSuspension',
          sql.TYPES.Int,
          setup.RearSuspension
        );
        req.addParameter(
          'SetupFrontAntiRollBar',
          sql.TYPES.Int,
          setup.FrontAntiRollBar
        );
        req.addParameter(
          'SetupRearAntiRollBar',
          sql.TYPES.Int,
          setup.RearAntiRollBar
        );
        req.addParameter(
          'SetupFrontSuspensionHeight',
          sql.TYPES.Int,
          setup.FrontSuspensionHeight
        );
        req.addParameter(
          'SetupRearSuspensionHeight',
          sql.TYPES.Int,
          setup.RearSuspensionHeight
        );
        req.addParameter(
          'SetupBrakePressure',
          sql.TYPES.Int,
          setup.BrakePressure
        );
        req.addParameter('SetupBrakeBias', sql.TYPES.Int, setup.BrakeBias);
        req.addParameter(
          'SetupRearLeftTyrePressure',
          sql.TYPES.Float,
          setup.RearLeftTyrePressure
        );
        req.addParameter(
          'SetupRearRightTyrePressure',
          sql.TYPES.Float,
          setup.RearRightTyrePressure
        );
        req.addParameter(
          'SetupFrontLeftTyrePressure',
          sql.TYPES.Float,
          setup.FrontLeftTyrePressure
        );
        req.addParameter(
          'SetupFrontRightTyrePressure',
          sql.TYPES.Float,
          setup.FrontRightTyrePressure
        );
        req.addParameter('SetupBallast', sql.TYPES.Int, setup.Ballast);
        req.addParameter('SetupFuelLoad', sql.TYPES.Float, setup.FuelLoad);

        req.addParameter('Valid', sql.TYPES.Bit, valid);
        conn.execSql(req);
        req.on('error', (err) => {
          reject(err);
        });
        req.on('requestCompleted', () => {
          resolve(true);
        });
      })
      .catch(reject);
  });
}
