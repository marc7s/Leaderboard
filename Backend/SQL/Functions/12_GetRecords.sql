CREATE OR ALTER FUNCTION GetRecords() 
RETURNS TABLE 
AS
RETURN 
SELECT
	times.ID,
	times.Time,
	times.Millis,
	times.Username,
	times.Valid,
	c.ID AS ConfigID,
	c.Description as ConfigDescription,
	c.GameID AS ConfigGameID,
	c.TrackID AS ConfigTrackID,
	c.CarID AS ConfigCarID,
	c.WeatherID AS ConfigWeatherID,
	c.TyreID AS ConfigTyreID,
	c.CustomSetup AS ConfigCustomSetup,
	g.Name AS GameName,
	t.ID AS TrackID,
	t.FullName AS TrackFullName,
	t.ShortName AS TrackShortName,
	t.CountryID AS TrackCountryID,
	cars.ID AS CarID,
	cars.FullName AS CarFullName,
	cars.ShortName AS CarShortName,
	w.ID AS WeatherID,
	w.Name AS WeatherName,
	tyres.ID AS TyreID,
	tyres.FullName AS TyreFullName,
	tyres.ShortName AS TyreShortName,
	countries.ID AS CountryID,
	countries.FullName AS CountryFullName,
	countries.ShortName AS CountryShortName
FROM (
	SELECT ID, Time, Millis, Username, ConfigID, Valid, ROW_NUMBER() OVER (PARTITION BY ConfigID, Valid ORDER BY Time ASC) TimeRank FROM Times
) times
INNER JOIN Configs c ON times.ConfigID = c.ID
INNER JOIN Games g ON c.GameID = g.ID
INNER JOIN Tracks t ON c.TrackID = t.ID
INNER JOIN Cars cars ON c.CarID = cars.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
INNER JOIN Tyres tyres ON c.TyreID = tyres.ID
INNER JOIN Countries countries ON t.CountryID = countries.ID
WHERE TimeRank = 1