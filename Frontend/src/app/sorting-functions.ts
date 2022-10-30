import { LapRecord, TimeSummary } from "@shared/dataStructures";

export function timeSummarySorting(a: TimeSummary, b: TimeSummary): number {
    return a.millis - b.millis;
}

export function lapRecordSorting(a: LapRecord, b: LapRecord): number {
    return a.timeSummary.millis - b.timeSummary.millis;
  }