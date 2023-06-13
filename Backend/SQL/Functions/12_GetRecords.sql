CREATE OR ALTER FUNCTION GetRecords() 
RETURNS TABLE 
AS
RETURN 
SELECT
	times.ID,
	times.Time,
	times.Millis,
	times.UserID,
	times.Valid,
	u.Username,
	c.ID AS ConfigID,
	c.Description as ConfigDescription,
	c.GameID AS ConfigGameID,
	c.TrackID AS ConfigTrackID,
	c.CarID AS ConfigCarID,
	c.WeatherID AS ConfigWeatherID,
	c.TyreID AS ConfigTyreID,
	s.ID AS SetupID,
	st.Custom AS SetupCustom,
	st.Description AS SetupDescription,
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
	countries.ShortName AS CountryShortName,
	countries.Alpha2Code AS CountryAlpha2Code,
	(SELECT CASE WHEN EXISTS(
		SELECT *
			FROM AuthenticTimes at
			INNER JOIN Configs c ON at.ConfigID = c.ID
			WHERE 
				c.TrackID = t.ID AND times.Millis <= at.Millis AND times.Valid = 1
		) THEN 2 ELSE 1 END
	) AS Record
FROM (
	SELECT ID, Time, Millis, UserID, ConfigID, Valid, ROW_NUMBER() OVER (PARTITION BY ConfigID, Valid ORDER BY Time ASC) TimeRank FROM Times
) times
INNER JOIN Users u ON times.UserID = u.ID
INNER JOIN Configs c ON times.ConfigID = c.ID
INNER JOIN Setups s ON c.SetupID = s.ID
INNER JOIN SetupTypes st ON s.TypeID = st.ID
INNER JOIN Games g ON c.GameID = g.ID
INNER JOIN Tracks t ON c.TrackID = t.ID
INNER JOIN Cars cars ON c.CarID = cars.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
INNER JOIN Tyres tyres ON c.TyreID = tyres.ID
INNER JOIN Countries countries ON t.CountryID = countries.ID
WHERE TimeRank = 1