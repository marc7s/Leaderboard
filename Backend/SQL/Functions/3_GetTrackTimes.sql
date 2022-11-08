CREATE OR ALTER FUNCTION GetTrackTimes(@TrackID int) 
RETURNS TABLE 
AS
RETURN 
SELECT
	t.ID,
	t.Time,
	t.Millis,
	t.UserID,
	t.ConfigID,
	t.Valid,
	t.AddedAt,
	u.Username,
	w.Name AS Weather,
	c.CustomSetup AS ConfigCustomSetup,
	car.FullName AS CarFullName,
	car.ShortName AS CarShortName
FROM Times t
INNER JOIN Users u ON t.UserID = u.ID
INNER JOIN Configs c ON t.ConfigID = c.ID
INNER JOIN Cars car ON c.CarID = car.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
WHERE TrackID = @TrackID