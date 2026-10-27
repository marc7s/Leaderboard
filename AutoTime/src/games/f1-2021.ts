// F1 2021: the game sends UDP telemetry, read with @racehub-io/f1-telemetry-client.
// A lap is complete when the session, session history, participant and car setup packets for the
// player have all arrived within a few seconds of each other.
import { F1TelemetryClient, constants } from '@racehub-io/f1-telemetry-client';
const { PACKETS } = constants;

import { log } from '../../../Backend/src/shared/utils';
import { AT_Header, _AT_HEADER_MAP_ } from '../specification/types';
import { ATE_Track, ATE_Weather, AT_Session, _AT_SESSION_MAP_ } from '../specification/sessionTypes';
import {
  ATE_VisualTyre,
  AT_LapHistoryDataEntry,
  AT_SessionHistory,
  AT_TyreStintDataEntry,
  GetLapFlags as getLapFlags,
  _AT_LAP_HISTORY_DATA_ENTRY_MAP_,
  _AT_SESSION_HISTORY_MAP_,
  _AT_TYRE_STINT_DATA_ENTRY_MAP_,
} from '../specification/sessionHistoryTypes';
import { ATE_Team, AT_ParticipantData, _AT_PARTICIPANT_DATA_MAP_ } from '../specification/participantTypes';
import {
  AT_CarSetupEntry,
  CompareCarSetups,
  PresetCarSetups,
  _AT_CAR_SETUP_ENTRY_MAP_,
} from '../specification/carSetupsTypes';
import { maxDifference, parseEnum, parseWithMapping } from '../utils';
import { GetCarShortName, GetTrackShortName, GetTyreShortName, GetWeatherName } from '../gameToDatabase';
import { AutoTimeSetup } from '../db';
import { Games, Weather, submitLap } from '../laps';
import { ReadyStatus, getCurrentDriver } from '../state';

interface CurrentLapData {
  Header?: AT_Header;
  Session?: { Timestamp: number; Weather: ATE_Weather; Track: ATE_Track };
  SessionHistory?: {
    Timestamp: number;
    TimeID: string;
    Millis: number;
    Tyre: ATE_VisualTyre;
    Valid: boolean;
  };
  Participant?: { Timestamp: number; Team: ATE_Team };
  CarSetup?: { Timestamp: number; Setup: AT_CarSetupEntry; SetupName: string };
}

const currentLap: CurrentLapData = {};
const maximumAllowedTimestampDifference: number = 3000;
/** Laps that have been handled, so each lap is only sent once */
const handledLaps = new Set<string>();

export function startF1_2021(port: number): void {
  const client = new F1TelemetryClient({ port });

  client.on(PACKETS.session, (e) => parseHeader(e, handleSessionData));
  client.on(PACKETS.sessionHistory, (e) => parseHeader(e, handleSessionHistoryData));
  client.on(PACKETS.participants, (e) => parseHeader(e, handleParticipantsData));
  client.on(PACKETS.carSetups, (e) => parseHeader(e, handleCarSetupsData));

  client.start();
  log(`${Games.F1_2021}: listening for telemetry on UDP port ${port}`);
}

// Middleware for parsing the header passed with every message
function parseHeader(event: any, handler: (header: AT_Header, data: any) => void): void {
  const header: AT_Header = parseWithMapping(event['m_header'], _AT_HEADER_MAP_);
  currentLap.Header = header;
  handler(header, event);
}

function handleSessionData(header: AT_Header, data: any): void {
  ReadyStatus.SetTelemetryReceived(Games.F1_2021);

  const session: AT_Session = parseWithMapping(data, _AT_SESSION_MAP_);
  currentLap.Session = {
    Timestamp: Date.now(),
    Weather: parseEnum(session.WeatherID, ATE_Weather),
    Track: parseEnum(session.TrackID, ATE_Track),
  };
  checkCurrentTime();
}

function handleSessionHistoryData(header: AT_Header, data: any): void {
  // The session history data is sent for every car, cycling through.
  // Only parse the data for the player's car.
  if (header.PlayerCarIndex != data['m_carIdx']) return;

  const sessionHistory: AT_SessionHistory = parseWithMapping(data, _AT_SESSION_HISTORY_MAP_);
  const rawLapHistoryDataList: any[] = data['m_lapHistoryData'];
  const rawTyreStintDataList: any[] = data['m_tyreStintsHistoryData'];

  const rawLapHistoryData = rawLapHistoryDataList[Math.max(sessionHistory.NumLaps - 2, 0)];
  const lapHistoryEntry: AT_LapHistoryDataEntry = parseWithMapping(
    rawLapHistoryData,
    _AT_LAP_HISTORY_DATA_ENTRY_MAP_
  );

  // Skip unset times
  if (lapHistoryEntry.LapTimeInMS === 0) return;

  const valid: boolean = getLapFlags(rawLapHistoryData['m_lapValidBitFlags']).LapValid;
  const timeID: string = JSON.stringify(lapHistoryEntry);

  const rawTyreStintData = rawTyreStintDataList[Math.min(sessionHistory.NumTyreStints - 1, 0)];
  const tyreStintEntry: AT_TyreStintDataEntry = parseWithMapping(
    rawTyreStintData,
    _AT_TYRE_STINT_DATA_ENTRY_MAP_
  );

  currentLap.SessionHistory = {
    Timestamp: Date.now(),
    TimeID: timeID,
    Millis: lapHistoryEntry.LapTimeInMS,
    Tyre: parseEnum(tyreStintEntry.TyreVisualCompoundID, ATE_VisualTyre),
    Valid: valid,
  };
  checkCurrentTime();
}

function handleParticipantsData(header: AT_Header, data: any): void {
  const rawParticipantData = data['m_participants'][header.PlayerCarIndex];
  const participantEntry: AT_ParticipantData = parseWithMapping(
    rawParticipantData,
    _AT_PARTICIPANT_DATA_MAP_
  );

  currentLap.Participant = {
    Timestamp: Date.now(),
    Team: parseEnum(participantEntry.TeamID, ATE_Team),
  };
  checkCurrentTime();
}

function handleCarSetupsData(header: AT_Header, data: any): void {
  const rawCarSetupsData = data['m_carSetups'][header.PlayerCarIndex];
  const carSetupEntry: AT_CarSetupEntry = parseWithMapping(rawCarSetupsData, _AT_CAR_SETUP_ENTRY_MAP_);

  currentLap.CarSetup = {
    Timestamp: Date.now(),
    Setup: carSetupEntry,
    SetupName:
      PresetCarSetups.find((x) => CompareCarSetups(x, carSetupEntry))?.SetupName ?? 'Custom',
  };
  checkCurrentTime();
}

function toBackendSetup(setup: AT_CarSetupEntry): AutoTimeSetup {
  return {
    frontWing: setup.FrontWing,
    rearWing: setup.RearWing,
    onThrottle: setup.OnThrottle,
    offThrottle: setup.OffThrottle,
    frontCamber: setup.FrontCamber,
    rearCamber: setup.RearCamber,
    frontToe: setup.FrontToe,
    rearToe: setup.RearToe,
    frontSuspension: setup.FrontSuspension,
    rearSuspension: setup.RearSuspension,
    frontAntiRollBar: setup.FrontAntiRollBar,
    rearAntiRollBar: setup.RearAntiRollBar,
    frontSuspensionHeight: setup.FrontSuspensionHeight,
    rearSuspensionHeight: setup.RearSuspensionHeight,
    brakePressure: setup.BrakePressure,
    brakeBias: setup.BrakeBias,
    rearLeftTyrePressure: setup.RearLeftTyrePressure,
    rearRightTyrePressure: setup.RearRightTyrePressure,
    frontLeftTyrePressure: setup.FrontLeftTyrePressure,
    frontRightTyrePressure: setup.FrontRightTyrePressure,
    ballast: setup.Ballast,
    fuelLoad: setup.FuelLoad,
  };
}

function checkCurrentTime(): void {
  const { Header, Session, SessionHistory, Participant, CarSetup } = currentLap;
  if (
    getCurrentDriver() == null ||
    Header == null ||
    Session == null ||
    SessionHistory == null ||
    Participant == null ||
    CarSetup == null
  )
    return;

  // Make sure all gathered data is from the same time
  const timestamps: number[] = [
    Session.Timestamp,
    SessionHistory.Timestamp,
    Participant.Timestamp,
    CarSetup.Timestamp,
  ];
  if (maxDifference(timestamps) > maximumAllowedTimestampDifference) return;

  // Return if the same lap has already been handled
  if (handledLaps.has(SessionHistory.TimeID)) return;
  handledLaps.add(SessionHistory.TimeID);

  const trackName = GetTrackShortName(Session.Track);
  const carName = GetCarShortName(Participant.Team);
  const weatherName = GetWeatherName(Session.Weather);
  const tyreName = GetTyreShortName(SessionHistory.Tyre);

  if (trackName != null && carName != null && weatherName != null && tyreName != null) {
    submitLap({
      id: SessionHistory.TimeID,
      game: Games.F1_2021,
      millis: SessionHistory.Millis,
      valid: SessionHistory.Valid,
      track: { name: trackName },
      car: { name: carName },
      weather: weatherName as Weather,
      tyre: { name: tyreName },
      setup: toBackendSetup(CarSetup.Setup),
      setupName: CarSetup.SetupName,
      customSetup: CarSetup.SetupName !== 'Balanced Default',
    });
  } else {
    log(`${Games.F1_2021}: lap not added, since the track, car, weather or tyre is not supported`);
  }

  currentLap.Header = undefined;
  currentLap.Session = undefined;
  currentLap.SessionHistory = undefined;
  currentLap.Participant = undefined;
  currentLap.CarSetup = undefined;
}
