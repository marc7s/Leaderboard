import { AT_Header } from './types';

/* LapFlags */
export interface AT_LapFlags {
  LapValid: boolean;
  Sector1Valid: boolean;
  Sector2Valid: boolean;
  Sector3Valid: boolean;
}

// Note: Sector valid flags do not work
export function GetLapFlags(lapFlags: number): AT_LapFlags {
  return {
    LapValid: (lapFlags & 0x1) == 1,
    Sector1Valid: (lapFlags & 0x2) == 1,
    Sector2Valid: (lapFlags & 0x3) == 1,
    Sector3Valid: (lapFlags & 0x4) == 1,
  };
}
/* --- LapFlags --- */

/* LapHistoryData */
export interface AT_LapHistoryDataEntry {
  LapTimeInMS: number;
  LapTimeFormatted: string;
  Sector1TimeInMS: number;
  Sector2TimeInMS: number;
  Sector3TimeInMS: number;
  LapFlags: AT_LapFlags;
}

export const _AT_LAP_HISTORY_DATA_ENTRY_MAP_: object = {
  m_lapTimeInMS: 'LapTimeInMS',
  m_sector1TimeInMS: 'Sector1TimeInMS',
  m_sector2TimeInMS: 'Sector2TimeInMS',
  m_sector3TimeInMS: 'Sector3TimeInMS',
  m_lapValidBitFlags: 'LapValidBitFlags',
};
/* --- LapHistoryData --- */

/* TyreStintData */
export enum ATE_ActualTyre {
  F1ClassicDry = 9,
  F1ClassicWet = 10,
  F2SuperSoft = 11,
  F2Soft = 12,
  F2Medium = 13,
  F2Hard = 14,
  F2Wet = 15,
  F1ModernC5 = 16,
  F1ModernC4 = 17,
  F1ModernC3 = 18,
  F1ModernC2 = 19,
  F1ModernC1 = 20,
  F1ModernIntermediate = 7,
  F1ModernWet = 8,
}

export enum ATE_VisualTyre {
  Soft = 16,
  Medium = 17,
  Hard = 18,
  Intermediate = 7,
  Wet = 8,
  F2_2019Wet = 15,
  F2_2019SuperSoft = 19,
  F2_2019Soft = 20,
  F2_2019Medium = 21,
  F2_2019Hard = 22,
}

export interface AT_TyreStintDataEntry {
  EndLap: number;
  TyreActualCompoundID: number;
  TyreActualCompound: ATE_ActualTyre;
  TyreVisualCompoundID: number;
  TyreVisualCompound: ATE_VisualTyre;
}

export const _AT_TYRE_STINT_DATA_ENTRY_MAP_: object = {
  m_endLap: 'EndLap',
  m_tyreActualCompound: 'TyreActualCompoundID',
  m_tyreVisualCompound: 'TyreVisualCompoundID',
};
/* --- TyreStintData --- */

/* SessionHistory */
export interface AT_SessionHistory {
  Header: AT_Header;
  CarID: number;
  NumLaps: number;
  NumTyreStints: number;
  BestLapTimeLapNum: number;
  BestSector1LapNum: number;
  BestSector2LapNum: number;
  BestSector3LapNum: number;
  LapHistoryData: AT_LapHistoryDataEntry[];
  TyreStintsHistoryData: AT_TyreStintDataEntry[];
}

export const _AT_SESSION_HISTORY_MAP_: object = {
  m_header: 'Header',
  m_carIdx: 'CarID',
  m_numLaps: 'NumLaps',
  m_numTyreStints: 'NumTyreStints',
  m_bestLapTimeLapNum: 'BestLapTimeLapNum',
  m_bestSector1LapNum: 'BestSector1LapNum',
  m_bestSector2LapNum: 'BestSector2LapNum',
  m_bestSector3LapNum: 'BestSector3LapNum',
  m_lapHistoryData: 'LapHistoryData',
  m_tyreStintsHistoryData: 'TyreStintsHistoryData',
};
/* --- SessionHistory --- */
