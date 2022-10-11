CREATE OR ALTER FUNCTION GetUserTimes(@Username nvarchar(255)) 
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
	t.AddedAt,
	tr.FullName AS TrackFullName,
	tr.ShortName AS TrackShortName,
	car.FullName AS CarFullName,
	car.ShortName AS CarShortName
FROM Times t
INNER JOIN Configs c ON t.ConfigID = c.ID
INNER JOIN Tracks tr ON c.TrackID = tr.ID
INNER JOIN Cars car ON c.CarID = car.ID
WHERE Username = @Username