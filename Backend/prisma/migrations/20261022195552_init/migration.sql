-- Text columns use COLLATE NOCASE so names compare case-insensitively, as they did in SQL Server.

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT COLLATE NOCASE NOT NULL,
    "password" BLOB,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT COLLATE NOCASE NOT NULL,
    "authentic" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT COLLATE NOCASE NOT NULL,
    "shortName" TEXT COLLATE NOCASE NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Weather" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT COLLATE NOCASE NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Tyre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT COLLATE NOCASE NOT NULL,
    "shortName" TEXT COLLATE NOCASE NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Country" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT COLLATE NOCASE NOT NULL,
    "shortName" TEXT COLLATE NOCASE NOT NULL,
    "alpha2Code" TEXT COLLATE NOCASE NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Track" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT COLLATE NOCASE NOT NULL,
    "shortName" TEXT COLLATE NOCASE NOT NULL,
    "countryId" INTEGER NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Track_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT COLLATE NOCASE,
    "custom" BOOLEAN NOT NULL,
    "manual" BOOLEAN NOT NULL,
    "frontWing" INTEGER,
    "rearWing" INTEGER,
    "onThrottle" INTEGER,
    "offThrottle" INTEGER,
    "frontCamber" REAL,
    "rearCamber" REAL,
    "frontToe" REAL,
    "rearToe" REAL,
    "frontSuspension" INTEGER,
    "rearSuspension" INTEGER,
    "frontAntiRollBar" INTEGER,
    "rearAntiRollBar" INTEGER,
    "frontSuspensionHeight" INTEGER,
    "rearSuspensionHeight" INTEGER,
    "brakePressure" INTEGER,
    "brakeBias" INTEGER,
    "rearLeftTyrePressure" REAL,
    "rearRightTyrePressure" REAL,
    "frontLeftTyrePressure" REAL,
    "frontRightTyrePressure" REAL,
    "ballast" INTEGER,
    "fuelLoad" REAL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT COLLATE NOCASE,
    "gameId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,
    "carId" INTEGER NOT NULL,
    "weatherId" INTEGER NOT NULL,
    "tyreId" INTEGER NOT NULL,
    "setupId" INTEGER NOT NULL,
    "authentic" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Config_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Config_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Config_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Config_weatherId_fkey" FOREIGN KEY ("weatherId") REFERENCES "Weather" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Config_tyreId_fkey" FOREIGN KEY ("tyreId") REFERENCES "Tyre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Config_setupId_fkey" FOREIGN KEY ("setupId") REFERENCES "Setup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Time" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "millis" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "configId" INTEGER NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "addedManually" BOOLEAN NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Time_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Time_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthenticClass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT COLLATE NOCASE NOT NULL
);

-- CreateTable
CREATE TABLE "AuthenticDriver" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT COLLATE NOCASE NOT NULL,
    "lastName" TEXT COLLATE NOCASE NOT NULL,
    "shortName" TEXT COLLATE NOCASE NOT NULL,
    "number" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthenticDriver_classId_fkey" FOREIGN KEY ("classId") REFERENCES "AuthenticClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuthenticDriver_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthenticTeam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT COLLATE NOCASE NOT NULL,
    "shortName" TEXT COLLATE NOCASE NOT NULL,
    "classId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthenticTeam_classId_fkey" FOREIGN KEY ("classId") REFERENCES "AuthenticClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuthenticTeam_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthenticSeason" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "numberOfRaces" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "driversChampionId" INTEGER,
    "constructorsChampionId" INTEGER,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthenticSeason_classId_fkey" FOREIGN KEY ("classId") REFERENCES "AuthenticClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuthenticSeason_driversChampionId_fkey" FOREIGN KEY ("driversChampionId") REFERENCES "AuthenticDriver" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuthenticSeason_constructorsChampionId_fkey" FOREIGN KEY ("constructorsChampionId") REFERENCES "AuthenticTeam" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthenticTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "millis" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "configId" INTEGER NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuthenticTime_classId_fkey" FOREIGN KEY ("classId") REFERENCES "AuthenticClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuthenticTime_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "AuthenticDriver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuthenticTime_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "AuthenticTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuthenticTime_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Car_fullName_key" ON "Car"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Car_shortName_key" ON "Car"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Weather_name_key" ON "Weather"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tyre_fullName_key" ON "Tyre"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Tyre_shortName_key" ON "Tyre"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Country_fullName_key" ON "Country"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Country_shortName_key" ON "Country"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Country_alpha2Code_key" ON "Country"("alpha2Code");

-- CreateIndex
CREATE UNIQUE INDEX "Track_fullName_key" ON "Track"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Track_shortName_key" ON "Track"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Setup_description_key" ON "Setup"("description");

-- CreateIndex
CREATE INDEX "Config_trackId_idx" ON "Config"("trackId");

-- CreateIndex
CREATE INDEX "Time_userId_idx" ON "Time"("userId");

-- CreateIndex
CREATE INDEX "Time_configId_idx" ON "Time"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticClass_name_key" ON "AuthenticClass"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticTeam_fullName_key" ON "AuthenticTeam"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticTeam_shortName_key" ON "AuthenticTeam"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticSeason_year_key" ON "AuthenticSeason"("year");

-- CreateIndex
CREATE INDEX "AuthenticTime_configId_idx" ON "AuthenticTime"("configId");
