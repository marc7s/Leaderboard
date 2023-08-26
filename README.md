# Leaderboard
## Brief description
Leaderboard is a website for storing lap times from racing. The data is stored in a database and the backend provides an API for communicating with the database. The frontend uses this API to display information, like the lap times and tracks, as well as to update the database through the admin pages.

## Background
I build this website in order to store the lap times of me and my friends racing on my racing simulator rig. I started out just writing them down, but I wanted something more interactive and competetive and came up with this. The `Records` page is essence of this competitiveness as it displays the best lap time for every unique combination of configurations, as well as separating valid and invalid laps. A configuration includes the car, track, weather, tyres etc for that specific lap. So even if you are not the fastest driver, you can still hold several records since there are many thousands of these unique combinations. This is an important part of the project as it should be inclusive.

It is also an intuitive dashboard where you can browse the current records to decide if you want to try and beat somebody in a specific configuration.

## AutoTime
Since adding each time is a task in itself, needing to keep track of these parameters and always staying on top to add the times, I have added a game integration called `AutoTime`. It utilises the telemetry data that several simulator type racing games provide in order to gather this data automatically. The structure is built to support different games with a specific integration for each game needed to facilitate proper communication between the game and `AutoTime`. The first integration is with F1 2021, where the AutoTime script is run on the computer hosting the game. A separate device, such as a phone, is then used as the controller for `AutoTime`, switching the current driver as this information is not part of the game. The device can also see the current times being posted in real time, making it easy to track the current driver's progress.

`AutoTime` gathers a lot of information from the supported games, some of which might not be applicable for every game. It is therefore possible that some changes need to be made in order to support more games. For F1 2021, `AutoTime` collects the time, but also information such as weather, tyres, car, track and every setup setting for each lap - including tyre pressures and aero configurations.

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
3. The required dependencies. These can be installed using the package manager `npm` by running `npm install` inside the `Backend`, `AutoTime` and `Frontend` directories.
4. Not required but definately recommended: SQL Server Management Studio (SSMS) to connect and manage your SQL Server database.

## Setting up the dev environment
### Backend
1. Start by making sure your SQLEXPRESS instance is running. Use SSMS to connect to it for validating that it works
2. Then, follow the `SQL Connection` guide to set up the database, including creating a login for the backend and allowing it to connect.
3. The database should now be ready, so run `npm run dev` to start the backend.

### Frontend
1. Make sure all dependencies are installed and that Angular is working. You can follow their setup guide in the Angular documentation to get up and running.
2. Run `npm run dev` to start the frontend. It should give post the link to the local development site in the console once it has finished building the app

### AutoTime
1. Make sure all dependencies are installed on the computer that will host the game to automatically log the times from.
2. `AutoTime` uses the same `.env` file as the `Backend`, since they share parts of the code. Therefore this file needs to be correctly set up in order for `AutoTime` to function.
3. Run `npm run dev` to make AutoTime start gathering telemetry data. In order to change the current driver, the frontend also needs to be running with the AutoTime Dashboard page open. Note that although time data is gathered, no time will be posted unless a driver is selected.

## Running it in production
Once you got the dev environment working, it should be as simple as running `npm run prod` inside the `Backend` directory. The process should start using `pm2` once it has finished building. If you want to connect to the SQL Express instance from a different computer, you need to open up port 1433 (if that is what you chose when following the `SQL Connection` guide.) in the firewall, both for TCP and UDP. You should also allow outbound traffic through port 1433 over TCP so in total three firewall rules should be enough.

For the frontend, you should once again run `npm run prod` but this time inside the `Frontend` directory. Once done, either copy the contents of the `dist` directory to your web server, or if you built it on the host, you could point the web server to the `dist` folder. Once the Angular app is built, it is a static bundled app and does not need a process running it as the app is run client-site, the server just needs to provide the clients with the static files from the `dist` folder.

`AutoTime` is only meant to run during the driving sessions when times should be logged. Therefore the script can be started before a session starts, and then stopped when the session is done. Note that this script should be run on the computer hosting the game to be played, which might not be the same as the computer running the `Backend`.