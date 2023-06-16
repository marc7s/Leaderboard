import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../.env'});

import { DatabaseConnectionError } from '../shared/utils';
import { Connection, ConnectionError } from 'tedious';

export async function getDBConnection(sql: any): Promise<Connection> {
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
    
        conn.on('connect', (err: any) => {
            if(err) {
                console.error("Could not connect:");
                console.error(err);
                reject(err as ConnectionError != null ? new DatabaseConnectionError() : err);
            }
            resolve(conn);
        });
        
        conn.connect();
    });
}