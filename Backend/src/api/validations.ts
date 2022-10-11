import { Response, NextFunction } from 'express';
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
    console.log(req.body);
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
    const username = req.query.username ?? MISSING;
    req.user = null;
    if(missing(username))
        return next(new ApiRequestMalformedError("'username' parameter missing"));
    if(!isValidUsername(username))
        return next(new ApiRequestMalformedError("'username' parameter is invalid"));

    req.user = {username: username};
    next();
}

export async function shortNameParam(req: any, res: Response, next: NextFunction) {
    const shortName = req.query.shortName ?? MISSING;
    if(missing(shortName))
        return next(new ApiRequestMalformedError("'shortName' parameter missing"));
    if(!isValidShortName(shortName))
        return next(new ApiRequestMalformedError("'shortName' parameter is invalid"));

    next();
}

export async function timeParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const time = req.query.time ?? MISSING;
    if(missing(time))
        return next(new ApiRequestMalformedError("'time' parameter missing"));

    if(!isValidTime(time))
        return next(new ApiRequestMalformedError("'time' parameter is not a valid time"));

    next();
}

export async function timeIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const timeID = req.query.timeID ?? MISSING;
    if(missing(timeID))
        return next(new ApiRequestMalformedError("'timeID' parameter missing"));

    if(!isValidTimeID(timeID))
        return next(new ApiRequestMalformedError("'timeID' parameter is not a valid time ID"));

    next();
}

export async function configIDParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const configID = req.query.configID ?? MISSING;
    if(missing(configID))
        return next(new ApiRequestMalformedError("'configID' parameter missing"));

    if(!isValidConfigID(configID))
        return next(new ApiRequestMalformedError("'configID' parameter is not a valid config ID"));

    next();
}

export async function validParam(req: any, res: Response, next: NextFunction): Promise<void> {
    const valid = req.query.valid ?? MISSING;
    if(missing(valid))
        return next(new ApiRequestMalformedError("'valid' parameter missing"));

    if(typeof valid !== 'boolean')
        return next(new ApiRequestMalformedError("'valid' parameter is not a boolean"));

    next();
}



