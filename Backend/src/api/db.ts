import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '../.env'});

import express, { Response, NextFunction, Router } from 'express';
import * as sql from 'tedious';
import { randomBytes } from 'crypto';
import { usernameParam, timeParam, timeIDParam, loginParam, shortNameParam } from './validations';
import { AuthenticationError, DatabaseConnectionError, JwtToken, JwtTokenBody } from '../utils';
import { Token, User, Time, DBTime, Config, DBConfig, DBGame, DBWeather, DBTrack, DBCar, Game, DBCountry, Country, Track, Car, Weather, Login } from '@shared/api';

import { _CAR_, _CONFIG_, _COUNTRY_, _GAME_, _TIME_, _TRACK_, _WEATHER_ } from './dbObjects';
import { TimeSummary, TrackSummary } from '@shared/dataStructures';

const router: Router = express.Router();


const jwt = require('jsonwebtoken');

router.post('/get-token', loginParam, async (req: any, res: Response, next: NextFunction) => {
    const username: string | null = await login(req.login);
    if(username == null) return next(new AuthenticationError("Invalid username or password"));

    const user: User = getUser(username);
    const token: string = randomBytes(64).toString('hex');
    
    const jwtTokenBody: JwtTokenBody = new JwtTokenBody(user, token);
    const jwtToken: JwtToken = jwtTokenBody.sign();
    const exp = getExpDateFromSignedToken(jwtToken);
    if(exp instanceof Error) return next(exp);

    const response: Token = { jwt: jwtToken, expires: exp };
    return res.json(response);
});

router.get('/me', authenticateToken, (req: any, res: Response) => {
    const user = req.jwtTokenBody.user;
    res.json(user);
});

router.get('/get-user-times', /*authenticateToken*/usernameParam, (req: any, res: Response, next: NextFunction) => {
    const user: User = req.user;
    getUserTimes(user).then(times => res.json(times)).catch(next);
});

router.get('/get-track-summary', /*authenticateToken*/shortNameParam, (req: any, res: Response, next: NextFunction) => {
    const shortName: string = req.query.shortName;
    getTrackSummary(shortName).then(summary => res.json(summary)).catch(next);
});

router.post('/add-time', /*authenticateToken,*/ usernameParam, timeParam, async (req: any, res: Response, next: NextFunction) => {
    const username: string = req.user;
    const time: string = req.time;
    const configID: number = req.configID;
    const valid: boolean = req.valid;
    console.log(username);
    addTime(time, username, configID, valid).then(product => res.json(product)).catch(next);
});

router.post('/remove-time', /*authenticateToken,*/ usernameParam, timeIDParam, async (req: any, res: Response, next: NextFunction) => {
    const timeID = req.timeID;
    removeTime(timeID).then(product => res.json(product)).catch(next);
});

async function getDBConnection(): Promise<sql.Connection> {
    return new Promise((resolve, reject) => {
        const config = {
            server:  'localhost',
            authentication: {
                type: 'default',
                options: {
                    userName: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD
                }
            },
            options: {
                database:  process.env.DB_DATABASE,
                instanceName: 'SQLEXPRESS',
                rowCollectionOnRequestCompletion: true,
                trustServerCertificate: true
            }
          };
    
        const conn = new sql.Connection(config);
    
        conn.on('connect', (err) => {
            if(err) {
                console.error("Could not connect:");
                console.error(err);
                reject(err as sql.ConnectionError != null ? new DatabaseConnectionError() : err);
            }
            console.log('Connected');
            resolve(conn);
        });
        
        conn.connect();
    });
}

async function getUserTimes(user: User): Promise<TimeSummary[]> {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM GetUserTimes(@Username) ORDER BY Time";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });

        req.addParameter('Username', sql.TYPES.VarChar, user.username);
        resolve(getTimes(req));
    });
}

async function getTrackTimes(track: Track): Promise<TimeSummary[]> {
    return new Promise(async (resolve, reject) => {
        const query = "SELECT * FROM GetTrackTimes(@TrackID) ORDER BY Time";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });

        req.addParameter('TrackID', sql.TYPES.Int, track.id);
        resolve(getTimes(req));
    });
}

async function getTrackSummary(shortName: string): Promise<TrackSummary> {
    return new Promise(async (resolve, reject) => {
        let track: Track | null = await getTrackFromShortName(shortName);
        if(track == null) 
            return reject(new Error("Track not found"));

        console.log(track);
        let times: TimeSummary[] = await getTrackTimes(track);
        resolve({
            track: track,
            times: times
        })
    });
}

async function getTimes(req: sql.Request): Promise<TimeSummary[]> {
    return new Promise((resolve, reject) => {
        let times: TimeSummary[] = [];
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('row', cols => {
                let data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbTime: DBTime = parseIntoInterface(data, _TIME_);
                times.push(dbToTimeSummary(dbTime));
            });
            req.on('requestCompleted', () => { resolve(times) });
        })
        .catch(reject);
    });
}

async function getTrackFromShortName(shortName: string): Promise<Track | null> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "SELECT * FROM GetTrackFromShortName(@ShortName)";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('ShortName', sql.TYPES.VarChar, shortName);
            let track: Track | null = null;
            conn.execSql(req);
            req.on('row', cols => {
                let data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbTrack: DBTrack = parseIntoInterface(data, _TRACK_);
                const dbCountry: DBCountry = parseIntoInterface(data, _COUNTRY_, 'Country');
                track = dbToTrack(dbTrack, dbCountry);
            });
            req.on('requestCompleted', () => { resolve(track) });
        })
        .catch(reject);
    });
}

async function addTime(time: string, username: string, configID: number, valid: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddTime @Time, @Username, @ConfigID, @Valid";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Time', sql.TYPES.Time, time);
            req.addParameter('Username', sql.TYPES.VarChar, username);
            req.addParameter('ConfigID', sql.TYPES.Int, configID);
            req.addParameter('Valid', sql.TYPES.Bit, valid);
            
            conn.execSql(req);
            req.on('requestCompleted', () => { resolve() });
        })
        .catch(reject);
    });
}

async function removeTime(timeID: number): Promise<void> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE RemoveTime @TimeID";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('TimeID', sql.TYPES.Time, timeID);
            
            conn.execSql(req);
            req.on('requestCompleted', () => { resolve() });
        })
        .catch(reject);
    });
}


function getUser(username: string): User {    
    return {
        username: username
    };
}

async function login(login: Login) : Promise<string | null> {
    return new Promise((resolve, reject) => {
        let response: string | null = null;
        getDBConnection()
        .then(conn => {
            const query = "SELECT * FROM dbo.Login(@Username, @Password)";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Username', sql.TYPES.VarChar, login.username);
            req.addParameter('Password', sql.TYPES.VarChar, login.password);
            
            conn.execSql(req);
            req.on('row', cols => {
                response = cols.length > 0 ? cols[0].value : null;
            });
            req.on('requestCompleted', () => { resolve(response) });
        })
        .catch(reject);
    });
}

async function authenticateToken(req: any, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers['authorization'];
    const token: JwtToken = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return next(new AuthenticationError('Error: Missing access token'));
    }
    else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, jwtTokenBody: JwtTokenBody) => {
            if(err) return next(new AuthenticationError('Error: Access token invalid'));
            req.jwtTokenBody = jwtTokenBody;
            next();
        });
    }
}

function getExpDateFromSignedToken(token: JwtToken) {
    const tokenBody = decodeJwtToken(token);
    if(tokenBody instanceof Error) return tokenBody;
    
    return tokenBody.exp * 1000;
}

function decodeJwtToken(token: JwtToken) {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch(e: any) {
        if(e instanceof jwt.JsonWebTokenError)
            return new AuthenticationError('Error: Access token invalid');
        else
            return new Error(e);
    }
}

function parseIntoInterface(object: any, template: any, prefix: string = ''): any {
    let parsed: any = {};
    for(const key of Object.keys(template)) {
        if(Object.keys(object).includes(prefix + key)){
            parsed[key] = object[prefix + key];
        }
    }
    return parsed;
}

function dbToGame(dbGame: DBGame): Game {
    return {
        id: dbGame.ID,
        name: dbGame.Name
    }
}

function dbToCountry(dbCountry: DBCountry): Country {
    return {
        id: dbCountry.ID,
        fullName: dbCountry.FullName,
        shortName: dbCountry.ShortName
    }
}

function dbToTrack(dbTrack: DBTrack, dbCountry: DBCountry): Track {
    return {
        id: dbTrack.ID,
        fullName: dbTrack.FullName,
        shortName: dbTrack.ShortName,
        country: dbToCountry(dbCountry)
    }
}

function dbToCar(dbCar: DBCar): Car {
    return {
        id: dbCar.ID,
        fullName: dbCar.FullName,
        shortName: dbCar.ShortName
    }
}

function dbToWeather(dbWeather: DBWeather): Weather {
    return {
        id: dbWeather.ID,
        name: dbWeather.Name
    }
}

function dbToConfig(dbConfig: DBConfig, dbGame: DBGame, dbTrack: DBTrack, dbCar: DBCar, dbWeather: DBWeather, dbCountry: DBCountry): Config {
    return {
        id: dbConfig.ID,
        description: dbConfig.Description,
        game: dbToGame(dbGame),
        track: dbToTrack(dbTrack, dbCountry),
        car: dbToCar(dbCar),
        weather: dbToWeather(dbWeather),
        customSetup: dbConfig.CustomSetup,
    }
}

function dbToTime(dbTime: DBTime, dbConfig: DBConfig, dbGame: DBGame, dbTrack: DBTrack, dbCar: DBCar, dbWeather: DBWeather, dbCountry: DBCountry): Time {
    return {
        id: dbTime.ID,
        time: dbTime.Time,
        millis: dbTime.Millis,
        username: dbTime.Username,
        config: dbToConfig(dbConfig, dbGame, dbTrack, dbCar, dbWeather, dbCountry),
        valid: dbTime.Valid
    }
}

function dbToTimeSummary(dbTime: DBTime): TimeSummary {
    return {
        id: dbTime.ID,
        time: dbTime.Time,
        millis: dbTime.Millis,
        username: dbTime.Username
    }
}

module.exports = router;