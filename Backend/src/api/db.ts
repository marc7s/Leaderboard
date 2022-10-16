import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '../.env'});

import express, { Response, NextFunction, Router } from 'express';
import * as sql from 'tedious';
import { randomBytes } from 'crypto';
import { usernameParam, timeParam, timeIDParam, loginParam, shortNameParam, validParam, customSetupParam, addTimeParam } from './validations';
import { AuthenticationError, DatabaseConnectionError, JwtToken, JwtTokenBody } from '../utils';
import { Token, User, Time, DBTime, Config, DBConfig, DBGame, DBWeather, DBTrack, DBCar, Game, DBCountry, Country, Track, Car, Weather, Login, Tyre, DBTyre, DBUser } from '@shared/api';

import { _CAR_, _CONFIG_, _COUNTRY_, _GAME_, _TIME_, _TRACK_, _TYRE_, _USER_, _WEATHER_ } from './dbObjects';
import { TimeSummary, TrackSummary } from '@shared/dataStructures';
import { equal } from 'assert';

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

router.get('/get-user-times', usernameParam, (req: any, res: Response, next: NextFunction) => {
    const user: User = req.user;
    getUserTimes(user).then(times => res.json(times)).catch(next);
});

router.get('/get-track-summary', shortNameParam, (req: any, res: Response, next: NextFunction) => {
    const shortName: string = req.query.shortName;
    getTrackSummary(shortName).then(summary => res.json(summary)).catch(next);
});

router.get('/get-users', (req: any, res: Response, next: NextFunction) => {
    getUsers().then(users => res.json(users)).catch(next);
});

router.get('/get-user-configs', (req: any, res: Response, next: NextFunction) => {
    getConfigs().then(configs => res.json(configs)).catch(next);
});

router.get('/get-games', (req: any, res: Response, next: NextFunction) => {
    getGames().then(games => res.json(games)).catch(next);
});

router.get('/get-tracks', (req: any, res: Response, next: NextFunction) => {
    getTracks().then(tracks => res.json(tracks)).catch(next);
});

router.get('/get-cars', (req: any, res: Response, next: NextFunction) => {
    getCars().then(cars => res.json(cars)).catch(next);
});

router.get('/get-weathers', (req: any, res: Response, next: NextFunction) => {
    getWeathers().then(weathers => res.json(weathers)).catch(next);
});

router.get('/get-tyres', (req: any, res: Response, next: NextFunction) => {
    getTyres().then(tyres => res.json(tyres)).catch(next);
});

router.post('/add-time', /*authenticateToken,*/ timeParam, usernameParam, validParam, addTimeParam, async (req: any, res: Response, next: NextFunction) => {
    const username: string = req.user.username;
    const time: string = req.time;
    const valid: boolean = req.valid;
    
    let configID: number | null = req.configID;
    
    // If configID is null, we need to create the config first
    if(configID == null) {
        console.log('Creating new config...');
        const gameID: number = req.gameID;
        const trackID: number = req.trackID;
        const carID: number = req.carID;
        const weatherID: number = req.weatherID;
        const tyreID: number = req.tyreID;
        const customSetup: boolean = req.customSetup;
        
        configID = await getOrAddConfig(gameID, trackID, carID, weatherID, tyreID, customSetup);
    }
        

    if(configID !== null)
        addTime(time, username, configID, valid).then(time => res.json(time)).catch(next);
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
                    userName: process.env.DB_LOGIN_NAME,
                    password: process.env.DB_LOGIN_PASSWORD
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
        const query = "SELECT * FROM GetUserTimes(@Username) ORDER BY Time ASC";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        req.on('error', err => { reject(err) });
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

async function getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        const users: User[] = [];
        const query = "SELECT * FROM GetUsers()";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbUser: DBUser = parseIntoInterface(data, _USER_);
                users.push(dbToUser(dbUser));
            });
            req.on('requestCompleted', () => { resolve(users) });
        })
        .catch(reject);
    });
}

async function getConfigs(): Promise<Config[]> {
    return new Promise((resolve, reject) => {
        const configs: Config[] = [];
        const query = "SELECT * FROM GetConfigs() WHERE Description IS NOT NULL";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbConfig: DBConfig = parseIntoInterface(data, _CONFIG_);
                const dbGame: DBGame = parseIntoInterface(data, _GAME_, 'Game');
                const dbTrack: DBTrack = parseIntoInterface(data, _TRACK_, 'Track');
                const dbCar: DBCar = parseIntoInterface(data, _CAR_, 'Car');
                const dbWeather: DBWeather = parseIntoInterface(data, _WEATHER_, 'Weather');
                const dbTyre: DBTyre = parseIntoInterface(data, _TYRE_, 'Tyre');
                const dbCountry: DBCountry = parseIntoInterface(data, _COUNTRY_, 'Country');
                
                configs.push(dbToConfig(dbConfig, dbGame, dbTrack, dbCar, dbWeather, dbTyre, dbCountry));
            });
            req.on('requestCompleted', () => { resolve(configs) });
        })
        .catch(reject);
    });
}

async function getGames(): Promise<Game[]> {
    return new Promise((resolve, reject) => {
        const games: Game[] = [];
        const query = "SELECT * FROM GetGames()";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbGame: DBGame = parseIntoInterface(data, _GAME_);
                
                games.push(dbToGame(dbGame));
            });
            req.on('requestCompleted', () => { resolve(games) });
        })
        .catch(reject);
    });
}

async function getTracks(): Promise<Track[]> {
    return new Promise((resolve, reject) => {
        const tracks: Track[] = [];
        const query = "SELECT * FROM GetTracks()";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbTrack: DBTrack = parseIntoInterface(data, _TRACK_);
                const dbCountry: DBCountry = parseIntoInterface(data, _COUNTRY_, 'Country');
                
                tracks.push(dbToTrack(dbTrack, dbCountry));
            });
            req.on('requestCompleted', () => { resolve(tracks) });
        })
        .catch(reject);
    });
}

async function getCars(): Promise<Car[]> {
    return new Promise((resolve, reject) => {
        const cars: Car[] = [];
        const query = "SELECT * FROM GetCars()";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbCar: DBCar = parseIntoInterface(data, _CAR_);
                
                cars.push(dbToCar(dbCar));
            });
            req.on('requestCompleted', () => { resolve(cars) });
        })
        .catch(reject);
    });
}

async function getWeathers(): Promise<Weather[]> {
    return new Promise((resolve, reject) => {
        const weathers: Weather[] = [];
        const query = "SELECT * FROM GetWeathers()";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbWeather: DBWeather = parseIntoInterface(data, _WEATHER_);
                
                weathers.push(dbToWeather(dbWeather));
            });
            req.on('requestCompleted', () => { resolve(weathers) });
        })
        .catch(reject);
    });
}

async function getTyres(): Promise<Tyre[]> {
    return new Promise((resolve, reject) => {
        const tyres: Tyre[] = [];
        const query = "SELECT * FROM GetTyres()";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbTyre: DBTyre = parseIntoInterface(data, _TYRE_);
                
                tyres.push(dbToTyre(dbTyre));
            });
            req.on('requestCompleted', () => { resolve(tyres) });
        })
        .catch(reject);
    });
}

async function getTrackSummary(shortName: string): Promise<TrackSummary> {
    return new Promise(async (resolve, reject) => {
        const track: Track | null = await getTrackFromShortName(shortName);
        if(track == null) 
            return reject(new Error("Track not found"));

        const times: TimeSummary[] = await getTrackTimes(track);
        resolve({
            track: track,
            times: times
        })
    });
}

async function getTimes(req: sql.Request): Promise<TimeSummary[]> {
    return new Promise((resolve, reject) => {
        const times: TimeSummary[] = [];
        getDBConnection()
        .then(conn => {
            conn.execSql(req);
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbTime: DBTime = parseIntoInterface(data, _TIME_);
                const dbConfig: DBConfig = parseIntoInterface(data, _CONFIG_, 'Config');
                
                times.push(dbToTimeSummary(dbTime, dbConfig));
            });
            req.on('error', err => { reject(err) });
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
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                const dbTrack: DBTrack = parseIntoInterface(data, _TRACK_);
                const dbCountry: DBCountry = parseIntoInterface(data, _COUNTRY_, 'Country');
                
                track = dbToTrack(dbTrack, dbCountry);
            });
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(track) });
        })
        .catch(reject);
    });
}

async function addTime(time: string, username: string, configID: number, valid: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddTime @Time, @Username, @ConfigID, @Valid";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Time', sql.TYPES.VarChar, time);
            req.addParameter('Username', sql.TYPES.VarChar, username);
            req.addParameter('ConfigID', sql.TYPES.Int, configID);
            req.addParameter('Valid', sql.TYPES.Bit, valid);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
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
            req.on('error', err => { reject(err) });
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
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                response = cols.length > 0 ? cols[0].value : null;
            });
            req.on('requestCompleted', () => { resolve(response) });
        })
        .catch(reject);
    });
}

async function getOrAddConfig(gameID: number, trackID: number, carID: number, weatherID: number, tyreID: number, customSetup: boolean, description?: string) : Promise<number | null> {
    return new Promise((resolve, reject) => {
        let response: number = NaN;
    
        getDBConnection().then(conn => {
            const query = "EXECUTE GetOrAddConfig @Description, @GameID, @TrackID, @CarID, @WeatherID, @TyreID, @CustomSetup";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Description', sql.TYPES.VarChar, sql.TYPES.Null);
            req.addParameter('GameID', sql.TYPES.Int, gameID);
            req.addParameter('TrackID', sql.TYPES.Int, trackID);
            req.addParameter('CarID', sql.TYPES.Int, carID);
            req.addParameter('WeatherID', sql.TYPES.Int, weatherID);
            req.addParameter('TyreID', sql.TYPES.Int, tyreID);
            req.addParameter('CustomSetup', sql.TYPES.Bit, customSetup);
            
            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('row', cols => {
                const data: any = {};
                cols.map(col => { data[col.metadata.colName] = col.value });
                response = data.ID;
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

function dbToUser(dbUser: DBUser): User {
    return {
        username: dbUser.Username
    }
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

function dbToTyre(dbTyre: DBTyre): Tyre {
    return {
        id: dbTyre.ID,
        fullName: dbTyre.FullName,
        shortName: dbTyre.ShortName
    }
}

function dbToConfig(dbConfig: DBConfig, dbGame: DBGame, dbTrack: DBTrack, dbCar: DBCar, dbWeather: DBWeather, dbTyre: DBTyre, dbCountry: DBCountry): Config {
    return {
        id: dbConfig.ID,
        description: dbConfig.Description,
        game: dbToGame(dbGame),
        track: dbToTrack(dbTrack, dbCountry),
        car: dbToCar(dbCar),
        weather: dbToWeather(dbWeather),
        tyre: dbToTyre(dbTyre),
        customSetup: dbConfig.CustomSetup,
    }
}

function dbToTime(dbTime: DBTime, dbConfig: DBConfig, dbGame: DBGame, dbTrack: DBTrack, dbCar: DBCar, dbWeather: DBWeather, dbTyre: DBTyre, dbCountry: DBCountry): Time {
    return {
        id: dbTime.ID,
        time: dbTime.Time,
        millis: dbTime.Millis,
        username: dbTime.Username,
        config: dbToConfig(dbConfig, dbGame, dbTrack, dbCar, dbWeather, dbTyre, dbCountry),
        valid: dbTime.Valid
    }
}

function dbToTimeSummary(dbTime: DBTime, dbConfig: DBConfig): TimeSummary {
    return {
        id: dbTime.ID,
        time: dbTime.Time,
        millis: dbTime.Millis,
        username: dbTime.Username,
        weather: dbTime.Weather,
        valid: dbTime.Valid,
        customSetup: dbConfig.CustomSetup
    }
}

module.exports = router;