import { DBAuthenticTrackRecord, DBCar, DBClass, DBConfig, DBCountry, DBDriver, DBGame, DBRecord, DBSetup, DBTime, DBTrack, DBTyre, DBUser, DBWeather } from "@shared/api";

export const _USER_: DBUser = {
    ID: -1,
    Username: ''
}

export const _CONFIG_: DBConfig = {
    ID: -1,
    Description: '',
    GameID: -1,
    TrackID: -1,
    CarID: -1,
    WeatherID: -1,
    TyreID: -1,
    SetupID: -1,
    AddedAt: new Date()
}

export const _SETUP_: DBSetup = {
    ID: -1,
    Description: '',
    Custom: false,
    Manual: false,
    AddedAt: new Date()
}

export const _GAME_: DBGame = {
    ID: -1,
    Name: '',
    AddedAt: new Date()
}

export const _TRACK_: DBTrack = {
    ID: -1,
    FullName: '',
    ShortName: '',
    CountryID: -1,
    AddedAt: new Date()
}

export const _CAR_: DBCar = {
    ID: -1,
    FullName: '',
    ShortName: '',
    AddedAt: new Date()
}

export const _WEATHER_: DBWeather = {
    ID: -1,
    Name: '',
    AddedAt: new Date()
}

export const _TYRE_: DBTyre = {
    ID: -1,
    FullName: '',
    ShortName: '',
    AddedAt: new Date()
}

export const _COUNTRY_: DBCountry = {
    ID: -1,
    FullName: '',
    ShortName: '',
    Alpha2Code: '',
    AddedAt: new Date()
}

export const _TIME_: DBTime = {
    ID: -1,
    Time: '',
    Millis: -1,
    Username: '',
    ConfigID: -1,
    Valid: false,
    Record: 0,
    Weather: '',
    AddedAt: new Date()
}

export const _AUTHENTICTRACKRECORD_: DBAuthenticTrackRecord = {
    ID: -1,
    Time: '',
    Millis: -1,
    ClassName: '',
    DriverFirstName: '',
    DriverLastName: '',
    DriverShortName: '',
    DriverNumber: -1,
    CarShortName: '',
    WeatherName: '',
    TyreShortName: '',
    SetupDescription: '',
    SetupCustom: false,
    Valid: false
}

export const _DRIVER_: DBDriver = {
    ID: -1,
    FirstName: '',
    LastName: '',
    ShortName: '',
    Number: -1,
    ClassID: -1,
    CountryID: -1
}

export const _CLASS_: DBClass = {
    ID: -1,
    Name: ''
}

export const _RECORD_: DBRecord = {
    Record: 0
}