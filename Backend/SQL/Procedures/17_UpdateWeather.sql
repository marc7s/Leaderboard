CREATE OR ALTER PROCEDURE UpdateWeather
    @WeatherID int,
    @NewName nvarchar(255)
AS
BEGIN
    --ERROR HANDLING

    --CHECK WEATHER PARAM
    IF @WeatherID IS NULL
    BEGIN
        RAISERROR(N'Weather not supplied', 11, 1);
        RETURN
    END

    --CHECK NAME PARAM
    IF @NewName IS NULL
    BEGIN
        RAISERROR(N'New name not supplied', 11, 1);
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

    --ALL GOOD, UPDATE WEATHER
    UPDATE Weathers SET Name = @NewName WHERE ID = @WeatherID;
END
GO