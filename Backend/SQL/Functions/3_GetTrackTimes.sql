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
	g.ID AS GameID,
	g.Name AS GameName,
	g.Authentic AS GameAuthentic,
	w.Name AS Weather,
	c.CustomSetup AS ConfigCustomSetup,
	car.FullName AS CarFullName,
	car.ShortName AS CarShortName
FROM (
	SELECT ID, Time, Millis, UserID, ConfigID, Valid, AddedAt, ROW_NUMBER() OVER (PARTITION BY UserID, ConfigID, Valid ORDER BY Time ASC) TimeRank FROM Times
)
t
INNER JOIN Users u ON t.UserID = u.ID
INNER JOIN Configs c ON t.ConfigID = c.ID
INNER JOIN Games g ON c.GameID = g.ID
INNER JOIN Cars car ON c.CarID = car.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
WHERE 
	TrackID = @TrackID AND 
	TimeRank <= 1 -- Only return the best times for each user, config and validity combination