import { DBCar, DBConfig, DBGame, DBTime, DBTrack } from "@shared/api";

export const _CONFIG_: DBConfig = {
    ID: -1,
    Description: '',
    GameID: -1,
    TrackID: -1,
    CarID: -1,
    WeatherID: -1,
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

export const _WEATHER_ = {
    ID: -1,
    Name: '',
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
    AddedAt: new Date()
}