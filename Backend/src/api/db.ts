import express, { Response, NextFunction, Router } from 'express';
import { randomBytes } from 'crypto';
import {
  timeParam,
  timeIDParam,
  loginParam,
  shortNameParam,
  validParam,
  addTimeParam,
  carIDParam,
  gameIDParam,
  shortAndFullNameParam,
  nameParam,
  tyreIDParam,
  weatherIDParam,
  trackIDParam,
  countryIDParam,
  userIDParam,
  configIDParam,
  descriptionParam,
  alpha2CodeParam,
  setupIDParam,
  autoTimeParam,
} from '../shared/validations';
import { AuthenticationError, authenticateToken, log } from '../shared/utils';
import { JwtToken, JwtTokenBody } from '../shared/utils';
import { Token, User } from '../shared/api';
import * as queries from '../db/queries';
import * as commands from '../db/commands';

const router: Router = express.Router();

const jwt = require('jsonwebtoken');

/** Wraps a route so that its result is sent as JSON and errors go to the error handler */
function respond(handler: (req: any) => Promise<unknown>) {
  return (req: any, res: Response, next: NextFunction) => {
    handler(req)
      .then((result) => res.json(result))
      .catch(next);
  };
}

/** The config parts of a request, as validated by the ID params */
function configIds(req: any) {
  return {
    gameId: req.gameID as number,
    trackId: req.trackID as number,
    carId: req.carID as number,
    weatherId: req.weatherID as number,
    tyreId: req.tyreID as number,
    setupId: req.setupID as number,
  };
}

router.post('/get-token', loginParam, async (req: any, res: Response, next: NextFunction) => {
  log('Getting token...');
  const user: User | null = await queries.login(req.login.username, req.login.password);
  if (user == null) return next(new AuthenticationError('Invalid username or password'));

  const token: string = randomBytes(64).toString('hex');

  const jwtTokenBody: JwtTokenBody = new JwtTokenBody(user, token);
  const jwtToken: JwtToken = jwtTokenBody.sign();
  const exp = getExpDateFromSignedToken(jwtToken);
  if (exp instanceof Error) return next(exp);

  const response: Token = { jwt: jwtToken, expires: exp };
  return res.json(response);
});

router.get('/me', authenticateToken, (req: any, res: Response) => {
  log('Getting me...');
  res.json(req.jwtTokenBody.user);
});

router.get(
  '/get-user-times',
  nameParam,
  respond((req) => {
    log(`Getting user times for user '${req.name}'...`);
    return queries.getUserSummary(req.name);
  })
);

router.get(
  '/get-track-summary',
  shortNameParam,
  respond((req) => {
    log(`Getting track summary for ${req.query.shortName}...`);
    return queries.getTrackSummary(req.query.shortName);
  })
);

router.get(
  '/get-users',
  respond(() => {
    log('Getting users...');
    return queries.getUsers();
  })
);

router.get(
  '/get-user-configs',
  respond(() => {
    log('Getting user configs...');
    return queries.getConfigs();
  })
);

router.get(
  '/get-games',
  respond(() => {
    log('Getting games...');
    return queries.getGames();
  })
);

router.get(
  '/get-tracks',
  respond(() => {
    log('Getting tracks...');
    return queries.getTracks();
  })
);

router.get(
  '/get-cars',
  respond(() => {
    log('Getting cars...');
    return queries.getCars();
  })
);

router.get(
  '/get-weathers',
  respond(() => {
    log('Getting weathers...');
    return queries.getWeathers();
  })
);

router.get(
  '/get-tyres',
  respond(() => {
    log('Getting tyres...');
    return queries.getTyres();
  })
);

router.get(
  '/get-setups',
  respond(() => {
    log('Getting setups...');
    return queries.getSetups();
  })
);

router.get(
  '/get-countries',
  respond(() => {
    log('Getting countries...');
    return queries.getCountries();
  })
);

router.get(
  '/get-records',
  respond(() => {
    log('Getting records...');
    return queries.getRecords();
  })
);

router.post(
  '/get-authentic-track-record',
  trackIDParam,
  respond((req) => {
    log(`Getting authentic record for track ID ${req.trackID}...`);
    return queries.getAuthenticRecord(req.trackID);
  })
);

router.post(
  '/get-number-of-records',
  nameParam,
  respond((req) => {
    log(`Getting number of records for user ${req.name}...`);
    return queries.getNumberOfRecordsFromUsername(req.name);
  })
);

router.post(
  '/add-time',
  authenticateToken,
  timeParam,
  userIDParam,
  validParam,
  addTimeParam,
  respond((req) => {
    log(`Adding time: ${req.time} for user ${req.userID}...`);
    const config = req.configID == null ? configIds(req) : { configId: req.configID as number };
    return commands.addTime(req.time, req.userID, req.valid, config);
  })
);

router.post(
  '/add-auto-time',
  authenticateToken,
  autoTimeParam,
  respond((req) => {
    log(`Adding AutoTime time: ${req.autoTime.time} for user ${req.autoTime.userId}...`);
    return commands.addAutoTime(req.autoTime);
  })
);

router.post(
  '/remove-time',
  authenticateToken,
  timeIDParam,
  respond((req) => {
    log(`Removing time ${req.timeID}...`);
    return commands.removeTime(req.timeID);
  })
);

router.post(
  '/update-car',
  authenticateToken,
  carIDParam,
  shortAndFullNameParam,
  respond((req) => {
    log(`Updating car ${req.carID}...`);
    return commands.updateCar(req.carID, req.fullName, req.shortName);
  })
);

router.post(
  '/create-car',
  authenticateToken,
  shortAndFullNameParam,
  respond((req) => {
    log(`Creating car ${req.shortName}...`);
    return commands.createCar(req.fullName, req.shortName);
  })
);

router.post(
  '/update-game',
  authenticateToken,
  gameIDParam,
  nameParam,
  respond((req) => {
    log(`Updating game ${req.gameID}...`);
    return commands.updateGame(req.gameID, req.name);
  })
);

router.post(
  '/create-game',
  authenticateToken,
  nameParam,
  respond((req) => {
    log(`Creating game ${req.name}...`);
    return commands.createGame(req.name);
  })
);

router.post(
  '/update-tyre',
  authenticateToken,
  tyreIDParam,
  shortAndFullNameParam,
  respond((req) => {
    log(`Updating tyre ${req.tyreID}...`);
    return commands.updateTyre(req.tyreID, req.fullName, req.shortName);
  })
);

router.post(
  '/create-tyre',
  authenticateToken,
  shortAndFullNameParam,
  respond((req) => {
    log(`Creating tyre ${req.shortName}...`);
    return commands.createTyre(req.fullName, req.shortName);
  })
);

router.post(
  '/update-user',
  authenticateToken,
  userIDParam,
  nameParam,
  respond((req) => {
    log(`Updating user ${req.userID}...`);
    return commands.updateUser(req.userID, req.name);
  })
);

router.post(
  '/create-user',
  authenticateToken,
  nameParam,
  respond((req) => {
    log(`Creating user ${req.name}...`);
    return commands.createUser(req.name);
  })
);

router.post(
  '/update-weather',
  authenticateToken,
  weatherIDParam,
  nameParam,
  respond((req) => {
    log(`Updating weather ${req.weatherID}...`);
    return commands.updateWeather(req.weatherID, req.name);
  })
);

router.post(
  '/create-weather',
  authenticateToken,
  nameParam,
  respond((req) => {
    log(`Creating weather ${req.name}...`);
    return commands.createWeather(req.name);
  })
);

router.post(
  '/update-track',
  authenticateToken,
  trackIDParam,
  countryIDParam,
  shortAndFullNameParam,
  respond((req) => {
    log(`Updating track ${req.trackID}...`);
    return commands.updateTrack(req.trackID, req.countryID, req.fullName, req.shortName);
  })
);

router.post(
  '/create-track',
  authenticateToken,
  countryIDParam,
  shortAndFullNameParam,
  respond((req) => {
    log(`Creating track ${req.shortName}...`);
    return commands.createTrack(req.countryID, req.fullName, req.shortName);
  })
);

router.post(
  '/update-country',
  authenticateToken,
  countryIDParam,
  shortAndFullNameParam,
  alpha2CodeParam,
  respond((req) => {
    log(`Updating country ${req.countryID}...`);
    return commands.updateCountry(req.countryID, req.fullName, req.shortName, req.alpha2Code);
  })
);

router.post(
  '/create-country',
  authenticateToken,
  shortAndFullNameParam,
  alpha2CodeParam,
  respond((req) => {
    log(`Creating country ${req.shortName}...`);
    return commands.createCountry(req.fullName, req.shortName, req.alpha2Code);
  })
);

router.post(
  '/update-config',
  authenticateToken,
  configIDParam,
  descriptionParam,
  gameIDParam,
  trackIDParam,
  carIDParam,
  weatherIDParam,
  tyreIDParam,
  setupIDParam,
  respond((req) => {
    log(`Updating config ${req.configID}...`);
    return commands.updateConfig(req.configID, req.description, configIds(req));
  })
);

router.post(
  '/create-config',
  authenticateToken,
  descriptionParam,
  gameIDParam,
  trackIDParam,
  carIDParam,
  weatherIDParam,
  tyreIDParam,
  setupIDParam,
  respond((req) => {
    log(`Creating config ${req.description}...`);
    return commands.createConfig(req.description, configIds(req));
  })
);

function getExpDateFromSignedToken(token: JwtToken) {
  const tokenBody = decodeJwtToken(token);
  if (tokenBody instanceof Error) return tokenBody;

  return tokenBody.exp * 1000;
}

function decodeJwtToken(token: JwtToken) {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (e: any) {
    if (e instanceof jwt.JsonWebTokenError)
      return new AuthenticationError('Error: Access token invalid');
    else return new Error(e);
  }
}

module.exports = router;
