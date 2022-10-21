import { DBCar, DBConfig, DBGame, DBTime, DBTrack, DBTyre, DBUser, DBWeather } from "@shared/api";

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
    CustomSetup: false,
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

export const _COUNTRY_ = {
    ID: -1,
    FullName: '',
    ShortName: '',
    AddedAt: new Date()
}

export const _TIME_: DBTime = {
    ID: -1,
    Time: '',
    Millis: -1,
    Username: '',
    ConfigID: -1,
    Valid: false,
    Weather: '',
    AddedAt: new Date()
}