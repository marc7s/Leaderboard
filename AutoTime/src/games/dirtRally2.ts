// Dirt Rally 2.0: the game sends UDP telemetry when it is turned on in hardware_settings_config.xml
// (with extradata="3"). Each packet is 66 little-endian floats. The game does not send the names of
// the stage or car, so they are identified from the stage length, the start position and the
// engine data (see dirtRally2Data.ts). Rallycross is not supported.
//
// The stage logic follows dirt-rally-time-recorder (https://github.com/soong-construction/dirt-rally-time-recorder):
// a stage starts when the car is at or behind the start line, and ends when the completed laps
// become 1, with the stage time in the last lap time field.
import * as dgram from 'dgram';

import { log, logError } from '../../../Backend/src/shared/utils';
import { Games, submitLap } from '../laps';
import { ReadyStatus } from '../state';
import { DirtRally2Car, DirtRally2Stage, cars, stages } from './dirtRally2Data';

/** Positions of the fields used, in floats */
const Field = {
  runTime: 0,
  lapTime: 1,
  distance: 2,
  posZ: 6,
  lapsCompleted: 59,
  trackLength: 61,
  lastLapTime: 62,
  maxRpm: 63,
  idleRpm: 64,
  maxGears: 65,
} as const;
const FIELD_COUNT = 66;

/** The tolerance when comparing values from the game with the known values */
const TOLERANCE = 0.01;
/** The finish line, as a share of the stage length */
const FINISH_PROGRESS = 0.999;

interface Stage {
  stage: DirtRally2Stage | null;
  car: DirtRally2Car[];
  startedAt: number;
}

let current: Stage | null = null;
let lastRunTime = 0;
let lastLapTime = 0;
let lastProgress = 0;

export function startDirtRally2(port: number): void {
  const socket = dgram.createSocket('udp4');
  socket.on('message', (message) => {
    if (message.length < FIELD_COUNT * 4) {
      logError(`${Games.DirtRally2}: telemetry packet too short. Set extradata="3" in hardware_settings_config.xml.`);
      return;
    }
    const values = Array.from({ length: FIELD_COUNT }, (_, i) => message.readFloatLE(i * 4));
    handlePacket(values);
  });
  socket.on('error', (err) => logError(`${Games.DirtRally2}: ${err.message}`));
  socket.bind(port, () => log(`${Games.DirtRally2}: listening for telemetry on UDP port ${port}`));
}

function near(a: number, b: number): boolean {
  return Math.abs(a - b) < TOLERANCE;
}

/** The stage with this length, and the closest start position if several have the same length */
function identifyStage(length: number, startZ: number): DirtRally2Stage | null {
  const candidates = stages.filter((s) => near(s.length, length));
  if (candidates.length === 0) return null;
  return candidates.reduce((best, s) =>
    Math.abs(s.startZ - startZ) < Math.abs(best.startZ - startZ) ? s : best
  );
}

/** The cars with this engine data. Some cars send the same values and cannot be told apart. */
function identifyCars(maxRpm: number, idleRpm: number, gears: number): DirtRally2Car[] {
  return cars.filter((c) => near(c.maxRpm, maxRpm) && near(c.idleRpm, idleRpm) && c.gears === gears);
}

function startStage(v: number[]): void {
  current = {
    stage: identifyStage(v[Field.trackLength], v[Field.posZ]),
    car: identifyCars(v[Field.maxRpm], v[Field.idleRpm], v[Field.maxGears]),
    startedAt: Date.now(),
  };
  const stageName = current.stage?.name ?? `unknown stage (length ${v[Field.trackLength]}, start z ${v[Field.posZ]})`;
  const carName = current.car.length
    ? current.car.map((c) => c.name).join(' / ')
    : `unknown car (max rpm ${v[Field.maxRpm]}, idle rpm ${v[Field.idleRpm]}, gears ${v[Field.maxGears]})`;
  log(`${Games.DirtRally2}: stage started: ${stageName} in ${carName}`);
}

function finishStage(seconds: number): void {
  const stage = current;
  current = null;
  if (stage == null || seconds <= 0) return;

  const millis = Math.round(seconds * 1000);
  if (stage.stage == null || stage.car.length === 0) {
    logError(`${Games.DirtRally2}: stage finished in ${seconds}s, but the stage or car is unknown, so the time was not added`);
    return;
  }

  const { name, location, country } = stage.stage;
  // Cars that cannot be told apart are stored as one car with both names
  const carName = stage.car.map((c) => c.name).join(' / ');
  submitLap({
    id: `${Games.DirtRally2}-${name}-${carName}-${millis}-${stage.startedAt}`,
    game: Games.DirtRally2,
    millis,
    // Rally stages have no track limits
    valid: true,
    track: { name, fullName: `${name}, ${location}`, country },
    car: { name: carName },
    // The game does not send the weather or tyres
    weather: 'Dry',
    tyre: { name: 'Unknown', fullName: 'Unknown tyre' },
  });
}

function handlePacket(v: number[]): void {
  // After a time trial the game sends packets of only zeros
  if (v.every((x) => x === 0)) {
    if (current != null && lastProgress >= FINISH_PROGRESS) finishStage(lastLapTime);
    return;
  }
  ReadyStatus.SetTelemetryReceived(Games.DirtRally2);

  const runTime = v[Field.runTime];
  const length = v[Field.trackLength];
  const progress = length > 0 ? v[Field.distance] / length : 0;

  // The run time goes back when the stage is restarted
  const restarted = runTime < lastRunTime;
  lastRunTime = runTime;
  lastLapTime = v[Field.lapTime];
  lastProgress = progress;

  if (current != null && v[Field.lapsCompleted] >= 1) {
    finishStage(v[Field.lastLapTime] || v[Field.lapTime]);
  } else if (restarted) {
    current = null;
  } else if (current == null && progress <= 0 && v[Field.lapsCompleted] < 1) {
    startStage(v);
  }
}
