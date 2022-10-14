CREATE OR ALTER PROCEDURE AddConfig
    @Description nvarchar(255),
    @GameID int,
    @TrackID int,
    @CarID int,
    @WeatherID int,
    @TyreID int,
    @CustomSetup bit
AS
BEGIN
    --ERROR HANDLING

    --CHECK DESCRIPTION PARAM
    IF @Description IS NULL
    BEGIN
        RAISERROR(N'Description not supplied', 11, 1);
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

    --CHECK CUSTOMSETUP PARAM
    IF @CustomSetup IS NULL
    BEGIN
        RAISERROR(N'Custom Setup not supplied', 11, 1);
        RETURN
    END

    --CHECK THAT DESCRIPTION DOES NOT EXIST
    DECLARE @Description_db nvarchar(255)
    SELECT @Description_db = Description FROM Configs WHERE Description = @Description
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

    --CHECK THAT WEATHER EXISTS
    DECLARE @TyreID_db int
    SELECT @TyreID_db = ID FROM Tyres WHERE ID = @TyreID
    IF @TyreID_db IS NULL
    BEGIN
        RAISERROR(N'Tyre does not exist', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD CONFIG
    INSERT INTO Configs(Description, GameID, TrackID, CarID, WeatherID, TyreID, CustomSetup) VALUES (@Description, @GameID, @TrackID, @CarID, @WeatherID, @TyreID, @CustomSetup);
END
GO