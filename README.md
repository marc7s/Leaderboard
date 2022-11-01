# Leaderboard
## Brief description
Leaderboard is a website for storing lap times from racing. The data is stored in a database and the backend provides an API for communicating with the database. The frontend uses this API to display information, like the lap times and tracks, as well as to update the database through the admin pages.

## Background
I build this website in order to store the lap times of me and my friends racing on my racing simulator rig. I started out just writing them down, but I wanted something more interactive and competetive and came up with this. The `Records` page is essence of this competitiveness as it displays the best lap time for every unique combination of configurations as well as separating valid and invalid laps. A configuration includes the car, track, weather, tyres etc for that specific lap. So even if you are not the fastest driver, you can still hold more records since there are many thousands of these unique combinations.

It is also an intuitive dashboard where you can browse the current records to decide if you want to try and beat somebody in a specific configuration.

## Structure
The database is an SQL Server with several tables to store all the data. It also has a bunch of functions and stored procedures used for reading and writing to the database. The database has a special login used by the backend to allow it to communicate with the database. The login has connect, select, and execution priviliges but nothing else as all actions from the backend are performed through the functions and procedures.

The API is written in Node.js (transpiled from Typescript, mainly to get the typing features). The frontend is an Angular app (which means it is also written in Typescript).

## Getting started
You will need:
1. A copy of SQL Server, this project is written for the SQLEXPRESS edition which is free to download and can be hosted locally.
2. A `.env`-file that follows the format of `.env.example`. The access and refresh tokens should be *two different* long randomly generated strings. These tokens are used by the backend to validate the incoming requests through the JSON Web Token (JWT) standard. The tokens can for example be generated using the `crypto` library from Node.js. Below is an example to generate a 128 byte long random string through Node.js:
```
require('crypto');

crypto.randomBytes(128).toString('hex');
```
3. The required dependencies. These can be installed using the package manager `npm` by running `npm install` inside the `Backend` directory as well as the `Frontend` directory.
4. Not required but definately recommended: SQL Server Management Studio (SSMS) to connect and manage your SQL Server database.

## Setting up the dev environment
### Backend
1. Start by making sure your SQLEXPRESS instance is running. Use SSMS to connect to it and run the `1_CreateDatabase.sql` script to create the database itself and all its tables.
2. Then, follow the `SQL Connection` guide to create a login for the backend and allow it to connect.
3. Now it is time to add all the functions to the database. Run every script inside the `SQL/Functions` directory **in order**.
4. Then, run every script inside the `SQL/Procedures` directory **in order**.
5. Now it is time to add the essential and starting data. These scripts are inside the `SQL/Setup/Init` directory. You should change these scripts to suit your own starting point before running them.
6. The database should now be ready, so run `npm run dev` to start the backend.

### Frontend
1. Make sure all dependencies are installed and that Angular is working. You can follow their setup guide in the Angular documentation to get up and running.
2. Run `npm run dev` to start the frontend. It should give post the link to the local development site in the console once it has finished building the app

## Running it in production
Once you got the dev environment working, it should be as simple as running `npm run prod` inside the `Backend` directory. The process should start using `pm2` once it has finished building.

For the frontend, you should once again run `npm run prod` but this time inside the `Frontend` directory. Once done, either copy the contents of the `dist` directory to your web server, or if you built it on the host, you could point the web server to the `dist` folder. Once the Angular app is built, it is a static bundled app and does not need a process running it as the app is run client-site, the server just needs to provide the clients with the static files from the `dist` folder.