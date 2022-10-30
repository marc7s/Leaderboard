INSERT INTO AuthenticSeasons(Year, NumberOfRaces, ClassID, DriversChampionID, ConstructorsChampionID)
SELECT seasons.Year, seasons.NumberOfRaces, AuthenticClasses.ID, AuthenticDrivers.ID, AuthenticTeams.ID
FROM (
    SELECT 2021 AS Year,    22 AS NumberOfRaces,    'VER' AS DriverShortName,   'Mercedes' AS TeamShortName UNION
    SELECT 2022 AS Year,    22 AS NumberOfRaces,    'VER' AS DriverShortName,   'Red Bull' AS TeamShortName
) seasons
LEFT JOIN AuthenticClasses ON AuthenticClasses.Name = 'Formula 1'
LEFT JOIN AuthenticDrivers ON AuthenticDrivers.ShortName = seasons.DriverShortName
LEFT JOIN AuthenticTeams ON AuthenticTeams.ShortName = seasons.TeamShortName

-- Also add the seaons as games
INSERT INTO Games(Name, Authentic)
SELECT CONCAT('F1 ', CAST(Year AS varchar), ' Season'), 1
FROM AuthenticSeasons