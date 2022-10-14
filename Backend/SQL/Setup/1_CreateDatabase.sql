USE Master;
GO

IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'Leaderboard')
  BEGIN
    CREATE DATABASE Leaderboard;
    END
GO

USE Leaderboard;
GO

CREATE TABLE Users(
    Username nvarchar(255) NOT NULL PRIMARY KEY,
    Password varbinary(500) DEFAULT NULL,
    Admin bit DEFAULT 0,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Games(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Name nvarchar(255) NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Cars(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL,
    ShortName nvarchar(100) NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Weathers(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Name nvarchar(255) NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Tyres(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL,
    ShortName nvarchar(255) NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Countries(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL,
    ShortName nvarchar(255) NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Tracks(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL,
    ShortName nvarchar(255) NOT NULL,
    CountryID int FOREIGN KEY REFERENCES Countries(ID),
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Configs(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Description nvarchar(255) NOT NULL,
    GameID int FOREIGN KEY REFERENCES Games(ID),
    TrackID int FOREIGN KEY REFERENCES Tracks(ID),
    CarID int FOREIGN KEY REFERENCES Cars(ID),
    WeatherID int FOREIGN KEY REFERENCES Weathers(ID),
    TyreID int FOREIGN KEY REFERENCES Tyres(ID),
    CustomSetup bit NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Times(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Time Time(3) NOT NULL,
    Millis bigint NOT NULL,
    Username nvarchar(255) FOREIGN KEY REFERENCES Users(Username),
    ConfigID int FOREIGN KEY REFERENCES Configs(ID),
    Valid bit NOT NULL,
    AddedAt datetime NOT NULL DEFAULT GETDATE()
);
