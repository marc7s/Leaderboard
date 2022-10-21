import { Response, NextFunction } from 'express';
import { ApiRequestMalformedError } from '../utils';

function isValidUsername(username: string){return username === username.replace(/\W/g, '')}
function isValidTime(time: any){return time === time.toString()}
function isValidShortName(shortName: any){return shortName === shortName.toString()}
function isValidID(id: any){return Number.isInteger(id)}
function isValidString(string: any){return string === string.toString()}

function missing(arr: any) : boolean {
    return Array.isArray(arr) ? arr.some(val => val === MISSING) : arr === MISSING;
}

enum MissingParam { MISSING };
const MISSING = MissingParam.MISSING;

export async function loginParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const username = req.body.username ?? MISSING;
    const password = req.body.password ?? MISSING;
    req.login = null;
    
    if(missing(username) || missing(password))
        return next(new ApiRequestMalformedError("'username' or 'password' parameter missing"));
    if(!isValidUsername(username))
        return next(new ApiRequestMalformedError("'username' parameter is invalid"));

    req.login = {
        username: username,
        password: password
    };
    next();
}

export async function userIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    req.userID = null;
    const userID = req.body.userID ?? req.query.userID ?? MISSING;
    const check = checkParameter(userID, 'userID', isValidID, 'is invalid');
    if(check !== null) return next(check);

    req.userID = userID;
    next();
}

export async function shortNameParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const shortName = req.body.shortName ?? req.query.shortName ?? MISSING;
    const check = checkParameter(shortName, 'shortName', isValidShortName, 'is invalid');
    if(check !== null) return next(check);

    req.shortName = shortName;
    next();
}

export async function timeParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const time = req.body.time ?? req.query.time ?? MISSING;
    const check = checkParameter(time, 'time', isValidTime, 'is not a valid time');
    if(check !== null) return next(check);

    req.time = time;
    next();
}

export async function addTimeParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const configID = req.body.configID ?? req.configID ?? MISSING;

    if(missing(configID)) {
        // No ConfigID so we need to check that all the other parameters are present
        const gameID = req.body.gameID ?? req.query.gameID ?? MISSING;
        const trackID = req.body.trackID ?? req.query.trackID ?? MISSING;
        const carID = req.body.carID ?? req.query.carID ?? MISSING;
        const weatherID = req.body.weatherID ?? req.query.weatherID ?? MISSING;
        const tyreID = req.body.tyreID ?? req.query.tyreID ?? MISSING;
        const customSetup = req.body.customSetup ?? req.query.customSetup ?? MISSING;

        const checkGameID = checkParameter(gameID, 'gameID', Number.isInteger, 'is not an integer');
        if(checkGameID !== null) return next(checkGameID);

        const checkTrackID = checkParameter(trackID, 'trackID', Number.isInteger, 'is not an integer');
        if(checkTrackID !== null) return next(checkTrackID);

        const checkCarID = checkParameter(carID, 'carID', Number.isInteger, 'is not an integer');
        if(checkCarID !== null) return next(checkCarID);

        const checkWeatherID = checkParameter(weatherID, 'weatherID', Number.isInteger, 'is not an integer');
        if(checkWeatherID !== null) return next(checkWeatherID);

        const checkTyreID = checkParameter(tyreID, 'tyreID', Number.isInteger, 'is not an integer');
        if(checkTyreID !== null) return next(checkTyreID);

        const checkCustomSetup = checkParameter(customSetup, 'customSetup', (v: any) => { return typeof v === 'boolean' }, 'is not a boolean');
        if(checkCustomSetup !== null) return next(checkCustomSetup);

        // Set the parameters
        req.gameID = gameID;
        req.trackID = trackID;
        req.carID = carID;
        req.weatherID = weatherID;
        req.tyreID = tyreID;
        req.customSetup = customSetup;
    } else {
        // ConfigID is present so we just need to check that it is valid
        const check = checkParameter(configID, 'configID', isValidID, 'is not a valid configID');
        if(check !== null) return next(check);
        req.configID = configID;
    }
    
    next();
}

export async function timeIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const timeID = req.body.timeID ?? req.query.timeID ?? MISSING;
    const check = checkParameter(timeID, 'timeID', isValidID, 'is not a valid timeID');
    if(check !== null) return next(check);

    req.timeID = timeID;
    next();
}

export async function configIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const configID = req.body.configID ?? req.query.configID ?? MISSING;
    const check = checkParameter(configID, 'configID', isValidID, 'is not a valid configID');
    if(check !== null) return next(check);

    req.configID = configID;
    next();
}

export async function validParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const valid = req.body.valid ?? req.query.valid ?? MISSING;
    const check = checkParameter(valid, 'valid', (v: any) => { return typeof v === 'boolean' }, 'is not a boolean');
    if(check !== null) return next(check);

    req.valid = valid;
    next();
}

export async function customSetupParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const customSetup = req.body.customSetup ?? req.query.customSetup ?? MISSING;
    const check = checkParameter(customSetup, 'customSetup', (v: any) => { return typeof v === 'boolean' }, 'is not a boolean');
    if(check !== null) return next(check);

    req.customSetup = customSetup;
    next();
}

export async function carIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const carID = req.body.carID ?? req.query.carID ?? MISSING;
    const check = checkParameter(carID, 'carID', isValidID, 'is not a valid carID');
    if(check !== null) return next(check);

    req.carID = carID;
    next();
}

export async function shortAndFullNameParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const shortName = req.body.shortName ?? req.query.shortName ?? MISSING;
    const fullName = req.body.fullName ?? req.query.fullName ?? MISSING;
    const check1 = checkParameter(shortName, 'shortName', isValidString, 'is not a valid short name');
    const check2 = checkParameter(fullName, 'fullName', isValidString, 'is not a valid full name');
    if(check1 !== null) return next(check1);
    if(check2 !== null) return next(check2);

    req.shortName = shortName;
    req.fullName = fullName;
    next();
}

export async function nameParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const name = req.body.name ?? req.query.name ?? MISSING;
    const check = checkParameter(name, 'name', isValidString, 'is not a valid name');
    if(check !== null) return next(check);

    req.name = name;
    next();
}

export async function descriptionParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const description = req.body.description ?? req.query.description ?? MISSING;
    const check = checkParameter(description, 'description', isValidString, 'is not a valid description');
    if(check !== null) return next(check);

    req.description = description;
    next();
}

export async function gameIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const gameID = req.body.gameID ?? req.query.gameID ?? MISSING;
    const check = checkParameter(gameID, 'gameID', isValidID, 'is not a valid gameID');
    if(check !== null) return next(check);

    req.gameID = gameID;
    next();
}

export async function tyreIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const tyreID = req.body.tyreID ?? req.query.tyreID ?? MISSING;
    const check = checkParameter(tyreID, 'tyreID', isValidID, 'is not a valid tyreID');
    if(check !== null) return next(check);

    req.tyreID = tyreID;
    next();
}

export async function weatherIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const weatherID = req.body.weatherID ?? req.query.weatherID ?? MISSING;
    const check = checkParameter(weatherID, 'weatherID', isValidID, 'is not a valid weatherID');
    if(check !== null) return next(check);

    req.weatherID = weatherID;
    next();
}

export async function trackIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const trackID = req.body.trackID ?? req.query.trackID ?? MISSING;
    const check = checkParameter(trackID, 'trackID', isValidID, 'is not a valid trackID');
    if(check !== null) return next(check);

    req.trackID = trackID;
    next();
}

export async function countryIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const countryID = req.body.countryID ?? req.query.countryID ?? MISSING;
    const check = checkParameter(countryID, 'countryID', isValidID, 'is not a valid countryID');
    if(check !== null) return next(check);

    req.countryID = countryID;
    next();
}

function checkParameter(value: any, name: string, checker: Function, errorMessage: string): Error | null {
    if(missing(value))
        return new ApiRequestMalformedError(`'${name}' parameter missing`);

    if(!checker(value))
        return new ApiRequestMalformedError(`'${name}' parameter ${errorMessage}`);
    
    return null;
}