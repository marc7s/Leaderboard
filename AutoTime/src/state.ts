// State shared by the API and the game integrations: the current driver, whether AutoTime is
// ready to log times, and the cache of times that have already been added.
import * as fs from 'fs';

import { log } from '../../Backend/src/shared/utils';
import { User } from '../../Backend/src/shared/api';
import { TimeSummary } from '../../Backend/src/shared/dataStructures';

interface CacheEntry {
  Timestamp: number;
  ID: any;
  Time: TimeSummary;
}

let currentDriver: User | null = null;

export function setCurrentDriver(driver: User): void {
  log(`Current driver set to ${driver.username}`);
  currentDriver = driver;
  ReadyStatus.SetDriverReceived();
}

export function getCurrentDriver(): User | null {
  return currentDriver;
}

export class ReadyStatus {
  private static ready: boolean = false;
  private static receivedTelemetry: boolean = false;
  private static receivedDriver: boolean = false;
  private static game: string = '';

  private static telemetryTimeoutMS: number = 5000;
  private static lastTelemetryReceived: number = 0;

  private static currentStatus: string = '';

  private static CheckStatus(): void {
    // Do nothing if already ready
    if (ReadyStatus.ready) return;

    const missingStatus: string[] = [];
    if (!ReadyStatus.receivedTelemetry) missingStatus.push('Telemetry');
    if (!ReadyStatus.receivedDriver) missingStatus.push('Driver');

    if (missingStatus.length < 1) {
      ReadyStatus.ready = true;
      const status: string = `Ready! Waiting for a lap time in ${ReadyStatus.game}...`;
      ReadyStatus.currentStatus = status;
      log(status);
      return;
    }

    const status = `Not ready: Waiting for ${missingStatus.join(' and ')}.`;
    if (status !== ReadyStatus.currentStatus) {
      ReadyStatus.currentStatus = status;
      log(status);
    }
  }

  private static TimeoutTelemetryReceived(): void {
    if (
      Date.now() - ReadyStatus.lastTelemetryReceived >
      ReadyStatus.telemetryTimeoutMS
    ) {
      ReadyStatus.receivedTelemetry = false;
      ReadyStatus.ready = false;
      ReadyStatus.CheckStatus();
    }
  }

  public static Initialize(): void {
    ReadyStatus.CheckStatus();

    // Require continous telemetry data to be received in order to stay ready
    setInterval(
      ReadyStatus.TimeoutTelemetryReceived,
      ReadyStatus.telemetryTimeoutMS
    );
  }

  /** Called whenever a game sends telemetry, so AutoTime knows a game is running */
  public static SetTelemetryReceived(game: string): void {
    if (game !== ReadyStatus.game) {
      ReadyStatus.game = game;
      ReadyStatus.ready = false;
    }
    ReadyStatus.receivedTelemetry = true;
    ReadyStatus.lastTelemetryReceived = Date.now();
    ReadyStatus.CheckStatus();
  }

  public static SetDriverReceived(): void {
    ReadyStatus.receivedDriver = true;
    ReadyStatus.CheckStatus();
  }
}

export class Cache {
  private static folderPath: string = __dirname + '/cache/';
  private static cachePath: string = Cache.folderPath + 'addedTimes.json';
  // Cache values for 24 hours
  private static cacheTimeMilliSeconds: number = 1000 * 60 * 60 * 24;

  private static AddedTimes: CacheEntry[] = [];

  private static UpdateTimeCache(): void {
    for (const entry of [...Cache.AddedTimes]) {
      if (entry.Timestamp < Date.now() - Cache.cacheTimeMilliSeconds)
        Cache.RemoveTime(entry.ID);
    }
  }

  public static Initialize() {
    // Start with an empty cache the first time AutoTime runs
    if (!fs.existsSync(this.cachePath)) Cache.WriteToCache([]);
    this.AddedTimes = JSON.parse(fs.readFileSync(this.cachePath, 'utf-8'));
    this.UpdateTimeCache();
  }

  public static AddTime(timeID: string, time: TimeSummary) {
    const times: CacheEntry[] = Cache.AddedTimes;
    if (Cache.IncludesTime(timeID)) return;

    times.push({ Timestamp: Date.now(), ID: timeID, Time: time });
    this.WriteToCache(times);
  }

  private static RemoveTime(timeID: string) {
    const times: CacheEntry[] = Cache.AddedTimes;
    const index: number = times.findIndex((x) => x.ID == timeID);
    if (index == -1) return;

    times.splice(index, 1);
    this.WriteToCache(times);
  }

  private static WriteToCache(times: CacheEntry[]) {
    fs.mkdirSync(this.folderPath, { recursive: true });
    fs.writeFileSync(this.cachePath, JSON.stringify(times));
  }

  public static IncludesTime(timeID: string): boolean {
    Cache.UpdateTimeCache();
    return Cache.AddedTimes.find((x) => x.ID == timeID) != null;
  }

  public static GetTimeSummaries(): TimeSummary[] {
    return Cache.AddedTimes.map((x) => x.Time);
  }
}
