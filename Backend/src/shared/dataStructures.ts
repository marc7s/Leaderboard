import { Class, Config, Driver, Track } from "./api";

export interface TimeSummary {
    id: number,
    time: string,
    millis: number,
    username: string,
    car: string,
    weather: string,
    valid: boolean,
    customSetup: boolean,
    authentic: boolean
}

export interface TrackSummary {
    track: Track,
    times: TimeSummary[]
}

export interface Leaderboard {
    name: string,
    times: TimeSummary[],
    weatherCondition?: string,
    validCondition?: boolean
}

export interface LapRecord {
    config: Config,
    timeSummary: TimeSummary,
    authentic?: {
        driver: Driver,
        class: Class
    }
}

export interface AuthenticTrackRecord {
    driver: Driver,
    class: Class,
    timeSummary: TimeSummary,
    config: Config
}

export interface Pair {
    f: any,
    s: any
}