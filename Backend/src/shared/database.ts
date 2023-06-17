import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../.env'});

import { DatabaseConnectionError } from '../shared/utils';
import { Connection, ConnectionError } from 'tedious';

export async function getDBConnection(sql: any, local: boolean = true): Promise<Connection> {
    return new Promise((resolve, reject) => {
        const localConfig = {
            server:   process.env.DB_LOCAL_SERVER,
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

          const remoteConfig = {
            server:  process.env.DB_REMOTE_SERVER,
            authentication: {
                type: 'default',
                options: {
                    userName: process.env.DB_LOGIN_NAME,
                    password: process.env.DB_LOGIN_PASSWORD
                }
            },
            options: {
                database:  process.env.DB_DATABASE,
                encrypt: false,
                rowCollectionOnRequestCompletion: true,
                trustServerCertificate: true
            }
          };

        const conn = new sql.Connection(local ? localConfig : remoteConfig);

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