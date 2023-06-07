import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../.env'});

import { F1TelemetryClient, constants } from "@racehub-io/f1-telemetry-client";
const { PACKETS } = constants;

import { AT_Header, _AT_HEADER_MAP_ } from './specification/types';
import { ATE_BrakingAssist, ATE_DRSAssist, ATE_DynamicRacingLine, ATE_DynamicRacingLineType, ATE_ERSAssist, ATE_ForecastAccuracy, ATE_FormulaType, ATE_GearboxAssist, ATE_NetworkGame, ATE_PitAssist, ATE_PitReleaseAssist, ATE_SafetyCarStatus, ATE_SessionType, ATE_SteeringAssist, ATE_Track, ATE_Weather, AT_Session, _AT_SESSION_MAP_ } from './specification/sessionTypes';
import { ATE_ActualTyre, ATE_VisualTyre, AT_LapHistoryDataEntry, AT_SessionHistory, AT_TyreStintDataEntry, GetLapFlags as getLapFlags } from "./specification/sessionHistoryTypes";
import { _AT_LAP_HISTORY_DATA_ENTRY_MAP_, _AT_SESSION_HISTORY_MAP_, _AT_TYRE_STINT_DATA_ENTRY_MAP_ } from "./specification/sessionHistoryTypes";
import { ATE_Driver, ATE_Nationality, ATE_Team, ATE_YourTelemetry, AT_ParticipantData, _AT_PARTICIPANTS_MAP_, _AT_PARTICIPANT_DATA_MAP_ } from './specification/participantTypes';
import { AT_CarSetupEntry, CompareCarSetups, PresetCarSetups, _AT_CAR_SETUP_ENTRY_MAP_ } from './specification/carSetupsTypes';

import { maxDifference, parseEnum, parseWithMapping, formatLapTime } from './utils';


interface LapTimeConfig {
    Game: string,
    Time: string,
    Track: string,
    Car: string,
    Weather: string,
    Tyre: string,
    CustomSetup: boolean,
    SetupName: string,
    Valid: boolean
}

interface LapTime {
    ID: string,
    Timestamp: number,
    Driver: string,
    Config: LapTimeConfig
}

interface CurrentSessionData {
    Timestamp: number,
    Weather: string,
    Track: string
}

interface CurrentSessionHistoryData {
    Timestamp: number,
    TimeSet: boolean,
    TimeID: string,
    Time: string,
    Tyre: string,
    Valid: boolean
}

interface CurrentParticipantData {
    Timestamp: number,
    Team: string
}

interface CurrentCarSetupData {
    Timestamp: number,
    Setup: AT_CarSetupEntry,
    SetupName: string
}

interface CurrentLapData {
    Header?: AT_Header,
    Session?: CurrentSessionData,
    SessionHistory?: CurrentSessionHistoryData,
    Participant?: CurrentParticipantData,
    CarSetup?: CurrentCarSetupData
}

main();

const lapTimes: LapTime[] = [];
const currentLap: CurrentLapData = {}
const maximumAllowedTimestampDifference: number = 3000;
var currentDriver: string = "UNKNOWN";

function main()
{
    const client = new F1TelemetryClient({ port: process.env.UDP_PORT as any as number });
    
    client.on(PACKETS.session, e => parseHeader(e, handleSessionData));
    client.on(PACKETS.sessionHistory, e => parseHeader(e, handleSessionHistoryData));
    client.on(PACKETS.participants, e => parseHeader(e, handleParticipantsData));
    client.on(PACKETS.carSetups, e => parseHeader(e, handleCarSetupsData));
    
    client.start();
}

// Middleware for parsing the header passed with every message
function parseHeader(event: any, handler: Function): void {
    const header: AT_Header = parseWithMapping(event["m_header"], _AT_HEADER_MAP_);
    currentLap.Header = header;
    handler(header, event)
}

function handleSessionData(header: AT_Header, data: any): void {
    // Parse the session data. Note that fields that need additional processing are parsed later.
    const session: AT_Session = parseWithMapping(data, _AT_SESSION_MAP_);
    session.Weather = parseEnum(session.WeatherID, ATE_Weather);
    session.SessionType = parseEnum(session.SessionTypeID, ATE_SessionType);
    session.Track = parseEnum(session.TrackID, ATE_Track);
    session.FormulaType = parseEnum(session.FormulaTypeID, ATE_FormulaType);
    session.SafetyCarStatus = parseEnum(session.SafetyCarStatusID, ATE_SafetyCarStatus);
    session.NetworkGame = parseEnum(session.NetworkGameID, ATE_NetworkGame);
    session.ForecastAccuracy = parseEnum(session.ForecastAccuracyID, ATE_ForecastAccuracy);
    session.SteeringAssist = parseEnum(session.SteeringAssistID, ATE_SteeringAssist);
    session.BrakingAssist = parseEnum(session.BrakingAssistID, ATE_BrakingAssist);
    session.GearboxAssist = parseEnum(session.GearboxAssistID, ATE_GearboxAssist);
    session.PitAssist = parseEnum(session.PitAssistID, ATE_PitAssist);
    session.PitReleaseAssist = parseEnum(session.PitReleaseAssistID, ATE_PitReleaseAssist);
    session.ERSAssist = parseEnum(session.ERSAssistID, ATE_ERSAssist);
    session.DRSAssist = parseEnum(session.DRSAssistID, ATE_DRSAssist);
    session.DynamicRacingLine = parseEnum(session.DynamicRacingLineID, ATE_DynamicRacingLine);
    session.DynamicRacingLineType = parseEnum(session.DynamicRacingLineTypeID, ATE_DynamicRacingLineType);
    
    // Update the current session data
    currentLap.Session = {
        Timestamp: Date.now(),
        Weather: ATE_Weather[session.Weather],
        Track: ATE_Track[session.Track]
    }
    checkCurrentTime();
}

function handleSessionHistoryData(header: AT_Header, data: any): void {
    // The session history data is sent for every car, cycling through. 
    // Only parse the data for the player's car.
    if(header.PlayerCarIndex == data["m_carIdx"])
    {
        // Parse the session history data. Note that fields that need additional processing are parsed later.
        const sessionHistory: AT_SessionHistory = parseWithMapping(data, _AT_SESSION_HISTORY_MAP_);
        
        const rawLapHistoryDataList: any[] = data["m_lapHistoryData"];
        const rawTyreStintDataList: any[] = data["m_tyreStintsHistoryData"];

        const currData: CurrentSessionHistoryData = {
            Timestamp: Date.now(),
            TimeSet: false,
            TimeID: "",
            Time: "",
            Tyre: "",
            Valid: false
        }
        
        const rawLapHistoryData = rawLapHistoryDataList[Math.max(sessionHistory.NumLaps - 2, 0)];
        const lapHistoryEntry: AT_LapHistoryDataEntry = parseWithMapping(rawLapHistoryData, _AT_LAP_HISTORY_DATA_ENTRY_MAP_);
        
        // Skip unset times
        if(lapHistoryEntry.LapTimeInMS === 0)
            return;

        // Parse the time data
        lapHistoryEntry.LapFlags = getLapFlags(rawLapHistoryData["m_lapValidBitFlags"]);
        lapHistoryEntry.LapTimeFormatted = formatLapTime(lapHistoryEntry.LapTimeInMS);

        currData.Time = lapHistoryEntry.LapTimeFormatted;
        currData.Valid = lapHistoryEntry.LapFlags.LapValid;
        currData.TimeSet = true;
        currData.TimeID = JSON.stringify(lapHistoryEntry);

        
        // Parse the tyre data
        const rawTyreStintData = rawTyreStintDataList[Math.min(sessionHistory.NumTyreStints - 1, 0)];
        const tyreStintEntry: AT_TyreStintDataEntry = parseWithMapping(rawTyreStintData, _AT_TYRE_STINT_DATA_ENTRY_MAP_);
        tyreStintEntry.TyreActualCompound = parseEnum(tyreStintEntry.TyreActualCompoundID, ATE_ActualTyre);
        tyreStintEntry.TyreVisualCompound = parseEnum(tyreStintEntry.TyreVisualCompoundID, ATE_VisualTyre);
        currData.Tyre = ATE_VisualTyre[tyreStintEntry.TyreVisualCompound];

        // Update the current session history data
        currentLap.SessionHistory = !currData.TimeSet ? undefined : {
            Timestamp: currData.Timestamp,
            TimeSet: true,
            TimeID: currData.TimeID,
            Time: currData.Time,
            Tyre: currData.Tyre,
            Valid: currData.Valid,
        }
        checkCurrentTime();
    }
}

function handleParticipantsData(header: AT_Header, data: any): void {
    const rawParticipantsDataList: any[] = data["m_participants"];
    const rawParticipantData = rawParticipantsDataList[header.PlayerCarIndex];
    
    // Parse the participant data
    const participantEntry: AT_ParticipantData = parseWithMapping(rawParticipantData, _AT_PARTICIPANT_DATA_MAP_);
    participantEntry.Driver = parseEnum(participantEntry.DriverID, ATE_Driver);
    participantEntry.Team = parseEnum(participantEntry.TeamID, ATE_Team);
    participantEntry.Nationality = parseEnum(participantEntry.NationalityID, ATE_Nationality);
    participantEntry.YourTelemetry = parseEnum(participantEntry.YourTelemetryID, ATE_YourTelemetry);
    
    // Update the current participant data
    currentLap.Participant = {
        Timestamp: Date.now(),
        Team: ATE_Team[participantEntry.Team]
    }
    checkCurrentTime();
}

function handleCarSetupsData(header: AT_Header, data: any): void {
    const rawCarSetupsDataList: any[] = data["m_carSetups"];
    const rawCarSetupsData = rawCarSetupsDataList[header.PlayerCarIndex];
    
    // Parse the car setup data
    const carSetupEntry: AT_CarSetupEntry = parseWithMapping(rawCarSetupsData, _AT_CAR_SETUP_ENTRY_MAP_);

    // Update the current car setup data
    currentLap.CarSetup = {
        Timestamp: Date.now(),
        Setup: carSetupEntry,
        SetupName: PresetCarSetups.find(x => CompareCarSetups(x, carSetupEntry))?.SetupName ?? "Custom"
    }
    checkCurrentTime();
}

function checkCurrentTime(): void {
    if(currentLap.Header != null && currentLap.Session != null && currentLap.SessionHistory != null && currentLap.Participant != null && currentLap.CarSetup != null) {
        const timestamps: number[] = [ currentLap.Session.Timestamp, currentLap.SessionHistory.Timestamp, currentLap.Participant.Timestamp, currentLap.CarSetup.Timestamp ];

        // Make sure all gathered data is from the same time
        if(maxDifference(timestamps) > maximumAllowedTimestampDifference)
            return;
        
        const lapTimeConfig: LapTimeConfig = {
            Game: currentLap.Header.PacketFormat.toString(),
            Time: currentLap.SessionHistory.Time,
            Track: currentLap.Session.Track,
            Car: currentLap.Participant.Team,
            Weather: currentLap.Session.Weather,
            Tyre: currentLap.SessionHistory.Tyre,
            CustomSetup: currentLap.CarSetup.SetupName !== "Balanced Default",
            SetupName: currentLap.CarSetup.SetupName,
            Valid: currentLap.SessionHistory.Valid
        }

        // Return if the same config has already been added
        if(lapTimes.find(lapTime => lapTime.ID === currentLap.SessionHistory?.TimeID) != null)
            return;

        const currTime: LapTime = {
            ID: currentLap.SessionHistory.TimeID,
            Timestamp: currentLap.SessionHistory.Timestamp,
            Driver: currentDriver,
            Config: lapTimeConfig
        }
        
        lapTimes.push(currTime);
        console.log(lapTimes);
        
        currentLap.Header = undefined;
        currentLap.Session = undefined;
        currentLap.SessionHistory = undefined;
        currentLap.Participant = undefined;
        currentLap.CarSetup = undefined;
    }
}