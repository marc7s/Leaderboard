CREATE OR ALTER PROCEDURE GetOrAddConfig
    @Description nvarchar(255),
    @GameID int,
    @TrackID int,
    @CarID int,
    @WeatherID int,
    @TyreID int,
    @SetupID int
AS
BEGIN
    --TRY TO GET THE CONFIG
    DECLARE @ConfigID_db int
    SELECT @ConfigID_db = c.ID FROM Configs c
    INNER JOIN Setups s ON c.SetupID = s.ID
    WHERE 
        c.GameID = @GameID AND
        c.TrackID = @TrackID AND
        c.CarID = @CarID AND
        c.WeatherID = @WeatherID AND
        c.TyreID = @TyreID AND
        c.SetupID = @SetupID
    
    IF @ConfigID_db IS NOT NULL
    BEGIN
        SELECT @ConfigID_db AS ID
        RETURN
    END

    --NO RESULT, ADD THE CONFIG
    EXEC AddConfig @Description, @GameID, @TrackID, @CarID, @WeatherID, @TyreID, @SetupID
END
GO