import { Class, Config, Driver, Track } from "./api";

export interface TimeSummary {
    id: number,
    time: string,
    millis: number,
    username: string,
    game: string,
    car: string,
    weather: string,
    valid: boolean,
    setupDescription: string,
    customSetup: boolean,
    authentic: boolean,
    record: LapRecordType
}

export enum LapRecordType {
    NoRecord = 0,
    Record = 1,
    RecordAndBeatAuthentic = 2
}

export interface TrackSummary {
    track: Track,
    times: TimeSummary[]
}

export interface Leaderboard {
    name: string,
    times: TimeSummary[],
    weatherCondition?: string,
    gameCondition?: string,
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