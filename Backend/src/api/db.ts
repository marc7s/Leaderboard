import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '../.env'});

import express, { Response, NextFunction, Router } from 'express';
import * as sql from 'tedious';
import { randomBytes } from 'crypto';
import { timeParam, timeIDParam, loginParam, shortNameParam, validParam, customSetupParam, addTimeParam, carIDParam, gameIDParam, shortAndFullNameParam, nameParam, tyreIDParam, weatherIDParam, trackIDParam, countryIDParam, userIDParam, configIDParam, descriptionParam } from './validations';
import { AuthenticationError, DatabaseConnectionError, JwtToken, JwtTokenBody } from '../utils';
import { Token, User, Time, DBTime, Config, DBConfig, DBGame, DBWeather, DBTrack, DBCar, Game, DBCountry, Country, Track, Car, Weather, Login, Tyre, DBTyre, DBUser } from '@shared/api';

import { _CAR_, _CONFIG_, _COUNTRY_, _GAME_, _TIME_, _TRACK_, _TYRE_, _USER_, _WEATHER_ } from './dbObjects';
import { LapRecord, TimeSummary, TrackSummary } from '@shared/dataStructures';
import { log } from '../server';

const router: Router = express.Router();

const jwt = require('jsonwebtoken');

router.post('/get-token', loginParam, async (req: any, res: Response, next: NextFunction) => {
    log('Getting token...');
    const user: User | null = await login(req.login);
    if(user == null) return next(new AuthenticationError("Invalid username or password"));

    const token: string = randomBytes(64).toString('hex');
    
    const jwtTokenBody: JwtTokenBody = new JwtTokenBody(user, token);
    const jwtToken: JwtToken = jwtTokenBody.sign();
    const exp = getExpDateFromSignedToken(jwtToken);
    if(exp instanceof Error) return next(exp);

    const response: Token = { jwt: jwtToken, expires: exp };
    return res.json(response);
});

router.get('/me', authenticateToken, (req: any, res: Response) => {
    log('Getting me...');
    const user = req.jwtTokenBody.user;
    res.json(user);
});

router.get('/get-user-times', nameParam, (req: any, res: Response, next: NextFunction) => {
    log('Getting user times...');
    const username: string = req.name;
    getUserTimesFromUsername(username).then(times => res.json(times)).catch(next);
});

router.get('/get-track-summary', shortNameParam, (req: any, res: Response, next: NextFunction) => {
    log('Getting track summary...');
    const shortName: string = req.query.shortName;
    getTrackSummary(shortName).then(summary => res.json(summary)).catch(next);
});

router.get('/get-users', (req: any, res: Response, next: NextFunction) => {
    log('Getting users...');
    getUsers().then(users => res.json(users)).catch(next);
});

router.get('/get-user-configs', (req: any, res: Response, next: NextFunction) => {
    log('Getting user configs...');
    getConfigs().then(configs => res.json(configs)).catch(next);
});

router.get('/get-games', (req: any, res: Response, next: NextFunction) => {
    log('Getting games...');
    getGames().then(games => res.json(games)).catch(next);
});

router.get('/get-tracks', (req: any, res: Response, next: NextFunction) => {
    log('Getting tracks...');
    getTracks().then(tracks => res.json(tracks)).catch(next);
});

router.get('/get-cars', (req: any, res: Response, next: NextFunction) => {
    log('Getting cars...');
    getCars().then(cars => res.json(cars)).catch(next);
});

router.get('/get-weathers', (req: any, res: Response, next: NextFunction) => {
    log('Getting weathers...');
    getWeathers().then(weathers => res.json(weathers)).catch(next);
});

router.get('/get-tyres', (req: any, res: Response, next: NextFunction) => {
    log('Getting tyres...');
    getTyres().then(tyres => res.json(tyres)).catch(next);
});

router.get('/get-countries', (req: any, res: Response, next: NextFunction) => {
    log('Getting countries...');
    getCountries().then(countries => res.json(countries)).catch(next);
});

router.get('/get-records', (req: any, res: Response, next: NextFunction) => {
    log('Getting records...');
    getRecords().then(records => res.json(records)).catch(next);
});

router.post('/add-time', authenticateToken, timeParam, userIDParam, validParam, addTimeParam, async (req: any, res: Response, next: NextFunction) => {
    log('Adding time...');
    const userID: number = req.userID;
    const time: string = req.time;
    const valid: boolean = req.valid;
    
    let configID: number | null = req.configID;
    
    // If configID is null, we need to create the config first
    if(configID == null) {
        log('/add-time: Creating new config...');
        const gameID: number = req.gameID;
        const trackID: number = req.trackID;
        const carID: number = req.carID;
        const weatherID: number = req.weatherID;
        const tyreID: number = req.tyreID;
        const customSetup: boolean = req.customSetup;
        
        configID = await getOrAddConfig(gameID, trackID, carID, weatherID, tyreID, customSetup);
    }
        

    if(configID !== null)
        addTime(time, userID, configID, valid).then(time => res.json(time)).catch(next);
});

router.post('/remove-time', authenticateToken, timeIDParam, async (req: any, res: Response, next: NextFunction) => {
    log('Removing time...');
    const timeID: number = req.timeID;
    
    removeTime(timeID).then(product => res.json(product)).catch(next);
});

router.post('/update-car', authenticateToken, carIDParam, shortAndFullNameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Updating car...');
    const carID: number = req.carID;
    const shortName: string = req.shortName;
    const fullName: string = req.fullName;
    
    updateCar(carID, fullName, shortName).then(success => res.json(success)).catch(next);
});

router.post('/create-car', authenticateToken, shortAndFullNameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Creating car...');
    const shortName: string = req.shortName;
    const fullName: string = req.fullName;
    
    createCar(fullName, shortName).then(success => res.json(success)).catch(next);
});

router.post('/update-game', authenticateToken, gameIDParam, nameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Updating game...');
    const gameID: number = req.gameID;
    const name: string = req.name;
    
    updateGame(gameID, name).then(success => res.json(success)).catch(next);
});

router.post('/create-game', authenticateToken, nameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Creating game...');
    const name: string = req.name;
    
    createGame(name).then(success => res.json(success)).catch(next);
});

router.post('/update-tyre', authenticateToken, tyreIDParam, shortAndFullNameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Updating tyre...');
    const tyreID: number = req.tyreID;
    const shortName: string = req.shortName;
    const fullName: string = req.fullName;
    
    updateTyre(tyreID, fullName, shortName).then(success => res.json(success)).catch(next);
});

router.post('/create-tyre', authenticateToken, shortAndFullNameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Creating tyre...');
    const shortName: string = req.shortName;
    const fullName: string = req.fullName;
    
    createTyre(fullName, shortName).then(success => res.json(success)).catch(next);
});

router.post('/update-user', authenticateToken, userIDParam, nameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Updating user...');
    const userID: number = req.userID;
    const newUsername: string = req.name;
    
    updateUser(userID, newUsername).then(success => res.json(success)).catch(next);
});

router.post('/create-user', authenticateToken, nameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Creating user...');
    const username: string = req.name;
    
    createUser(username).then(success => res.json(success)).catch(next);
});

router.post('/update-weather', authenticateToken, weatherIDParam, nameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Updating weather...');
    const weatherID: number = req.weatherID;
    const name: string = req.name;
    
    updateWeather(weatherID, name).then(success => res.json(success)).catch(next);
});

router.post('/create-weather', authenticateToken, nameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Creating weather...');
    const name: string = req.name;
    
    createWeather(name).then(success => res.json(success)).catch(next);
});

router.post('/update-track', authenticateToken, trackIDParam, countryIDParam, shortAndFullNameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Updating track...');
    const trackID: number = req.trackID;
    const countryID: number = req.countryID;
    const shortName: string = req.shortName;
    const fullName: string = req.fullName;
    
    updateTrack(trackID, countryID, fullName, shortName).then(success => res.json(success)).catch(next);
});

router.post('/create-track', authenticateToken, countryIDParam, shortAndFullNameParam, async (req: any, res: Response, next: NextFunction) => {
    log('Creating track...');
    const countryID: number = req.countryID;
    const shortName: string = req.shortName;
    const fullName: string = req.fullName;
    
    createTrack(countryID, fullName, shortName).then(success => res.json(success)).catch(next);
});

router.post('/update-config', 
        authenticateToken, 
        configIDParam, 
        descriptionParam, 
        gameIDParam,
        trackIDParam,
        carIDParam,
        weatherIDParam,
        tyreIDParam, 
        customSetupParam,
        async (req: any, res: Response, next: NextFunction) => {
    log('Updating config...');
    const configID: number = req.configID;
    const description: string = req.description;
    const gameID: number = req.gameID;
    const trackID: number = req.trackID;
    const carID: number = req.carID;
    const weatherID: number = req.weatherID;
    const tyreID: number = req.tyreID;
    const customSetup: boolean = req.customSetup;

    updateConfig(configID, description, gameID, trackID, carID, weatherID, tyreID, customSetup).then(success => res.json(success)).catch(next);
});

router.post('/create-config', 
        authenticateToken, 
        descriptionParam, 
        gameIDParam,
        trackIDParam,
        carIDParam,
        weatherIDParam,
        tyreIDParam, 
        customSetupParam,
        async (req: any, res: Response, next: NextFunction) => {
    log('Creating config...');
    const description: string = req.description;
    const gameID: number = req.gameID;
    const trackID: number = req.trackID;
    const carID: number = req.carID;
    const weatherID: number = req.weatherID;
    const tyreID: number = req.tyreID;
    const customSetup: boolean = req.customSetup;

    createConfig(description, gameID, trackID, carID, weatherID, tyreID, customSetup).then(success => res.json(success)).catch(next);
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
            resolve(conn);
        });
        
        conn.connect();
    });
}

async function getUserTimesFromUsername(username: string): Promise<TimeSummary[]> {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM GetUserTimes(@UserID) ORDER BY Time ASC";
        const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
            if(err) reject(err);
        });
        req.on('error', err => { reject(err) });
        req.addParameter('Username', sql.TYPES.VarChar, username);
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

async function getCountries(): Promise<Country[]> {
    return new Promise((resolve, reject) => {
        const countries: Country[] = [];
        const query = "SELECT * FROM GetCountries()";
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
                const dbCountry: DBCountry = parseIntoInterface(data, _COUNTRY_);
                
                countries.push(dbToCountry(dbCountry));
            });
            req.on('requestCompleted', () => { resolve(countries) });
        })
        .catch(reject);
    });
}

async function getRecords(): Promise<LapRecord[]> {
    return new Promise((resolve, reject) => {
        const records: LapRecord[] = [];
        const query = "SELECT * FROM GetRecords()";
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
                const dbTime: DBTime = parseIntoInterface(data, _TIME_);
                const dbConfig: DBConfig = parseIntoInterface(data, _CONFIG_, 'Config');
                const dbGame: DBGame = parseIntoInterface(data, _GAME_, 'Game');
                const dbTrack: DBTrack = parseIntoInterface(data, _TRACK_, 'Track');
                const dbCar: DBCar = parseIntoInterface(data, _CAR_, 'Car');
                const dbWeather: DBWeather = parseIntoInterface(data, _WEATHER_, 'Weather');
                const dbTyre: DBTyre = parseIntoInterface(data, _TYRE_, 'Tyre');
                const dbCountry: DBCountry = parseIntoInterface(data, _COUNTRY_, 'Country');

                const config: Config = dbToConfig(dbConfig, dbGame, dbTrack, dbCar, dbWeather, dbTyre, dbCountry);
                const time: Time = {
                  id: dbTime.ID,
                  time: dbTime.Time,
                  millis: dbTime.Millis,
                  username: dbTime.Username,
                  config: config,
                  valid: dbTime.Valid  
                };

                records.push({ config: config, time: time });
            });
            req.on('requestCompleted', () => { resolve(records) });
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

async function addTime(time: string, userID: number, configID: number, valid: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddTime @Time, @UserID, @ConfigID, @Valid";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Time', sql.TYPES.VarChar, time);
            req.addParameter('UserID', sql.TYPES.Int, userID);
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

async function updateCar(carID: number, newFullName: string, newShortName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE UpdateCar @CarID, @NewFullName, @NewShortName";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('CarID', sql.TYPES.Int, carID);
            req.addParameter('NewShortName', sql.TYPES.VarChar, newShortName);
            req.addParameter('NewFullName', sql.TYPES.VarChar, newFullName);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function createCar(fullName: string, shortName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddCar @FullName, @ShortName";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('ShortName', sql.TYPES.VarChar, shortName);
            req.addParameter('FullName', sql.TYPES.VarChar, fullName);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function updateGame(gameID: number, newName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE UpdateGame @GameID, @NewName";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('GameID', sql.TYPES.Int, gameID);
            req.addParameter('NewName', sql.TYPES.VarChar, newName);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function createGame(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddGame @Name";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Name', sql.TYPES.VarChar, name);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function updateTyre(tyreID: number, newFullName: string, newShortName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE UpdateTyre @TyreID, @NewFullName, @NewShortName";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('TyreID', sql.TYPES.Int, tyreID);
            req.addParameter('NewShortName', sql.TYPES.VarChar, newShortName);
            req.addParameter('NewFullName', sql.TYPES.VarChar, newFullName);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function createTyre(fullName: string, shortName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddTyre @FullName, @ShortName";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('ShortName', sql.TYPES.VarChar, shortName);
            req.addParameter('FullName', sql.TYPES.VarChar, fullName);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function updateUser(userID: number, newUsername: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE UpdateUser @UserID, @NewUsername";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('UserID', sql.TYPES.Int, userID);
            req.addParameter('NewUsername', sql.TYPES.VarChar, newUsername);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function createUser(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddUser @Username";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Username', sql.TYPES.VarChar, username);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function updateWeather(weatherID: number, newName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE UpdateWeather @WeatherID, @NewName";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('WeatherID', sql.TYPES.Int, weatherID);
            req.addParameter('NewName', sql.TYPES.VarChar, newName);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function createWeather(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddWeather @Name";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Name', sql.TYPES.VarChar, name);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function updateTrack(trackID: number, countryID: number, newFullName: string, newShortName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE UpdateTrack @TrackID, @CountryID, @NewFullName, @NewShortName";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('TrackID', sql.TYPES.Int, trackID);
            req.addParameter('CountryID', sql.TYPES.Int, countryID);
            req.addParameter('NewShortName', sql.TYPES.VarChar, newShortName);
            req.addParameter('NewFullName', sql.TYPES.VarChar, newFullName);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function createTrack(countryID: number, fullName: string, shortName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddTrack @CountryID, @FullName, @ShortName";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('CountryID', sql.TYPES.Int, countryID);
            req.addParameter('ShortName', sql.TYPES.VarChar, shortName);
            req.addParameter('FullName', sql.TYPES.VarChar, fullName);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function updateConfig(configID: number, description: string, gameID: number, trackID: number, carID: number, weatherID: number, tyreID: number, customSetup: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE UpdateConfig @ConfigID, @Description, @GameID, @TrackID, @CarID, @WeatherID, @TyreID, @CustomSetup";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('ConfigID', sql.TYPES.Int, configID);
            req.addParameter('Description', sql.TYPES.VarChar, description);
            req.addParameter('GameID', sql.TYPES.Int, gameID);
            req.addParameter('TrackID', sql.TYPES.Int, trackID);
            req.addParameter('CarID', sql.TYPES.Int, carID);
            req.addParameter('WeatherID', sql.TYPES.Int, weatherID);
            req.addParameter('TyreID', sql.TYPES.Int, tyreID);
            req.addParameter('CustomSetup', sql.TYPES.Bit, customSetup);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function createConfig(description: string, gameID: number, trackID: number, carID: number, weatherID: number, tyreID: number, customSetup: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
        getDBConnection()
        .then(conn => {
            const query = "EXECUTE AddConfig @Description, @GameID, @TrackID, @CarID, @WeatherID, @TyreID, @CustomSetup";
            const req: sql.Request = new sql.Request(query, (err, rowCount, rows) => {
                if(err) reject(err);
            });

            req.addParameter('Description', sql.TYPES.VarChar, description);
            req.addParameter('GameID', sql.TYPES.Int, gameID);
            req.addParameter('TrackID', sql.TYPES.Int, trackID);
            req.addParameter('CarID', sql.TYPES.Int, carID);
            req.addParameter('WeatherID', sql.TYPES.Int, weatherID);
            req.addParameter('TyreID', sql.TYPES.Int, tyreID);
            req.addParameter('CustomSetup', sql.TYPES.Bit, customSetup);

            conn.execSql(req);
            req.on('error', err => { reject(err) });
            req.on('requestCompleted', () => { resolve(true) });
        })
        .catch(reject);
    });
}

async function login(login: Login) : Promise<User | null> {
    return new Promise((resolve, reject) => {
        let response: User | null = null;
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
                const usernameCol = cols.find(col => col.metadata.colName === 'Username');
                const userIDCol = cols.find(col => col.metadata.colName === 'ID');
                if(usernameCol && userIDCol) {
                    const user: User = {
                        id: userIDCol.value,
                        username: usernameCol.value
                    }
                    response = user;
                }
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
    if(token == null)
        return next(new AuthenticationError('Error: Missing access token'));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, jwtTokenBody: JwtTokenBody) => {
        if(err) return next(new AuthenticationError('Error: Access token invalid'));
        req.jwtTokenBody = jwtTokenBody;
        next();
    });
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
        id: dbUser.ID,
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