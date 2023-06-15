import { User } from './shared/api';
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '../.env'});

const jwt = require('jsonwebtoken');

export function createURL(baseURL: string, params: {[key: string]: string} = {}): string {
    let searchParams: string[] = [];
    for(let param in params)
        searchParams.push(`${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`);

    if(searchParams.length > 0)
        return `${baseURL}?${searchParams.join('&')}`;
    return baseURL;
}


export class JwtTokenBody {
    user: User;
    token: string;
    
    constructor(user: User, token: string) {
        this.user = user;
        this.token = token;
    }

    sign(){
        return jwt.sign(this._toObject(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    }

    _toObject(): JwtTokenBodyObject {
        return {
            user: this.user,
            token: this.token
        };
    }
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends Error {
    constructor(path: string) {
        super(`Incorrect path: '${path}'`);
    }
}

export class ApiRequestMalformedError extends Error {
    constructor(message: string){
        super(message);
    }
}

export class DatabaseConnectionError extends Error {
    constructor(){
        super("Could not connect to database");
    }
}

export interface ErrorMessage {
    status: string,
    errorMessage: string,
    error?: Error
}

export interface JwtTokenBodyObject {
    user: User,
    token: string
}

export type JwtToken = string;