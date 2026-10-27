import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../../Backend/.env', quiet: true });

import express, { Application, Request, Response, NextFunction } from 'express';
import { getClientIp } from 'request-ip';

import {
  ApiRequestMalformedError,
  AuthenticationError,
  ErrorMessage,
  NotFoundError,
  log,
  logError,
} from '../../Backend/src/shared/utils';

import { startF1_2021 } from './games/f1-2021';
import { startDirtRally2 } from './games/dirtRally2';
import { Cache, ReadyStatus } from './state';

const app: Application = express();
const cors = require('cors');

Cache.Initialize();

// Games that send UDP telemetry are read here. Assetto Corsa and Assetto Corsa Competizione are
// read by the Python readers in AutoTime/python, which send their laps to the API.
startF1_2021(Number(process.env.TELEMETRY_UDP_PORT || 20777));
startDirtRally2(Number(process.env.DIRT_RALLY_UDP_PORT || 20778));

app.use(
  cors({
    origin: [
      `http://${process.env.FRONTEND_IP}:${process.env.FRONTEND_PORT}`,
      'https://leaderboard.schagerberg.com',
    ],
  })
);

app.use(express.json());
app.use('/api', require('./api'));

app.get('/{*splat}', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(req.baseUrl + req.path));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    const requestIP = getClientIp(req) ?? 'UNKNOWN';
    if (err instanceof AuthenticationError)
      return sendError(res, 403, err.message, requestIP);

    if (err instanceof NotFoundError)
      return sendError(res, 404, err.message, requestIP);

    if (err instanceof ApiRequestMalformedError)
      return sendError(res, 406, err.message, requestIP);

    switch (err.message) {
      case 'NoUserIDProvided':
        return sendError(res, 400, 'Error: Missing user ID', requestIP);
      default:
        return sendError(res, 500, err.message, requestIP);
    }
  } else {
    next();
  }
});

app.listen(process.env.AUTOTIME_PORT, () => {
  log(
    `Running on port ${process.env.AUTOTIME_PORT}. Environment: ${app.get(
      'env'
    )}`
  );

  ReadyStatus.Initialize();
});

function sendError(
  res: Response,
  statusCode: number,
  message: string,
  requestIP: string,
  errorDetails?: Error
) {
  const payload: ErrorMessage = {
    status: 'ERROR',
    errorMessage: message,
  };
  logError(`${payload.errorMessage}\nRequested by IP '${requestIP}'`);
  if (!errorDetails) return res.status(statusCode).send(payload);

  payload.error = errorDetails;
  return res.status(statusCode).send(payload);
}
