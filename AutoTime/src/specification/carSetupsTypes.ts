import { AT_Header } from './types';

/* Preset Car Setups */
export const MaximumDownforce: AT_CarSetupEntry = {
  SetupName: 'Maximum Downforce',
  FrontWing: 11,
  RearWing: 10,
  OnThrottle: 80,
  OffThrottle: 60,
  FrontCamber: -3,
  RearCamber: -1.5,
  FrontToe: 0.10000000894069672,
  RearToe: 0.3500000238418579,
  FrontSuspension: 5,
  RearSuspension: 2,
  FrontAntiRollBar: 5,
  RearAntiRollBar: 1,
  FrontSuspensionHeight: 1,
  RearSuspensionHeight: 6,
  BrakePressure: 100,
  BrakeBias: 56,
  RearLeftTyrePressure: 20.299999237060547,
  RearRightTyrePressure: 21.100000381469727,
  FrontLeftTyrePressure: 21.399999618530273,
  FrontRightTyrePressure: 22.200000762939453,
  Ballast: 6,
  FuelLoad: 10,
};

export const IncreasedDownforce: AT_CarSetupEntry = {
  SetupName: 'Increased Downforce',
  FrontWing: 8,
  RearWing: 5,
  OnThrottle: 90,
  OffThrottle: 55,
  FrontCamber: -3,
  RearCamber: -1.5,
  FrontToe: 0.10000000894069672,
  RearToe: 0.3500000238418579,
  FrontSuspension: 7,
  RearSuspension: 2,
  FrontAntiRollBar: 5,
  RearAntiRollBar: 2,
  FrontSuspensionHeight: 2,
  RearSuspensionHeight: 6,
  BrakePressure: 100,
  BrakeBias: 56,
  RearLeftTyrePressure: 21.899999618530273,
  RearRightTyrePressure: 21.899999618530273,
  FrontLeftTyrePressure: 22.200000762939453,
  FrontRightTyrePressure: 22.200000762939453,
  Ballast: 6,
  FuelLoad: 10,
};

export const BalancedDefault: AT_CarSetupEntry = {
  SetupName: 'Balanced Default',
  FrontWing: 8,
  RearWing: 8,
  OnThrottle: 75,
  OffThrottle: 75,
  FrontCamber: -3,
  RearCamber: -1.2000000476837158,
  FrontToe: 0.09000000357627869,
  RearToe: 0.4100000262260437,
  FrontSuspension: 8,
  RearSuspension: 2,
  FrontAntiRollBar: 8,
  RearAntiRollBar: 1,
  FrontSuspensionHeight: 3,
  RearSuspensionHeight: 7,
  BrakePressure: 95,
  BrakeBias: 58,
  RearLeftTyrePressure: 23.100000381469727,
  RearRightTyrePressure: 23.100000381469727,
  FrontLeftTyrePressure: 22.200000762939453,
  FrontRightTyrePressure: 22.200000762939453,
  Ballast: 6,
  FuelLoad: 10,
};

export const IncreasedTopSpeed: AT_CarSetupEntry = {
  SetupName: 'Increased Top Speed',
  FrontWing: 7,
  RearWing: 4,
  OnThrottle: 90,
  OffThrottle: 55,
  FrontCamber: -3,
  RearCamber: -1.5,
  FrontToe: 0.10000000894069672,
  RearToe: 0.3500000238418579,
  FrontSuspension: 7,
  RearSuspension: 2,
  FrontAntiRollBar: 5,
  RearAntiRollBar: 2,
  FrontSuspensionHeight: 2,
  RearSuspensionHeight: 6,
  BrakePressure: 100,
  BrakeBias: 56,
  RearLeftTyrePressure: 21.5,
  RearRightTyrePressure: 21.5,
  FrontLeftTyrePressure: 23,
  FrontRightTyrePressure: 23,
  Ballast: 6,
  FuelLoad: 10,
};

export const MaximumTopSpeed: AT_CarSetupEntry = {
  SetupName: 'Maximum Top Speed',
  FrontWing: 5,
  RearWing: 2,
  OnThrottle: 100,
  OffThrottle: 65,
  FrontCamber: -2.700000047683716,
  RearCamber: -1.2000000476837158,
  FrontToe: 0.07000000029802322,
  RearToe: 0.25999999046325684,
  FrontSuspension: 4,
  RearSuspension: 1,
  FrontAntiRollBar: 4,
  RearAntiRollBar: 1,
  FrontSuspensionHeight: 1,
  RearSuspensionHeight: 5,
  BrakePressure: 100,
  BrakeBias: 57,
  RearLeftTyrePressure: 22.299999237060547,
  RearRightTyrePressure: 23.5,
  FrontLeftTyrePressure: 23.799999237060547,
  FrontRightTyrePressure: 25,
  Ballast: 6,
  FuelLoad: 10,
};

export const PresetCarSetups: AT_CarSetupEntry[] = [
  MaximumDownforce,
  IncreasedDownforce,
  BalancedDefault,
  IncreasedTopSpeed,
  MaximumTopSpeed,
];
/* --- Preset Car Setups --- */

// A comparer function that checks if two car setups are the same
export function CompareCarSetups(a: AT_CarSetupEntry, b: AT_CarSetupEntry) {
  for (const [keyA, valueA] of Object.entries(a)) {
    for (const [keyB, valueB] of Object.entries(b))
      if (keyA === keyB && valueA !== valueB) return false;
  }
  return true;
}

/* CarSetupEntry */
export interface AT_CarSetupEntry {
  SetupName?: string;
  FrontWing: number;
  RearWing: number;
  OnThrottle: number;
  OffThrottle: number;
  FrontCamber: number;
  RearCamber: number;
  FrontToe: number;
  RearToe: number;
  FrontSuspension: number;
  RearSuspension: number;
  FrontAntiRollBar: number;
  RearAntiRollBar: number;
  FrontSuspensionHeight: number;
  RearSuspensionHeight: number;
  BrakePressure: number;
  BrakeBias: number;
  RearLeftTyrePressure: number;
  RearRightTyrePressure: number;
  FrontLeftTyrePressure: number;
  FrontRightTyrePressure: number;
  Ballast: number;
  FuelLoad: number;
}

export const _AT_CAR_SETUP_ENTRY_MAP_: object = {
  m_frontWing: 'FrontWing',
  m_rearWing: 'RearWing',
  m_onThrottle: 'OnThrottle',
  m_offThrottle: 'OffThrottle',
  m_frontCamber: 'FrontCamber',
  m_rearCamber: 'RearCamber',
  m_frontToe: 'FrontToe',
  m_rearToe: 'RearToe',
  m_frontSuspension: 'FrontSuspension',
  m_rearSuspension: 'RearSuspension',
  m_frontAntiRollBar: 'FrontAntiRollBar',
  m_rearAntiRollBar: 'RearAntiRollBar',
  m_frontSuspensionHeight: 'FrontSuspensionHeight',
  m_rearSuspensionHeight: 'RearSuspensionHeight',
  m_brakePressure: 'BrakePressure',
  m_brakeBias: 'BrakeBias',
  m_rearLeftTyrePressure: 'RearLeftTyrePressure',
  m_rearRightTyrePressure: 'RearRightTyrePressure',
  m_frontLeftTyrePressure: 'FrontLeftTyrePressure',
  m_frontRightTyrePressure: 'FrontRightTyrePressure',
  m_ballast: 'Ballast',
  m_fuelLoad: 'FuelLoad',
};
/* --- CarSetupEntry --- */

/* CarSetups */
export interface AT_CarSetups {
  Header: AT_Header;
  CarSetups: AT_CarSetupEntry[];
}

export const _AT_CAR_SETUPS_MAP_: object = {
  m_header: 'Header',
  m_carSetups: 'CarSetups',
};
/* --- CarSetups --- */
