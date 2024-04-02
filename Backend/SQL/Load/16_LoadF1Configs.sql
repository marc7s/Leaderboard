INSERT INTO Configs(Description, GameID, TrackID, CarID, WeatherID, TyreID, SetupID, Authentic)
SELECT CONCAT(Games.Name, ' ', Tracks.ShortName), Games.ID, Tracks.ID, Cars.ID, Weathers.ID, Tyres.ID, Setups.ID, 1
FROM (
    SELECT 
        'Bahrain' AS TrackShortName, 
        2021 AS Year, 
        'Red Bull RB16B' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Imola' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Algarve' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Catalunya' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Monaco' AS TrackShortName, 
        2021 AS Year, 
        'Ferrari SF21' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Baku' AS TrackShortName, 
        2021 AS Year, 
        'Ferrari SF21' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Paul Ricard' AS TrackShortName, 
        2021 AS Year, 
        'Red Bull RB16B' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    -- In 2021 there were two races at Red Bull Ring, however they have the same config since Max took pole in both the Styrian and Austrian GP
    SELECT 
        'Red Bull Ring' AS TrackShortName, 
        2021 AS Year, 
        'Red Bull RB16B' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Silverstone' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Hungaroring' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Spa' AS TrackShortName, 
        2021 AS Year, 
        'Red Bull RB16B' AS CarShortName,
        'Wet' AS WeatherName,
        'Pirelli Cinturato' AS TyreFullName
    UNION
    SELECT 
        'Zandvoort' AS TrackShortName, 
        2021 AS Year, 
        'Red Bull RB16B' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Monza' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Sochi' AS TrackShortName, 
        2021 AS Year, 
        'McLaren MCL35M' AS CarShortName,
        'Wet' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Istanbul Park' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'COTA' AS TrackShortName, 
        2021 AS Year, 
        'Red Bull RB16B' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Hermanos Rodriguez' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Interlagos' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Losail' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Jeddah' AS TrackShortName, 
        2021 AS Year, 
        'Mercedes W12' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Yas Marina' AS TrackShortName,
        2021 AS Year, 
        'Red Bull RB16B' AS CarShortName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
) f1configs
INNER JOIN Games ON Games.Name = CONCAT('F1 ', CAST(f1configs.Year AS varchar), ' Season') AND Games.Authentic = 1
INNER JOIN Tracks ON Tracks.ShortName = f1configs.TrackShortName
INNER JOIN Cars ON Cars.ShortName = f1configs.CarShortName
INNER JOIN Weathers ON Weathers.Name = f1configs.WeatherName
INNER JOIN Tyres ON Tyres.FullName = f1configs.TyreFullName
INNER JOIN Setups ON Setups.Description = 'Custom'