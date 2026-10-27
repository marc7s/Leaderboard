import express, { Response, NextFunction, Router } from 'express';
import { log, authenticateToken, ApiRequestMalformedError } from '../../Backend/src/shared/utils';
import {
  userIDParam,
  usernameParam,
} from '../../Backend/src/shared/validations';
import { setCurrentDriver, getCurrentDriver, Cache, ReadyStatus } from './state';
import { GameLap, submitLap } from './laps';

const router: Router = express.Router();

router.get('/ping', authenticateToken, (req: any, res: Response) => {
  res.json(getCurrentDriver());
});

router.post(
  '/set-current-user',
  authenticateToken,
  userIDParam,
  usernameParam,
  (req: any, res: Response, next: NextFunction) => {
    const userID: number = req.userID;
    const username: string = req.username;
    log(`Setting current user to ${username}: ${userID}...`);
    setCurrentDriver({
      id: userID,
      username: username,
    });
    res.json(userID);
  }
);

router.get(
  '/get-last-session-times',
  authenticateToken,
  (req: any, res: Response, next: NextFunction) => {
    // Return the last 10 session times, sorted from newest to oldest
    res.json(
      Cache.GetTimeSummaries()
        .sort((a, b) => b.id - a.id)
        .slice(0, 10)
    );
  }
);

// ---------------------------------------------------------------------------
// For game readers that run as separate programs, such as the Python readers in AutoTime/python

/** Tells AutoTime that a game is running. Send it every few seconds while the game sends data. */
router.post('/telemetry', authenticateToken, (req: any, res: Response, next: NextFunction) => {
  const game = req.body?.game;
  if (!isString(game)) return next(new ApiRequestMalformedError("'game' parameter missing"));
  ReadyStatus.SetTelemetryReceived(game);
  res.json({ driver: getCurrentDriver() });
});

/** Adds a finished lap for the current driver. Responds with what happened to it. */
router.post('/lap', authenticateToken, (req: any, res: Response, next: NextFunction) => {
  const lap = parseLap(req.body);
  if (typeof lap === 'string') return next(new ApiRequestMalformedError(lap));
  submitLap(lap)
    .then((result) => res.json({ result }))
    .catch(next);
});

function isString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function optionalString(value: any): string | undefined {
  return isString(value) ? value : undefined;
}

/** Checks a lap sent to /lap. Returns the lap, or what is wrong with it. */
function parseLap(body: any): GameLap | string {
  if (body == null) return 'Missing body';
  for (const field of ['id', 'game']) {
    if (!isString(body[field])) return `'${field}' must be a string`;
  }
  if (!Number.isInteger(body.millis) || body.millis <= 0) return "'millis' must be a positive integer";
  if (typeof body.valid !== 'boolean') return "'valid' must be a boolean";
  if (body.weather !== 'Dry' && body.weather !== 'Wet') return "'weather' must be 'Dry' or 'Wet'";
  for (const part of ['track', 'car', 'tyre']) {
    if (!isString(body[part]?.name)) return `'${part}.name' must be a string`;
  }

  return {
    id: body.id,
    game: body.game,
    millis: body.millis,
    valid: body.valid,
    weather: body.weather,
    track: {
      name: body.track.name,
      fullName: optionalString(body.track.fullName),
      country: optionalString(body.track.country),
    },
    car: { name: body.car.name, fullName: optionalString(body.car.fullName) },
    tyre: { name: body.tyre.name, fullName: optionalString(body.tyre.fullName) },
  };
}

module.exports = router;
