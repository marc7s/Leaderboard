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
The database is a [SQLite](https://sqlite.org) file, defined and accessed with [Prisma](https://www.prisma.io). The tables are described in `Backend/prisma/schema.prisma`, and Prisma generates TypeScript types for them, so the backend's database code is fully typed. Changes to the schema are applied through migrations in `Backend/prisma/migrations`. Only the backend reads and writes the database; `AutoTime` sends its lap times to the backend's API.

The API is written in Node.js (transpiled from Typescript, mainly to get the typing features). The frontend is an Angular app (which means it is also written in Typescript).

## Getting started
You will need:
1. A `Backend/.env`-file that follows the format of `Backend/.env.example`. The access and refresh tokens should be *two different* long randomly generated strings. These tokens are used by the backend to validate the incoming requests through the JSON Web Token (JWT) standard. The tokens can for example be generated using the `crypto` library from Node.js. Below is an example to generate a 128 byte long random string through the Node.js REPL you can start by running `node`:
```
require('crypto').randomBytes(128).toString('base64')
```
2. A `Frontend/src/environments/environment.dev.ts` and `Frontend/src/environments/environment.prod.ts` file following the format of `Frontend/src/environments/environment.ts`.
3. Node.js 22.22 or newer (required by Angular in the frontend), and the required dependencies. These can be installed using the package manager `npm` by running `npm install` inside the `Backend`, `AutoTime` and `Frontend` directories.

No database server is needed. The database is a single file, `Backend/data/leaderboard.db` by default (set by `DATABASE_URL`).

## The database
Run these inside the `Backend` directory:

| Command | What it does |
|---|---|
| `npm run db:deploy` | Creates the database, or applies new migrations to it. |
| `npm run db:seed` | Fills a new database with the reference data (games, cars, tracks, countries, Formula 1 lap times etc.). Creates or updates the admin given by `ADMIN_USERNAME` and `ADMIN_PASSWORD`. Also adds the users and lap times from `prisma/seed-data/backup.json`, an older backup of the leaderboard that is not up to date. |
| `npm run db:studio` | Opens Prisma Studio, a web page to browse and edit the data. |
| `npm run db:migrate -- --name <change>` | After changing `prisma/schema.prisma`: creates a migration and applies it. |

Text columns compare case-insensitively (as they did in SQL Server), so `Monza` and `monza` are the same track. Prisma cannot express this in the schema, so the migrations add `COLLATE NOCASE` to text columns. Add it by hand to new text columns in new migrations.

## Setting up the dev environment
### Using the devcontainer (recommended)
The repository includes a [devcontainer](https://containers.dev) with Node.js and a database with the backed-up lap times already set up. You need Docker (for example Docker Desktop) and VS Code with the Dev Containers extension.

1. Open the repository in VS Code and choose `Dev Containers: Reopen in Container`. The first start takes a few minutes.
2. On first start, all dependencies are installed and the database is created with the reference data and the backed-up lap times.
3. Run `npm run dev` in the `Backend`, `Frontend` and `AutoTime` directories, each in its own terminal. VS Code forwards the ports, so the site opens at `http://localhost:4200`.
4. Log in as the admin user `admin` with the password `admin`.

The settings used inside the container are in `.devcontainer/devcontainer.env`. They override `Backend/.env`, and use a separate database file, `Backend/data/dev.db`, so the container never touches your real data. They are for local development only. The F1 game can send telemetry to `localhost:20777` (UDP), which reaches AutoTime in the container.

To recreate the dev database from scratch, delete `Backend/data/dev.db` and run `npm run db:deploy && npm run db:seed` in `Backend`.

If `Frontend/src/environments/environment.dev.ts` already exists, it is kept as is. For the devcontainer it should point to `http://localhost:5001/api/` and `http://localhost:5002/api/` (the same as `environment.ts`).

### Backend
1. Run `npm run db:deploy` and then `npm run db:seed` to create the database. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` first to get an admin you can log in with.
2. Run `npm run dev` to start the backend.

### Frontend
1. Make sure all dependencies are installed and that Angular is working. You can follow their setup guide in the Angular documentation to get up and running.
2. Run `npm run dev` to start the frontend. It should give post the link to the local development site in the console once it has finished building the app

### AutoTime
1. Make sure all dependencies are installed on the computer that will host the game to automatically log the times from.
2. `AutoTime` uses the same `.env` file as the `Backend`, since they share parts of the code. Therefore this file needs to be correctly set up in order for `AutoTime` to function. AutoTime sends lap times to the backend, so the backend must be running. If AutoTime runs on another computer than the backend, set `BACKEND_URL` to the backend's address, e.g. `http://192.168.1.10:5001`.
3. Run `npm run dev` to make AutoTime start gathering telemetry data. In order to change the current driver, the frontend also needs to be running with the AutoTime Dashboard page open. Note that although time data is gathered, no time will be posted unless a driver is selected.

## Running it in production
Production runs in Docker.

The backend image is built from `Backend/Dockerfile` (with `Backend` as the build context). On start, the container applies any new database migrations and then starts the server. The `.env` file is not included in the image, so pass the production settings when starting the container, and mount a volume for the database:
```
docker build -t leaderboard-backend Backend
docker run --env-file prod.env -v leaderboard-data:/usr/app/data -p 5001:5001 leaderboard-backend
```
For a new database, run `npx prisma db seed` once inside the container to add the reference data and the admin. Back up the database by copying the database file (`leaderboard.db` in the data volume), ideally while the backend is stopped.

The frontend image is built from `FrontendProdDockerfile`, with the repository root as the build context. It builds the Angular app and serves it with nginx on port 80. `Frontend/src/environments/environment.prod.ts` must exist when building, since it holds the backend address the app uses:
```
docker build -t leaderboard-frontend -f FrontendProdDockerfile .
docker run -p 80:80 leaderboard-frontend
```

`AutoTime` is only meant to run during the driving sessions when times should be logged. Therefore the script can be started before a session starts, and then stopped when the session is done. Note that this script should be run on the computer hosting the game to be played, which might not be the same as the computer running the `Backend`. In that case, set `BACKEND_URL` and make sure the backend's port is reachable from the game computer.