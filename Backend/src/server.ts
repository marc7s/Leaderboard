import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../.env'});

import express, { Application, Request, Response, NextFunction } from 'express';

import { AuthenticationError, ErrorMessage, NotFoundError, ApiRequestMalformedError } from './utils';

const app: Application = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://old.schagerberg.com/Leaderboard'
}));

app.use(express.json());
app.use('/api/db', require('./api/db'));

app.get('*', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Incorrect path: ${req.baseUrl + req.path}`));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if(err) {
        if(err instanceof AuthenticationError)
            return sendError(res, 403, err.message);
        
        if(err instanceof NotFoundError)
            return sendError(res, 404, err.message);
        
        if(err instanceof ApiRequestMalformedError)
            return sendError(res, 406, err.message);
        
        switch (err.message) {
            case 'NoUserIDProvided': return sendError(res, 400, 'Error: Missing user ID');
            default: return sendError(res, 500, err.message);
        }
    } else {
        next();
    }
});

app.listen(process.env.port, () => {
    console.info(`Running on port ${process.env.port}`);
});

function sendError(res: Response, statusCode: number, message: string, errorDetails?: Error) {
    let payload: ErrorMessage = {
        status: 'ERROR',
        errorMessage: message
    };
    if(!errorDetails)
        return res.status(statusCode).send(payload);

    payload.error = errorDetails;
    return res.status(statusCode).send(payload);
}