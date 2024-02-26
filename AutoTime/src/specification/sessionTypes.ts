import { AT_Header } from './types';

/* MarshalZone */
export enum ATE_ZoneFlag {
  Invalid = -1,
  None = 0,
  Green = 1,
  Blue = 2,
  Yellow = 3,
  Red = 4,
}

export interface AT_MarchalZone {
  ZoneStart: number;
  ZoneFlagID: number;
  ZoneFlag: ATE_ZoneFlag;
}

export const _AT_MARCHAL_ZONE_MAP_: object = {
  m_zoneStart: 'ZoneStart',
  m_zoneFlag: 'ZoneFlagID',
};
/* --- MarchalZone --- */

/* Enums */
export enum ATE_SessionType {
  Unknown = 0,
  Practice1 = 1,
  Practice2 = 2,
  Practice3 = 3,
  ShortPractice = 4,
  Qualifying1 = 5,
  Qualifying2 = 6,
  Qualifying3 = 7,
  ShortQualifying = 8,
  OneShotQualifying = 9,
  Race = 10,
  Race2 = 11,
  TimeTrial = 12,
}

export enum ATE_Weather {
  Clear = 0,
  LightCloud = 1,
  Overcast = 2,
  LightRain = 3,
  HeavyRain = 4,
  Storm = 5,
}

export enum ATE_Track {
  Melbourne = 0,
  PaulRicard = 1,
  Shanghai = 2,
  Sakhir = 3,
  Catalunya = 4,
  Monaco = 5,
  Montreal = 6,
  Silverstone = 7,
  Hockenheim = 8,
  Hungaroring = 9,
  Spa = 10,
  Monza = 11,
  Singapore = 12,
  Suzuka = 13,
  AbuDhabi = 14,
  COTA = 15,
  Brazil = 16,
  Austria = 17,
  Sochi = 18,
  Mexico = 19,
  Baku = 20,
  SakhirShort = 21,
  SilverstoneShort = 22,
  COTAShort = 23,
  SuzukaShort = 24,
  Hanoi = 25,
  Zandvoort = 26,
  Imola = 27,
  Portimao = 28,
  Jeddah = 29,
}

export enum ATE_TrackTemperatureChange {
  Increase = 0,
  Decrease = 1,
  NoChange = 2,
}

export enum ATE_AirTemperatureChange {
  Increase = 0,
  Decrease = 1,
  NoChange = 2,
}

export enum ATE_FormulaType {
  F1Modern = 0,
  F1Classic = 1,
  F2 = 2,
  F1Generic = 3,
}

export enum ATE_SafetyCarStatus {
  NoSafetyCar = 0,
  FullSafetyCar = 1,
  VirtualSafetyCar = 2,
  FormationLap = 3,
}

export enum ATE_NetworkGame {
  Offline = 0,
  Online = 1,
}

export enum ATE_ForecastAccuracy {
  Perfect = 0,
  Approximate = 1,
}

export enum ATE_SteeringAssist {
  Off = 0,
  On = 1,
}

export enum ATE_BrakingAssist {
  Off = 0,
  Low = 1,
  Medium = 2,
  High = 3,
}

export enum ATE_GearboxAssist {
  Manual = 1,
  ManualAndSuggestedGear = 2,
  Automatic = 3,
}

export enum ATE_PitAssist {
  Off = 0,
  On = 1,
}

export enum ATE_PitReleaseAssist {
  Off = 0,
  On = 1,
}

export enum ATE_ERSAssist {
  Off = 0,
  On = 1,
}

export enum ATE_DRSAssist {
  Off = 0,
  On = 1,
}

export enum ATE_DynamicRacingLine {
  Off = 0,
  CornersOnly = 1,
  Full = 2,
}

export enum ATE_DynamicRacingLineType {
  TwoD = 0,
  ThreeD = 1,
}
/* --- Enums --- */

/* WeatherForecastSample */
export interface AT_WeatherForecastSample {
  SessionTypeID: number;
  SessionType: ATE_SessionType;
  TimeOffset: number;
  WeatherID: number;
  Weather: ATE_Weather;
  TrackTemperatureC: number;
  TrackTemperatureChangeID: number;
  TrackTemperatureChange: ATE_TrackTemperatureChange;
  AirTemperatureC: number;
  AirTemperatureChangeID: number;
  AirTemperatureChange: ATE_AirTemperatureChange;
  RainPercentage: number;
}

export const _AT_WEATHER_FORECAST_SAMPLE_MAP_: object = {
  m_lapTimeInMS: 'LapTimeInMS',
  m_sector1TimeInMS: 'Sector1TimeInMS',
  m_sector2TimeInMS: 'Sector2TimeInMS',
  m_sector3TimeInMS: 'Sector3TimeInMS',
  m_lapValidBitFlags: 'LapValidBitFlags',
};
/* --- WeatherForecastSample --- */

/* Session */
export interface AT_Session {
  Header: AT_Header;
  WeatherID: number;
  Weather: ATE_Weather;
  TrackTemperatureC: number;
  AirTemperatureC: number;
  TotalLaps: number;
  TrackLengthM: number;
  SessionTypeID: number;
  SessionType: ATE_SessionType;
  TrackID: number;
  Track: ATE_Track;
  FormulaTypeID: number;
  FormulaType: ATE_FormulaType;
  SessionTimeLeftS: number;
  SessionDurationS: number;
  PitSpeedLimitKPH: number;
  GamePaused: boolean;
  IsSpectating: boolean;
  SpectatorCarIndex: number;
  SLIProNativeSupport: boolean;
  NumMarshalZones: number;
  MarshalZones: AT_MarchalZone[];
  SafetyCarStatusID: number;
  SafetyCarStatus: ATE_SafetyCarStatus;
  NetworkGameID: number;
  NetworkGame: ATE_NetworkGame;
  NumWeatherForecastSamples: number;
  WeatherForecastSamples: AT_WeatherForecastSample[];
  ForecastAccuracyID: number;
  ForecastAccuracy: ATE_ForecastAccuracy;
  AIDifficulty: number;
  SeasonLinkIdentifier: number;
  WeekendLinkIdentifier: number;
  SessionLinkIdentifier: number;
  PitStopWindowIdealLap: number;
  PitStopWindowLatestLap: number;
  PitStopRejoinPosition: number;
  SteeringAssistID: number;
  SteeringAssist: ATE_SteeringAssist;
  BrakingAssistID: number;
  BrakingAssist: ATE_BrakingAssist;
  GearboxAssistID: number;
  GearboxAssist: ATE_GearboxAssist;
  PitAssistID: number;
  PitAssist: ATE_PitAssist;
  PitReleaseAssistID: number;
  PitReleaseAssist: ATE_PitReleaseAssist;
  ERSAssistID: number;
  ERSAssist: ATE_ERSAssist;
  DRSAssistID: number;
  DRSAssist: ATE_DRSAssist;
  DynamicRacingLineID: number;
  DynamicRacingLine: ATE_DynamicRacingLine;
  DynamicRacingLineTypeID: number;
  DynamicRacingLineType: ATE_DynamicRacingLineType;
}

export const _AT_SESSION_MAP_: object = {
  m_weather: 'WeatherID',
  m_trackTemperature: 'TrackTemperatureC',
  m_airTemperature: 'AirTemperatureC',
  m_totalLaps: 'TotalLaps',
  m_trackLength: 'TrackLengthM',
  m_sessionType: 'SessionTypeID',
  m_trackId: 'TrackID',
  m_formula: 'FormulaTypeID',
  m_sessionTimeLeft: 'SessionTimeLeftS',
  m_sessionDuration: 'SessionDurationS',
  m_pitSpeedLimit: 'PitSpeedLimitKPH',
  m_gamePaused: 'GamePaused',
  m_isSpectating: 'IsSpectating',
  m_spectatorCarIndex: 'SpectatorCarIndex',
  m_sliProNativeSupport: 'SLIProNativeSupport',
  m_numMarshalZones: 'NumMarshalZones',
  m_marshalZones: 'MarshalZones',
  m_safetyCarStatus: 'SafetyCarStatusID',
  m_networkGame: 'NetworkGameID',
  m_numWeatherForecastSamples: 'NumWeatherForecastSamples',
  m_weatherForecastSamples: 'WeatherForecastSamples',
  m_forecastAccuracy: 'ForecastAccuracyID',
  m_aiDifficulty: 'AIDifficulty',
  m_seasonLinkIdentifier: 'SeasonLinkIdentifier',
  m_weekendLinkIdentifier: 'WeekendLinkIdentifier',
  m_sessionLinkIdentifier: 'SessionLinkIdentifier',
  m_pitStopWindowIdealLap: 'PitStopWindowIdealLap',
  m_pitStopWindowLatestLap: 'PitStopWindowLatestLap',
  m_pitStopRejoinPosition: 'PitStopRejoinPosition',
  m_steeringAssist: 'SteeringAssistID',
  m_brakingAssist: 'BrakingAssistID',
  m_gearboxAssist: 'GearboxAssistID',
  m_pitAssist: 'PitAssistID',
  m_pitReleaseAssist: 'PitReleaseAssistID',
  m_ERSAssist: 'ERSAssistID',
  m_DRSAssist: 'DRSAssistID',
  m_dynamicRacingLine: 'DynamicRacingLineID',
  m_dynamicRacingLineType: 'DynamicRacingLineTypeID',
};
/* --- Session --- */
