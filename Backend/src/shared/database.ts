import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../.env'});

import { DatabaseConnectionError } from '../shared/utils';
import { Connection, ConnectionError } from 'tedious';

export async function getDBConnection(sql: any): Promise<Connection> {
    return new Promise((resolve, reject) => {
          const config = {
            server:  process.env.DB_SERVER,
            authentication: {
                type: 'default',
                options: {
                    userName: process.env.DB_LOGIN_NAME,
                    password: process.env.DB_LOGIN_PASSWORD
                }
            },
            options: {
                database:  process.env.DB_DATABASE,
                port: parseInt(process.env.DB_PORT ?? '1433'),
                encrypt: false,
                rowCollectionOnRequestCompletion: true,
                trustServerCertificate: true
            }
          };
        const conn = new sql.Connection(config);

        conn.on('connect', (err: any) => {
            if(err) {
                console.error(`[Port ${config.options.port}] Could not connect:`);
                console.error(err);
                reject(err as ConnectionError != null ? new DatabaseConnectionError() : err);
            }
            resolve(conn);
        });
        
        conn.connect();
    });
}