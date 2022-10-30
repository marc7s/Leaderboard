export interface Token {
    jwt: string,
    expires: number
}

export interface Login {
    username: string,
    password: string
}

export interface User {
    id: number,
    username: string
}

export interface DBUser {
    ID: number,
    Username: string
}

export interface Game {
    id: number,
    name: string
}

export interface DBGame {
    ID: number,
    Name: string,
    AddedAt: Date
}

export interface Car {
    id: number,
    fullName: string,
    shortName: string
}

export interface DBCar {
    ID: number,
    FullName: string,
    ShortName: string,
    AddedAt: Date
}

export interface Weather {
    id: number,
    name: string
}

export interface DBWeather {
    ID: number,
    Name: string,
    AddedAt: Date
}

export interface Tyre {
    id: number,
    fullName: string,
    shortName: string
}

export interface DBTyre {
    ID: number,
    FullName: string,
    ShortName: string,
    AddedAt: Date
}

export interface Country {
    id: number,
    fullName: string,
    shortName: string
}

export interface DBCountry {
    ID: number,
    FullName: string,
    ShortName: string,
    AddedAt: Date
}

export interface Track {
    id: number,
    fullName: string,
    shortName: string,
    country: Country
}

export interface DBTrack {
    ID: number,
    FullName: string,
    ShortName: string,
    CountryID: number,
    AddedAt: Date
}

export interface Config {
    id: number,
    description: string,
    game: Game,
    track: Track,
    car: Car,
    weather: Weather,
    tyre: Tyre,
    customSetup: boolean
}

export interface DBConfig {
    ID: number,
    Description: string,
    GameID: number,
    TrackID: number,
    CarID: number,
    WeatherID: number,
    TyreID: number,
    CustomSetup: boolean,
    AddedAt: Date
}

export interface Time {
    id: number,
    time: string,
    millis: number,
    username: string,
    config: Config,
    valid: boolean
}

export interface DBTime {
    ID: number,
    Time: string,
    Millis: number,
    Username: string,
    ConfigID: number,
    Valid: boolean,
    Weather: string,
    AddedAt: Date
}

export interface DBClass {
    ID: number,
    Name: string
}

export interface Class {
    id: number,
    name: string
}

export interface DBDriver {
    ID: number,
    FirstName: string,
    LastName: string,
    ShortName: string,
    Number: number,
    ClassID: number,
    CountryID: number
}

export interface Driver {
    firstName: string,
    lastName: string,
    shortName: string,
    number: number,
    country: Country
}

export interface DBAuthenticTrackRecord {
    ID: number,
    Time: string,
    Millis: number,
    ClassName: string,
    DriverFirstName: string,
    DriverLastName: string,
    DriverShortName: string,
    DriverNumber: number,
    CarShortName: string,
    WeatherName: string,
    TyreShortName: string,
    CustomSetup: boolean,
    Valid: boolean
}