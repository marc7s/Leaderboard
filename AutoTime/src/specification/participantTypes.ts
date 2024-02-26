import { AT_Header } from './types';

/* Enums */
export enum ATE_Team {
  Mercedes = 0,
  Ferrari = 1,
  RedBullRacing = 2,
  Williams = 3,
  AstonMartin = 4,
  Alpine = 5,
  AlphaTauri = 6,
  Haas = 7,
  McLaren = 8,
  AlfaRomeo = 9,
  ArtGP2019 = 42,
  Campos2019 = 43,
  Carlin2019 = 44,
  SauberJuniorCharouz2019 = 45,
  Dams2019 = 46,
  UniVirtuosi2019 = 47,
  MPMotorsport2019 = 48,
  Prema2019 = 49,
  Trident2019 = 50,
  Arden2019 = 51,
  ArtGP2020 = 70,
  Campos2020 = 71,
  Carlin2020 = 72,
  Charouz2020 = 73,
  Dams2020 = 74,
  UniVirtuosi2020 = 75,
  MPMotorsport2020 = 76,
  Prema2020 = 77,
  Trident2020 = 78,
  BWT2020 = 79,
  Hitech2020 = 80,
  Mercedes2020 = 85,
  Ferrari2020 = 86,
  RedBull2020 = 87,
  Williams2020 = 88,
  RacingPoint2020 = 89,
  Renault2020 = 90,
  AlphaTauri2020 = 91,
  Haas2020 = 92,
  McLaren2020 = 93,
  AlfaRomeo2020 = 94,
}

export enum ATE_Driver {
  CarlosSainz = 0,
  DaniilKvyat = 1,
  DanielRicciardo = 2,
  FernandoAlonso = 3,
  FelipeMassa = 4,
  KimiRaikkonen = 6,
  LewisHamilton = 7,
  MaxVerstappen = 9,
  NicoHulkenburg = 10,
  KevinMagnussen = 11,
  RomainGrosjean = 12,
  SebastianVettel = 13,
  SergioPerez = 14,
  ValtteriBottas = 15,
  EstebanOcon = 17,
  LanceStroll = 19,
  ArronBarnes = 20,
  MartinGiles = 21,
  AlexMurray = 22,
  LucasRoth = 23,
  IgorCorreia = 24,
  SophieLevasseur = 25,
  JonasSchiffer = 26,
  AlainForest = 27,
  JayLetourneau = 28,
  EstoSaari = 29,
  YasarAtiyeh = 30,
  CallistoCalabresi = 31,
  NaotaIzum = 32,
  HowardClarke = 33,
  WilheimKaufmann = 34,
  MarieLaursen = 35,
  FlavioNieves = 36,
  PeterBelousov = 37,
  KlimekMichalski = 38,
  SantiagoMoreno = 39,
  BenjaminCoppens = 40,
  NoahVisser = 41,
  GertWaldmuller = 42,
  JulianQuesada = 43,
  DanielJones = 44,
  ArtemMarkelov = 45,
  TadasukeMakino = 46,
  SeanGelael = 47,
  NyckDeVries = 48,
  JackAitken = 49,
  GeorgeRussell = 50,
  MaximilianGunther = 51,
  NireiFukuzumi = 52,
  LucaGhiotto = 53,
  LandoNorris = 54,
  SergioSetteCamara = 55,
  LouisDeletraz = 56,
  AntonioFuoco = 57,
  CharlesLeclerc = 58,
  PierreGasly = 59,
  AlexanderAlbon = 62,
  NicholasLatifi = 63,
  DorianBoccolacci = 64,
  NikoKari = 65,
  RobertoMerhi = 66,
  ArjunMaini = 67,
  AlessioLorandi = 68,
  RubenMeijer = 69,
  RashidNair = 70,
  JackTremblay = 71,
  DevonButler = 72,
  LukasWebber = 73,
  AntonioGiovinazzi = 74,
  RobertKubica = 75,
  AlainProst = 76,
  AyrtonSenna = 77,
  NobuharuMatsushita = 78,
  NikitaMazepin = 79,
  GuanyaZhou = 80,
  MickSchumacher = 81,
  CallumIlott = 82,
  JuanManuelCorrea = 83,
  JordanKing = 84,
  MahaveerRaghunathan = 85,
  TatianaCalderon = 86,
  AnthoineHubert = 87,
  GuilianoAlesi = 88,
  RalphBoschung = 89,
  MichaelSchumacher = 90,
  DanTicktum = 91,
  MarcusArmstrong = 92,
  ChristianLundgaard = 93,
  YukiTsunoda = 94,
  JehanDaruvala = 95,
  GulhermeSamaia = 96,
  PedroPiquet = 97,
  FelipeDrugovich = 98,
  RobertShwartzman = 99,
  RoyNissany = 100,
  MarinoSato = 101,
  AidanJackson = 102,
  CasperAkkerman = 103,
  JensonButton = 109,
  DavidCoulthard = 110,
  NicoRosberg = 111,
}

export enum ATE_YourTelemetry {
  Restricted = 0,
  Public = 1,
}

export enum ATE_Nationality {
  American = 1,
  Argentinean = 2,
  Australian = 3,
  Austrian = 4,
  Azerbaijani = 5,
  Bahraini = 6,
  Belgian = 7,
  Bolivian = 8,
  Brazilian = 9,
  British = 10,
  Bulgarian = 11,
  Cameroonian = 12,
  Canadian = 13,
  Chilean = 14,
  Chinese = 15,
  Colombian = 16,
  CostaRican = 17,
  Croatian = 18,
  Cypriot = 19,
  Czech = 20,
  Danish = 21,
  Dutch = 22,
  Ecuadorian = 23,
  English = 24,
  Emirian = 25,
  Estonian = 26,
  Finnish = 27,
  French = 28,
  German = 29,
  Ghanaian = 30,
  Greek = 31,
  Guatemalan = 32,
  Honduran = 33,
  HongKonger = 34,
  Hungarian = 35,
  Icelander = 36,
  Indian = 37,
  Indonesian = 38,
  Irish = 39,
  Israeli = 40,
  Italian = 41,
  Jamaican = 42,
  Japanese = 43,
  Jordanian = 44,
  Kuwaiti = 45,
  Latvian = 46,
  Lebanese = 47,
  Lithuanian = 48,
  Luxembourger = 49,
  Malaysian = 50,
  Maltese = 51,
  Mexican = 52,
  Monegasque = 53,
  NewZealander = 54,
  Nicaraguan = 55,
  NorthernIrish = 56,
  Norwegian = 57,
  Omani = 58,
  Pakistani = 59,
  Panamanian = 60,
  Paraguayan = 61,
  Peruvian = 62,
  Polish = 63,
  Portuguese = 64,
  Qatari = 65,
  Romanian = 66,
  Russian = 67,
  Salvadoran = 68,
  Saudi = 69,
  Scottish = 70,
  Serbian = 71,
  Singaporean = 72,
  Slovakian = 73,
  Slovenian = 74,
  SouthKorean = 75,
  SouthAfrican = 76,
  Spanish = 77,
  Swedish = 78,
  Swiss = 79,
  Thai = 80,
  Turkish = 81,
  Uruguayan = 82,
  Ukrainian = 83,
  Venezuelan = 84,
  Barbadian = 85,
  Welsh = 86,
  Vietnamese = 87,
}
/* --- Enums --- */

/* ParticipantData */
export interface AT_ParticipantData {
  AIControlled: boolean;
  DriverID: number;
  Driver: ATE_Driver;
  NetworkID: number;
  TeamID: number;
  Team: ATE_Team;
  IsMyTeam: boolean;
  RaceNumber: number;
  NationalityID: number;
  Nationality: ATE_Nationality;
  Name: string;
  YourTelemetryID: number;
  YourTelemetry: ATE_YourTelemetry;
}

export const _AT_PARTICIPANT_DATA_MAP_: object = {
  m_aiControlled: 'AIControlled',
  m_driverId: 'DriverID',
  m_networkId: 'NetworkID',
  m_teamId: 'TeamID',
  m_myTeam: 'IsMyTeam',
  m_raceNumber: 'RaceNumber',
  m_nationality: 'NationalityID',
  m_name: 'Name',
  m_yourTelemetry: 'YourTelemetryID',
};
/* --- ParticipantData --- */

/* Participant */
export interface AT_Participants {
  Header: AT_Header;
  NumberOfActiveCars: number;
  Participants: AT_ParticipantData[];
}

export const _AT_PARTICIPANTS_MAP_: object = {
  m_header: 'Header',
  m_numActiveCars: 'NumberOfActiveCars',
  m_participants: 'Participants',
};
/* --- Participant --- */
