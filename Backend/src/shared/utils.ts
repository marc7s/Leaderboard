import { Response, NextFunction } from 'express';
import { User } from '../shared/api';
const jwt = require('jsonwebtoken');

export function parseIntoInterface(
  object: any,
  template: any,
  prefix: string = ''
): any {
  let parsed: any = {};

  for (const key of Object.keys(template)) {
    if (Object.keys(object).includes(prefix + key)) {
      parsed[key] = object[prefix + key];
    }
  }

  return parsed;
}

export function log(message: string) {
  console.log(`[${new Date().toLocaleString()}] ${message}`);
}

export function logError(errorMessage: string) {
  console.error(`[${new Date().toLocaleString()}] ${errorMessage}`);
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
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseConnectionError extends Error {
  constructor() {
    super('Could not connect to database');
  }
}

export interface ErrorMessage {
  status: string;
  errorMessage: string;
  error?: Error;
}

export class JwtTokenBody {
  user: User;
  token: string;

  constructor(user: User, token: string) {
    this.user = user;
    this.token = token;
  }

  sign() {
    return jwt.sign(this._toObject(), process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '4h',
    });
  }

  _toObject(): JwtTokenBodyObject {
    return {
      user: this.user,
      token: this.token,
    };
  }
}

export interface JwtTokenBodyObject {
  user: User;
  token: string;
}

export type JwtToken = string;

export async function authenticateToken(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token: JwtToken = authHeader && authHeader.split(' ')[1];
  if (token == null)
    return next(new AuthenticationError('Error: Missing access token'));

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, jwtTokenBody: JwtTokenBody) => {
      if (err)
        return next(new AuthenticationError('Error: Access token invalid'));
      req.jwtTokenBody = jwtTokenBody;
      next();
    }
  );
}
