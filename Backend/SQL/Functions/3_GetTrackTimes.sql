CREATE OR ALTER FUNCTION GetTrackTimes(@TrackID int) 
RETURNS TABLE 
AS
RETURN 
SELECT
	t.ID,
	t.Time,
	t.Millis,
	t.Username,
	t.ConfigID,
	t.Valid,
	w.Name AS Weather,
	t.AddedAt
FROM Times t
INNER JOIN Configs c ON t.ConfigID = c.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
WHERE TrackID = @TrackID