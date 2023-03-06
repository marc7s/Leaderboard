import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../.env'});

import express, { Application, Request, Response, NextFunction } from 'express';
import { getClientIp } from 'request-ip';

import { AuthenticationError, ErrorMessage, NotFoundError, ApiRequestMalformedError } from './utils';

const app: Application = express();
const cors = require('cors');

export function log(message: string) {
    console.log(`[${new Date().toLocaleString()}] ${message}`);
}

export function logError(errorMessage: string) {
    console.error(`[${new Date().toLocaleString()}] ${errorMessage}`);
}

app.use(cors({
    origin: app.get('env') === 'development' ? 'http://localhost:4200' : 'https://leaderboard.schagerberg.com'
}));

app.use(express.json());
app.use('/db', require('./api/db'));

app.get('*', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(req.baseUrl + req.path));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if(err) {
        const requestIP = getClientIp(req) ?? 'UNKNOWN';
        if(err instanceof AuthenticationError)
            return sendError(res, 403, err.message, requestIP);
        
        if(err instanceof NotFoundError)
            return sendError(res, 404, err.message, requestIP);
        
        if(err instanceof ApiRequestMalformedError)
            return sendError(res, 406, err.message, requestIP);
        
        switch(err.message) {
            case 'NoUserIDProvided': return sendError(res, 400, 'Error: Missing user ID', requestIP);
            default: return sendError(res, 500, err.message, requestIP);
        }
    } else {
        next();
    }
});

app.listen(process.env.port, () => {
    log(`Running on port ${process.env.port}. Environment: ${app.get('env')}`);
});

function sendError(res: Response, statusCode: number, message: string, requestIP: string, errorDetails?: Error) {
    const payload: ErrorMessage = {
        status: 'ERROR',
        errorMessage: message
    };
    logError(`${payload.errorMessage}\nRequested by IP '${requestIP}'`);
    if(!errorDetails)
        return res.status(statusCode).send(payload);

    payload.error = errorDetails;
    return res.status(statusCode).send(payload);
}