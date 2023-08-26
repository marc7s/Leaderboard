INSERT INTO Configs(Description, GameID, TrackID, CarID, WeatherID, TyreID, SetupID, Authentic)
SELECT CONCAT(Games.Name, ' ', Tracks.ShortName), Games.ID, Tracks.ID, Cars.ID, Weathers.ID, Tyres.ID, 2, 1
FROM (
    SELECT 
        'Bahrain International Circuit' AS TrackFullName, 
        2021 AS Year, 
        'Red Bull Racing RB16B' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Autodromo Internazionale Enzo e Dino Ferrari' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Autodromo de Algarve' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Circuit de Catalunya' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Circuit de Monaco' AS TrackFullName, 
        2021 AS Year, 
        'Ferrari SF21' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Baku City Circuit' AS TrackFullName, 
        2021 AS Year, 
        'Ferrari SF21' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Circuit Paul Ricard' AS TrackFullName, 
        2021 AS Year, 
        'Red Bull Racing RB16B' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Red Bull Ring' AS TrackFullName, 
        2021 AS Year, 
        'Red Bull Racing RB16B' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Silverstone Circuit' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Hungaroring' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Circuit de Spa-Francorchamps' AS TrackFullName, 
        2021 AS Year, 
        'Red Bull Racing RB16B' AS CarFullName,
        'Wet' AS WeatherName,
        'Pirelli Cinturato' AS TyreFullName
    UNION
    SELECT 
        'Circuit Zandvoort' AS TrackFullName, 
        2021 AS Year, 
        'Red Bull Racing RB16B' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Autodromo Nazionale di Monza' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Sochi Autodrom' AS TrackFullName, 
        2021 AS Year, 
        'McLaren MCL35M' AS CarFullName,
        'Wet' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Intercity Istanbul Park' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Circuit of the Americas' AS TrackFullName, 
        2021 AS Year, 
        'Red Bull Racing RB16B' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Autodromo Hermanos Rodriguez' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Autodromo Jose Carlos Pace' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Losail International Circuit' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Jeddah Corniche Circuit' AS TrackFullName, 
        2021 AS Year, 
        'Mercedes AMG W12' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
    UNION
    SELECT 
        'Yas Marina Circuit' AS TrackFullName, 
        2021 AS Year, 
        'Red Bull Racing RB16B' AS CarFullName,
        'Dry' AS WeatherName,
        'Pirelli Soft' AS TyreFullName
) f1configs
LEFT JOIN Games ON Games.Name = CONCAT('F1 ', CAST(f1configs.Year AS varchar), ' Season') AND Games.Authentic = 1
LEFT JOIN Tracks ON Tracks.FullName = f1configs.TrackFullName
LEFT JOIN Cars ON Cars.FullName = f1configs.CarFullName
LEFT JOIN Weathers ON Weathers.Name = f1configs.WeatherName
LEFT JOIN Tyres ON Tyres.FullName = f1configs.TyreFullName
LEFT JOIN Configs ON 
    Configs.GameID = Games.ID AND
    Configs.TrackID = Tracks.ID AND
    Configs.CarID = Cars.ID AND
    WeatherID = Weathers.ID AND
    Configs.TyreID = Tyres.ID AND
    Configs.SetupID = 2