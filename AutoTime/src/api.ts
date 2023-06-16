import express, { Response, NextFunction, Router } from 'express';
import { log, authenticateToken } from '../../Backend/src/shared/utils';
import { userIDParam, usernameParam } from '../../Backend/src/shared/validations';
import { setCurrentDriver, getCurrentDriver, Cache } from './server';

const router: Router = express.Router();

router.get('/ping', authenticateToken, (req: any, res: Response) => {
    log('Responding to ping...');
    res.json(getCurrentDriver());
});

router.post('/set-current-user', authenticateToken, userIDParam, usernameParam, (req: any, res: Response, next: NextFunction) => {
    const userID: number = req.userID;
    const username: string = req.username;
    log(`Setting current user to ${username}: ${userID}...`);
    setCurrentDriver({
        id: userID,
        username: username
    });
    res.json(userID);
});

router.get('/get-last-session-times', authenticateToken, (req: any, res: Response, next: NextFunction) => {
    log(`Getting session times...`);
    // Return the last 10 session times, sorted from newest to oldest
    res.json(Cache.GetTimeSummaries().sort((a, b) => b.id - a.id).slice(0, 10));
});

module.exports = router;