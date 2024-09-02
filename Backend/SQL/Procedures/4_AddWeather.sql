CREATE OR ALTER PROCEDURE AddWeather
    @Name nvarchar(255)
AS
BEGIN
    --ERROR HANDLING

    --CHECK NAME PARAM
    IF @Name IS NULL
    BEGIN
        RAISERROR(N'Weather not supplied', 11, 1);
        RETURN
    END

    --CHECK IF WEATHER ALREADY EXISTS
    DECLARE @Name_db nvarchar(255)
    SELECT @Name_db = Name FROM Weathers WHERE Name = @Name
    IF @Name_db IS NOT NULL
    BEGIN
        RAISERROR(N'Weather already exists', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD WEATHER
    INSERT INTO Weathers(Name) VALUES (@Name);
END
GO