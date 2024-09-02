CREATE OR ALTER PROCEDURE UpdateConfig
    @ConfigID int,
    @Description nvarchar(255),
    @GameID int,
    @TrackID int,
    @CarID int,
    @WeatherID int,
    @TyreID int,
    @SetupID int
AS
BEGIN
    --ERROR HANDLING

    --CHECK CONFIGID PARAM
    IF @ConfigID IS NULL
    BEGIN
        RAISERROR(N'Config ID not supplied', 11, 1);
        RETURN
    END

    --CHECK GAMEID PARAM
    IF @GameID IS NULL
    BEGIN
        RAISERROR(N'Game ID not supplied', 11, 1);
        RETURN
    END

    --CHECK TRACKID PARAM
    IF @TrackID IS NULL
    BEGIN
        RAISERROR(N'Track ID not supplied', 11, 1);
        RETURN
    END

    --CHECK CARID PARAM
    IF @CarID IS NULL
    BEGIN
        RAISERROR(N'Car ID not supplied', 11, 1);
        RETURN
    END

    --CHECK WEATHERID PARAM
    IF @WeatherID IS NULL
    BEGIN
        RAISERROR(N'Weather ID not supplied', 11, 1);
        RETURN
    END

    --CHECK TYREID PARAM
    IF @TyreID IS NULL
    BEGIN
        RAISERROR(N'Tyre ID not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPID PARAM
    IF @SetupID IS NULL
    BEGIN
        RAISERROR(N'Setup ID not supplied', 11, 1);
        RETURN
    END

    --CHECK THAT DESCRIPTION DOES NOT EXIST
    DECLARE @Description_db nvarchar(255)
    SELECT @Description_db = Description FROM Configs WHERE Description = @Description AND Description IS NOT NULL
    IF @Description_db IS NOT NULL
    BEGIN
        RAISERROR(N'Description already exists', 11, 1);
        RETURN
    END

    --CHECK THAT GAME EXISTS
    DECLARE @GameID_db int
    SELECT @GameID_db = ID FROM Games WHERE ID = @GameID
    IF @GameID_db IS NULL
    BEGIN
        RAISERROR(N'Game does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT TRACK EXISTS
    DECLARE @TrackID_db int
    SELECT @TrackID_db = ID FROM Tracks WHERE ID = @TrackID
    IF @TrackID_db IS NULL
    BEGIN
        RAISERROR(N'Track does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT CAR EXISTS
    DECLARE @CarID_db int
    SELECT @CarID_db = ID FROM Cars WHERE ID = @CarID
    IF @CarID_db IS NULL
    BEGIN
        RAISERROR(N'Car does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT WEATHER EXISTS
    DECLARE @WeatherID_db int
    SELECT @WeatherID_db = ID FROM Weathers WHERE ID = @WeatherID
    IF @WeatherID_db IS NULL
    BEGIN
        RAISERROR(N'Weather does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT TYRE EXISTS
    DECLARE @TyreID_db int
    SELECT @TyreID_db = ID FROM Tyres WHERE ID = @TyreID
    IF @TyreID_db IS NULL
    BEGIN
        RAISERROR(N'Tyre does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT SETUP EXISTS
    DECLARE @SetupID_db int
    SELECT @SetupID_db = ID FROM Setups WHERE ID = @SetupID
    IF @SetupID_db IS NULL
    BEGIN
        RAISERROR(N'Setup does not exist', 11, 1);
        RETURN
    END

    --ALL GOOD, UPDATE CONFIG
    UPDATE Configs SET Description = @Description, GameID = @GameID, TrackID = @TrackID, CarID = @CarID, WeatherID = @WeatherID, TyreID = @TyreID, SetupID = @SetupID WHERE ID = @ConfigID

END
GO