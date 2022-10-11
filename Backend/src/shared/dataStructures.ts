import { Track } from "./api";

export interface TimeSummary {
    id: number,
    time: string,
    millis: number,
    username: string
}

export interface TrackSummary {
    track: Track,
    times: TimeSummary[]
}