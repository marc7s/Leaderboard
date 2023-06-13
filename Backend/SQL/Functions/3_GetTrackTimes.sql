CREATE OR ALTER FUNCTION GetTrackTimes(@TrackID int)
RETURNS 
	@TrackTimes
	TABLE (
		ID int,
		Time time(3),
		Millis int,
		UserID int,
		ConfigID int,
		Valid bit,
		Record tinyint,
		AddedAt datetime,
		Username nvarchar(255),
		GameID int,
		GameName nvarchar(255),
		GameAuthentic bit,
		Weather nvarchar(255),
		SetupID int,
		SetupCustom bit,
		SetupDescription nvarchar(255),
		CarFullName nvarchar(255),
		CarShortName nvarchar(100)
	)
AS
BEGIN
DECLARE @TempRecords TABLE (ID int)
INSERT INTO @TempRecords SELECT ID FROM GetRecords();

INSERT INTO @TrackTimes SELECT
	t.ID,
	t.Time,
	t.Millis,
	t.UserID,
	t.ConfigID,
	t.Valid,
	(
		SELECT CASE WHEN EXISTS (
			SELECT *
			FROM @TempRecords
			WHERE ID = t.ID
		)
		THEN 
			CASE WHEN EXISTS(
				SELECT *
				FROM AuthenticTimes at
				INNER JOIN Configs c ON at.ConfigID = c.ID
				WHERE 
					c.TrackID = tr.ID AND t.Millis <= at.Millis AND t.Valid = 1
			) THEN 2 ELSE 1 END
		ELSE 0 END
	) AS Record,
	t.AddedAt,
	u.Username,
	g.ID AS GameID,
	g.Name AS GameName,
	g.Authentic AS GameAuthentic,
	w.Name AS Weather,
	s.ID AS SetupID,
	st.Custom AS SetupCustom,
	st.Description AS SetupDescription,
	car.FullName AS CarFullName,
	car.ShortName AS CarShortName
FROM (
	SELECT ID, Time, Millis, UserID, ConfigID, Valid, AddedAt, ROW_NUMBER() OVER (PARTITION BY UserID, ConfigID, Valid ORDER BY Time ASC) TimeRank FROM Times
)
t
INNER JOIN Users u ON t.UserID = u.ID
INNER JOIN Configs c ON t.ConfigID = c.ID
INNER JOIN Setups s ON c.SetupID = s.ID
INNER JOIN SetupTypes st ON s.TypeID = st.ID
INNER JOIN Tracks tr ON c.TrackID = tr.ID
INNER JOIN Games g ON c.GameID = g.ID
INNER JOIN Cars car ON c.CarID = car.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
WHERE
	TrackID = @TrackID AND 
	TimeRank <= 1 -- Only return the best times for each user, config and validity combination

RETURN
END