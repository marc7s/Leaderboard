CREATE OR ALTER FUNCTION GetUserTimes(@Username nvarchar(255)) 
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
	tr.FullName AS TrackFullName,
	tr.ShortName AS TrackShortName,
	car.FullName AS CarFullName,
	car.ShortName AS CarShortName,
	w.Name AS Weather,
	c.CustomSetup AS ConfigCustomSetup
FROM Times t
INNER JOIN Users u ON t.UserID = u.ID
INNER JOIN Configs c ON t.ConfigID = c.ID
INNER JOIN Tracks tr ON c.TrackID = tr.ID
INNER JOIN Cars car ON c.CarID = car.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
WHERE Username = @Username