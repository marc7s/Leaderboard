CREATE OR ALTER FUNCTION GetConfigs() 
RETURNS TABLE 
AS
RETURN 
SELECT
	c.ID,
	c.Description,
	g.ID AS GameID,
	g.Name AS GameName,
	t.ID AS TrackID,
	t.FullName AS TrackFullName,
	t.ShortName AS TrackShortName,
	car.ID AS CarID,
	car.FullName AS CarFullName,
	car.ShortName AS CarShortName,
	w.ID AS WeatherID,
	w.Name AS WeatherName,
	tyre.ID AS TyreID,
	tyre.FullName AS TyreFullName,
	tyre.ShortName AS TyreShortName,
	c.CustomSetup,
	c.AddedAt
FROM Configs c
INNER JOIN Games g ON c.GameID = g.ID
INNER JOIN Tracks t ON c.TrackID = t.ID
INNER JOIN Cars car on c.CarID = car.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
INNER JOIN Tyres tyre ON c.TyreID = tyre.ID
WHERE c.Authentic = 0