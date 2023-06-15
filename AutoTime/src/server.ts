import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/../../Backend/.env'});

import { RequestError } from 'tedious';
import * as fs from 'fs';

import { F1TelemetryClient, constants } from "@racehub-io/f1-telemetry-client";
const { PACKETS } = constants;

import { AT_Header, _AT_HEADER_MAP_ } from './specification/types';
import { ATE_BrakingAssist, ATE_DRSAssist, ATE_DynamicRacingLine, ATE_DynamicRacingLineType, ATE_ERSAssist, ATE_ForecastAccuracy, ATE_FormulaType, ATE_GearboxAssist, ATE_NetworkGame, ATE_PitAssist, ATE_PitReleaseAssist, ATE_SafetyCarStatus, ATE_SessionType, ATE_SteeringAssist, ATE_Track, ATE_Weather, AT_Session, _AT_SESSION_MAP_ } from './specification/sessionTypes';
import { ATE_ActualTyre, ATE_VisualTyre, AT_LapHistoryDataEntry, AT_SessionHistory, AT_TyreStintDataEntry, GetLapFlags as getLapFlags } from "./specification/sessionHistoryTypes";
import { _AT_LAP_HISTORY_DATA_ENTRY_MAP_, _AT_SESSION_HISTORY_MAP_, _AT_TYRE_STINT_DATA_ENTRY_MAP_ } from "./specification/sessionHistoryTypes";
import { ATE_Driver, ATE_Nationality, ATE_Team, ATE_YourTelemetry, AT_ParticipantData, _AT_PARTICIPANTS_MAP_, _AT_PARTICIPANT_DATA_MAP_ } from './specification/participantTypes';
import { AT_CarSetupEntry, CompareCarSetups, PresetCarSetups, _AT_CAR_SETUP_ENTRY_MAP_ } from './specification/carSetupsTypes';

import { maxDifference, parseEnum, parseWithMapping, formatLapTime } from './utils';
import { GetCarFullName, GetTrackFullName, GetTyreFullName, GetWeatherFullName } from './gameToDatabase';
import { addTime } from './db';

import ADDED_TIMES_CACHE from './cache/addedTimes.json';

interface CacheEntry {
    Timestamp: number,
    Data: any
}

class Cache {
    private static folderPath: string = __dirname + '/cache/';
    // Cache values for 24 hours
    private static cacheTimeMilliSeconds: number = 1000 * 60 * 60 * 24;
    
    private static get AddedTimes(): CacheEntry[] {
        return ADDED_TIMES_CACHE as CacheEntry[];
    }
    
    private static UpdateTimeCache(): void {
        for(const entry of Cache.AddedTimes) {
            if(entry.Timestamp < Date.now() - Cache.cacheTimeMilliSeconds)
                Cache.RemoveTime(entry.Data);
        }
    }
    
    public static AddTime(timeID: string) {
        const times: CacheEntry[] = Cache.AddedTimes;
        if(Cache.IncludesTime(timeID))
            return;
        
        times.push({Timestamp: Date.now(), Data: timeID});
        fs.writeFileSync(Cache.folderPath + 'addedTimes.json', JSON.stringify(times));
    }
    
    private static RemoveTime(timeID: string) {
        const times: CacheEntry[] = Cache.AddedTimes;
        const index: number = times.findIndex(x => x.Data == timeID);
        if(index == -1)
            return;
        
        times.splice(index, 1);
        fs.writeFileSync(Cache.folderPath + 'addedTimes.json', JSON.stringify(times));
    }

    private static _IncludesTime(timeID: string, updateCache: boolean): boolean {
        if(updateCache)
            Cache.UpdateTimeCache();
        return Cache.AddedTimes.find(x => x.Data == timeID) != null;
    }
    
    public static IncludesTime(timeID: string): boolean {
        return Cache._IncludesTime(timeID, true);
    }
}

interface LapTimeConfig {
    Game: string,
    Time: string,
    TrackName: string,
    Track: ATE_Track,
    TeamName: string,
    Team: ATE_Team,
    WeatherName: string,
    Weather: ATE_Weather,
    TyreName: string,
    Tyre: ATE_VisualTyre,
    CustomSetup: boolean,
    Setup: AT_CarSetupEntry,
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
    WeatherName: string,
    Weather: ATE_Weather,
    TrackName: string,
    Track: ATE_Track
}

interface CurrentSessionHistoryData {
    Timestamp: number,
    TimeSet: boolean,
    TimeID: string,
    Time: string,
    TyreName: string,
    Tyre: ATE_VisualTyre,
    Valid: boolean
}

interface CurrentParticipantData {
    Timestamp: number,
    TeamName: string,
    Team: ATE_Team
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
    const client = new F1TelemetryClient({ port: process.env.TELEMETRY_UDP_PORT as any as number });
    
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
        WeatherName: ATE_Weather[session.Weather],
        Weather: session.Weather,
        TrackName: ATE_Track[session.Track],
        Track: session.Track
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
        
        const rawLapHistoryData = rawLapHistoryDataList[Math.max(sessionHistory.NumLaps - 2, 0)];
        const lapHistoryEntry: AT_LapHistoryDataEntry = parseWithMapping(rawLapHistoryData, _AT_LAP_HISTORY_DATA_ENTRY_MAP_);
        
        // Skip unset times
        if(lapHistoryEntry.LapTimeInMS === 0)
            return;

        // Parse the time data
        lapHistoryEntry.LapFlags = getLapFlags(rawLapHistoryData["m_lapValidBitFlags"]);
        lapHistoryEntry.LapTimeFormatted = formatLapTime(lapHistoryEntry.LapTimeInMS);

        const time: string = lapHistoryEntry.LapTimeFormatted;
        const valid: boolean = lapHistoryEntry.LapFlags.LapValid;
        const timeSet: boolean = true;
        const timeID: string = JSON.stringify(lapHistoryEntry);

        
        // Parse the tyre data
        const rawTyreStintData = rawTyreStintDataList[Math.min(sessionHistory.NumTyreStints - 1, 0)];
        const tyreStintEntry: AT_TyreStintDataEntry = parseWithMapping(rawTyreStintData, _AT_TYRE_STINT_DATA_ENTRY_MAP_);
        tyreStintEntry.TyreActualCompound = parseEnum(tyreStintEntry.TyreActualCompoundID, ATE_ActualTyre);
        tyreStintEntry.TyreVisualCompound = parseEnum(tyreStintEntry.TyreVisualCompoundID, ATE_VisualTyre);
        const tyre: ATE_VisualTyre = tyreStintEntry.TyreVisualCompound;

        // Update the current session history data
        currentLap.SessionHistory = !timeSet ? undefined : {
            Timestamp: Date.now(),
            TimeSet: true,
            TimeID: timeID,
            Time: time,
            TyreName: ATE_VisualTyre[tyre],
            Tyre: tyre,
            Valid: valid
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
        TeamName: ATE_Team[participantEntry.Team],
        Team: participantEntry.Team
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
            TrackName: currentLap.Session.TrackName,
            Track: currentLap.Session.Track,
            TeamName: currentLap.Participant.TeamName,
            Team: currentLap.Participant.Team,
            WeatherName: currentLap.Session.WeatherName,
            Weather: currentLap.Session.Weather,
            TyreName: currentLap.SessionHistory.TyreName,
            Tyre: currentLap.SessionHistory.Tyre,
            CustomSetup: currentLap.CarSetup.SetupName !== "Balanced Default",
            Setup: currentLap.CarSetup.Setup,
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
        
        const trackName: string | null = GetTrackFullName(lapTimeConfig.Track);
        const carName: string | null = GetCarFullName(lapTimeConfig.Team);
        const weatherName: string | null = GetWeatherFullName(lapTimeConfig.Weather);
        const tyreName: string | null = GetTyreFullName(lapTimeConfig.Tyre);

        if(trackName != null && carName != null && weatherName != null && tyreName != null && !Cache.IncludesTime(currTime.ID)) {
            addTime(lapTimeConfig.Time, 1, "F1 2021", trackName, carName, weatherName, tyreName, lapTimeConfig.Setup, lapTimeConfig.Valid)
                .then(() => Cache.AddTime(currTime.ID))
                .catch(err => {
                    if(err instanceof RequestError && err.message === 'Time already exists') {
                        Cache.AddTime(currTime.ID);
                        console.log('Tried to add duplicate time');
                    }
                    else {
                        console.error(err);
                    }
                });
        }
            
        
        currentLap.Header = undefined;
        currentLap.Session = undefined;
        currentLap.SessionHistory = undefined;
        currentLap.Participant = undefined;
        currentLap.CarSetup = undefined;
    }
}