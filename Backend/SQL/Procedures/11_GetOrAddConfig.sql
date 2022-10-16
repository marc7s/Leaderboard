CREATE OR ALTER PROCEDURE GetOrAddConfig
    @Description nvarchar(255),
    @GameID int,
    @TrackID int,
    @CarID int,
    @WeatherID int,
    @TyreID int,
    @CustomSetup bit
AS
BEGIN
    --TRY TO GET THE CONFIG
    DECLARE @ConfigID_db int
    SELECT @ConfigID_db = ID FROM Configs 
    WHERE 
        GameID = @GameID AND
        TrackID = @TrackID AND
        CarID = @CarID AND
        WeatherID = @WeatherID AND
        TyreID = @TyreID AND
        CustomSetup = @CustomSetup
    IF @ConfigID_db IS NOT NULL
    BEGIN
        SELECT @ConfigID_db AS ID
        RETURN
    END

    --NO RESULT, ADD THE CONFIG
    EXEC AddConfig @Description, @GameID, @TrackID, @CarID, @WeatherID, @TyreID, @CustomSetup
END
GO