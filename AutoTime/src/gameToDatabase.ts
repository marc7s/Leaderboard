import { ATE_Team } from "./specification/participantTypes";
import { ATE_VisualTyre } from "./specification/sessionHistoryTypes";
import { ATE_Track, ATE_Weather } from "./specification/sessionTypes";

export function GetTrackFullName(track: ATE_Track): string | null {
    switch(track) {
        case ATE_Track.Melbourne: return "Albert Park Circuit";
        case ATE_Track.PaulRicard: return "Circuit Paul Ricard";
        case ATE_Track.Shanghai: return "Shanghai International Circuit";
        case ATE_Track.Sakhir: return "Bahrain International Circuit";
        case ATE_Track.Catalunya: return "Circuit de Catalunya";
        case ATE_Track.Monaco: return "Circuit de Monaco";
        case ATE_Track.Montreal: return "Circuit Gilles Villeneuve";
        case ATE_Track.Silverstone: return "Silverstone Circuit";
        case ATE_Track.Hockenheim: return "Hockenheimring Baden-Würtemberg";
        case ATE_Track.Hungaroring: return "Hungaroring";
        case ATE_Track.Spa: return "Circuit de Spa-Francorchamps";
        case ATE_Track.Monza: return "Autodromo Nazionale di Monza";
        case ATE_Track.Singapore: return "Marina Bay Street Circuit";
        case ATE_Track.Suzuka: return "Suzuka International Racing Course";
        case ATE_Track.AbuDhabi: return "Yas Marina Circuit";
        case ATE_Track.COTA: return "Circuit of the Americas";
        case ATE_Track.Brazil: return "Autodromo Jose Carlos Pace";
        case ATE_Track.Austria: return "Red Bull Ring";
        case ATE_Track.Sochi: return "Sochi Autodrom";
        case ATE_Track.Mexico: return "Autodromo Hermanos Rodriguez";
        case ATE_Track.Baku: return "Baku City Circuit";
        case ATE_Track.SakhirShort: return "Short Bahrain International Circuit";
        case ATE_Track.SilverstoneShort: return "Short Silverstone Circuit";
        case ATE_Track.COTAShort: return "Short Circuit of the Americas";
        case ATE_Track.SuzukaShort: return "Short Suzuka International Racing Course";
        case ATE_Track.Hanoi: return "Hanoi Street Circuit";
        case ATE_Track.Zandvoort: return "Circuit Zandvoort";
        case ATE_Track.Imola: return "Autodromo Internazionale Enzo e Dino Ferrari";
        case ATE_Track.Portimao: return "Autodromo de Algarve";
        case ATE_Track.Jeddah: return "Jeddah Corniche Circuit";
        default: return null;
    }
}

export function GetCarFullName(team: ATE_Team): string | null {
    switch(team) {
        case ATE_Team.Mercedes: return "Mercedes-AMG F1 W12 E Performance";
        case ATE_Team.Ferrari: return "Ferrari SF21";
        case ATE_Team.RedBullRacing: return "Red Bull Racing RB16B";
        case ATE_Team.Williams: return "Williams FW43B";
        case ATE_Team.AstonMartin: return "Aston Martin AMR21";
        case ATE_Team.Alpine: return "Alpine A521";
        case ATE_Team.AlphaTauri: return "AlphaTauri AT02";
        case ATE_Team.Haas: return "Haas VF-21";
        case ATE_Team.McLaren: return "McLaren MCL35M";
        case ATE_Team.AlfaRomeo: return "Alfa Romeo Racing C41";
        case ATE_Team.ArtGP2019:
        case ATE_Team.Campos2019:
        case ATE_Team.Carlin2019:
        case ATE_Team.SauberJuniorCharouz2019:
        case ATE_Team.Dams2019:
        case ATE_Team.UniVirtuosi2019:
        case ATE_Team.MPMotorsport2019:
        case ATE_Team.Prema2019:
        case ATE_Team.Trident2019:
        case ATE_Team.Arden2019:
        case ATE_Team.ArtGP2020:
        case ATE_Team.Campos2020:
        case ATE_Team.Carlin2020:
        case ATE_Team.Charouz2020:
        case ATE_Team.Dams2020:
        case ATE_Team.UniVirtuosi2020:
        case ATE_Team.MPMotorsport2020:
        case ATE_Team.Prema2020:
        case ATE_Team.Trident2020:
        case ATE_Team.Hitech2020:
            return "Dallara F2 2018";
        case ATE_Team.RacingPoint2020:
        case ATE_Team.BWT2020: 
            return "Racing Point RP20";
        case ATE_Team.Mercedes2020: return "Mercedes-AMG F1 W11 EQ Performance";
        case ATE_Team.Ferrari2020: return "Ferrari SF1000";
        case ATE_Team.RedBull2020: return "Red Bull Racing RB16";
        case ATE_Team.Williams2020: return "Williams FW43";
        case ATE_Team.Renault2020: return "Renault R.S.20";
        case ATE_Team.AlphaTauri2020: return "AlphaTauri AT01";
        case ATE_Team.Haas2020: return "Haas VF-20";
        case ATE_Team.McLaren2020: return "McLaren MCL35";
        case ATE_Team.AlfaRomeo2020: return "Alfa Romeo Racing C39";
        default: return null;
    }
}

export function GetWeatherFullName(weather: ATE_Weather): string | null {
    switch(weather) {
        case ATE_Weather.Clear: return "Dry";
        case ATE_Weather.LightCloud: return "Dry";
        case ATE_Weather.Overcast: return "Dry";
        case ATE_Weather.LightRain: return "Wet";
        case ATE_Weather.HeavyRain: return "Wet";
        case ATE_Weather.Storm: return "Wet";
        default: return null;
    }
}

export function GetTyreFullName(tyre: ATE_VisualTyre): string | null {
    switch(tyre) {
        case ATE_VisualTyre.Soft: return "Pirelli Soft";
        case ATE_VisualTyre.Medium: return "Pirelli Medium";
        case ATE_VisualTyre.Hard: return "Pirelli Hard";
        case ATE_VisualTyre.Intermediate: return "Pirelli Cinturato";
        case ATE_VisualTyre.Wet: return "Pirelli Full Wet";
        default: return null;
    }
}