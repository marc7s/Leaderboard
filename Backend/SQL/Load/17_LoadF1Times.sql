INSERT INTO AuthenticTimes(Time, Millis, ClassID, DriverID, TeamID, ConfigID, Valid)
SELECT 
    CONVERT(Time(3), times.Time), 
    DATEDIFF(MILLISECOND, 0, CONVERT(Time(3), times.Time)), 
    AuthenticClasses.ID, 
    AuthenticDrivers.ID, 
    AuthenticTeams.ID, 
    configs.ID, 
    1
FROM (
    SELECT 
        '00:01:28.997' AS Time, 
        'VER' AS DriverShortName, 
        'Red Bull' AS TeamShortName, 
        'Bahrain' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:14.411' AS Time, 
        'HAM' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Imola' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:18.348' AS Time, 
        'BOT' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Algarve' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:16.741' AS Time, 
        'HAM' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Catalunya' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:10.346' AS Time, 
        'LEC' AS DriverShortName, 
        'Ferrari' AS TeamShortName, 
        'Monaco' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:41.218' AS Time, 
        'LEC' AS DriverShortName, 
        'Ferrari' AS TeamShortName, 
        'Baku' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:29.990' AS Time, 
        'VER' AS DriverShortName, 
        'Red Bull' AS TeamShortName, 
        'Paul Ricard' AS TrackShortName, 
        2021 AS Year
    UNION
    -- In 2021 they raced at Red Bull Ring twice, but the fastest time was set at the Austrian GP with a 01:03.720 compared to the Styrian GP's 01:03.841
    SELECT 
        '00:01:03.720' AS Time, 
        'VER' AS DriverShortName, 
        'Red Bull' AS TeamShortName, 
        'Red Bull Ring' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:26.134' AS Time, 
        'HAM' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Silverstone' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:15.419' AS Time, 
        'HAM' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Hungaroring' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:59.765' AS Time, 
        'VER' AS DriverShortName, 
        'Red Bull' AS TeamShortName, 
        'Spa' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:08.885' AS Time, 
        'VER' AS DriverShortName, 
        'Red Bull' AS TeamShortName, 
        'Zandvoort' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:19.555' AS Time, 
        'BOT' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Monza' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:41.993' AS Time, 
        'NOR' AS DriverShortName, 
        'McLaren' AS TeamShortName, 
        'Sochi' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:22.868' AS Time, 
        'HAM' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Istanbul Park' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:32.910' AS Time, 
        'VER' AS DriverShortName, 
        'Red Bull' AS TeamShortName, 
        'COTA' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:15.875' AS Time, 
        'BOT' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Hermanos Rodriguez' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:07.934' AS Time, 
        'HAM' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Interlagos' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:20.827' AS Time, 
        'HAM' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Losail' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:27.511' AS Time, 
        'HAM' AS DriverShortName, 
        'Mercedes' AS TeamShortName, 
        'Jeddah' AS TrackShortName, 
        2021 AS Year
    UNION
    SELECT 
        '00:01:22.109' AS Time, 
        'VER' AS DriverShortName, 
        'Red Bull' AS TeamShortName, 
        'Yas Marina' AS TrackShortName, 
        2021 AS Year
) times
LEFT JOIN AuthenticClasses ON AuthenticClasses.Name = 'Formula 1'
LEFT JOIN AuthenticDrivers ON AuthenticDrivers.ShortName = times.DriverShortName
LEFT JOIN AuthenticTeams ON AuthenticTeams.ShortName = times.TeamShortName
LEFT JOIN Games ON Games.Name = CONCAT('F1 ', CAST(times.Year AS varchar), ' Season') AND Games.Authentic = 1
LEFT JOIN Tracks ON Tracks.ShortName = times.TrackShortName
LEFT JOIN Configs ON Configs.GameID = Games.ID AND Configs.TrackID = Tracks.ID AND Configs.Authentic = 1