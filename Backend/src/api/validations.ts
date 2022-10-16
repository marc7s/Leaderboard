import { Response, NextFunction } from 'express';
import { nextTick } from 'process';
import { ApiRequestMalformedError } from '../utils';

function isValidUsername(username: string){return username === username.replace(/\W/g, '')}
function isValidTime(time: any){return time === time.toString()}
function isValidShortName(shortName: any){return shortName === shortName.toString()}
function isValidConfigID(configID: any){return Number.isInteger(configID)}
function isValidTimeID(configID: any){return Number.isInteger(configID)}

function missing(arr: any) {
    return Array.isArray(arr) ? arr.some(val => val === MISSING) : arr === MISSING;
}

enum MissingParam { MISSING };
const MISSING = MissingParam.MISSING;

export async function loginParam(req: any, res: Response, next: NextFunction) {
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

export async function usernameParam(req: any, res: Response, next: NextFunction) {
    req.user = null;
    const username = req.body.username ?? req.query.username ?? MISSING;
    const check = checkParameter(username, 'username', isValidUsername, 'is invalid');
    if(check !== null) return next(check);

    req.user = {username: username};
    next();
}

export async function shortNameParam(req: any, res: Response, next: NextFunction) {
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
        const check = checkParameter(configID, 'configID', isValidConfigID, 'is not a valid configID');
        if(check !== null) return next(check);
        req.configID = configID;
    }
    
    next();
}

export async function timeIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const timeID = req.body.timeID ?? req.query.timeID ?? MISSING;
    const check = checkParameter(timeID, 'timeID', isValidTimeID, 'is not a valid timeID');
    if(check !== null) return next(check);

    req.timeID = timeID;
    next();
}

export async function configIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const configID = req.body.configID ?? req.query.configID ?? MISSING;
    const check = checkParameter(configID, 'configID', isValidConfigID, 'is not a valid configID');
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

function checkParameter(value: any, name: string, checker: Function, errorMessage: string): Error | null {
    if(missing(value))
        return new ApiRequestMalformedError(`'${name}' parameter missing`);

    if(!checker(value))
        return new ApiRequestMalformedError(`'${name}' parameter ${errorMessage}`);
    
    return null;
}


