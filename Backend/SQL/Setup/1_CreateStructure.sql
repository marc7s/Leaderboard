CREATE TABLE Users(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Username nvarchar(255) NOT NULL UNIQUE,
    Password varbinary(500) DEFAULT NULL,
    Admin bit DEFAULT 0,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Games(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Name nvarchar(255) NOT NULL UNIQUE,
    Authentic bit NOT NULL DEFAULT 0,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Cars(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL UNIQUE,
    ShortName nvarchar(100) NOT NULL UNIQUE,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Weathers(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Name nvarchar(255) NOT NULL UNIQUE,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Tyres(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL UNIQUE,
    ShortName nvarchar(255) NOT NULL UNIQUE,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Countries(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL UNIQUE,
    ShortName nvarchar(255) NOT NULL UNIQUE,
    Alpha2Code nvarchar(2) NOT NULL UNIQUE,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Tracks(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL UNIQUE,
    ShortName nvarchar(255) NOT NULL UNIQUE,
    CountryID int FOREIGN KEY REFERENCES Countries(ID),
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Setups(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Description nvarchar(255) DEFAULT NULL,
    Custom bit NOT NULL,
    Manual bit NOT NULL,
    FrontWing int,
    RearWing int,
    OnThrottle int,
    OffThrottle int,
    FrontCamber float,
    RearCamber float,
    FrontToe float,
    RearToe float,
    FrontSuspension int,
    RearSuspension int,
    FrontAntiRollBar int,
    RearAntiRollBar int,
    FrontSuspensionHeight int,
    RearSuspensionHeight int,
    BrakePressure int,
    BrakeBias int,
    RearLeftTyrePressure float,
    RearRightTyrePressure float,
    FrontLeftTyrePressure float,
    FrontRightTyrePressure float,
    Ballast int,
    FuelLoad float,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE UNIQUE NONCLUSTERED INDEX idx_setups_description_notnull
ON Setups(Description)
WHERE Description IS NOT NULL;

CREATE TABLE Configs(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Description nvarchar(255) DEFAULT NULL,
    GameID int FOREIGN KEY REFERENCES Games(ID),
    TrackID int FOREIGN KEY REFERENCES Tracks(ID),
    CarID int FOREIGN KEY REFERENCES Cars(ID),
    WeatherID int FOREIGN KEY REFERENCES Weathers(ID),
    TyreID int FOREIGN KEY REFERENCES Tyres(ID),
    SetupID int FOREIGN KEY REFERENCES Setups(ID),
    Authentic bit NOT NULL DEFAULT 0,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Times(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Time Time(3) NOT NULL,
    Millis int NOT NULL,
    UserID int FOREIGN KEY REFERENCES Users(ID),
    ConfigID int FOREIGN KEY REFERENCES Configs(ID),
    Valid bit NOT NULL,
    AddedManually bit NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE AuthenticClasses(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Name nvarchar(255) NOT NULL UNIQUE
);

CREATE TABLE AuthenticDrivers(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FirstName nvarchar(255) NOT NULL,
    LastName nvarchar(255) NOT NULL,
    ShortName nvarchar(3) NOT NULL,
    Number int NOT NULL,
    ClassID int FOREIGN KEY REFERENCES AuthenticClasses(ID),
    CountryID int FOREIGN KEY REFERENCES Countries(ID),
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE AuthenticTeams(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL UNIQUE,
    ShortName nvarchar(255) NOT NULL UNIQUE,
    ClassID int FOREIGN KEY REFERENCES AuthenticClasses(ID),
    CountryID int FOREIGN KEY REFERENCES Countries(ID),
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE AuthenticSeasons(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Year int NOT NULL UNIQUE,
    NumberOfRaces int NOT NULL,
    ClassID int FOREIGN KEY REFERENCES AuthenticClasses(ID),
    DriversChampionID int FOREIGN KEY REFERENCES AuthenticDrivers(ID),
    ConstructorsChampionID int FOREIGN KEY REFERENCES AuthenticTeams(ID),
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE AuthenticTimes(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Time Time(3) NOT NULL,
    Millis int NOT NULL,
    ClassID int FOREIGN KEY REFERENCES AuthenticClasses(ID),
    DriverID int FOREIGN KEY REFERENCES AuthenticDrivers(ID),
    TeamID int FOREIGN KEY REFERENCES AuthenticTeams(ID),
    ConfigID int FOREIGN KEY REFERENCES Configs(ID),
    Valid bit NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);