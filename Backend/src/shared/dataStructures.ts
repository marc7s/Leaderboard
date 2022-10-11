import { Track } from "./api";

export interface TimeSummary {
    id: number,
    time: string,
    millis: number,
    username: string,
    weather: string,
    valid: boolean
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

export interface Pair {
    f: any,
    s: any
}