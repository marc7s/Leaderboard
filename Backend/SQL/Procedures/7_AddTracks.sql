CREATE OR ALTER PROCEDURE AddTrack
    @FullName nvarchar(255),
    @ShortName nvarchar(100),
    @CountryID int
AS
BEGIN
    --ERROR HANDLING

    --CHECK FULLNAME PARAM
    IF @FullName IS NULL
    BEGIN
        RAISERROR(N'Full name not supplied', 11, 1);
        RETURN
    END

    --CHECK SHORTNAME PARAM
    IF @ShortName IS NULL
    BEGIN
        RAISERROR(N'Short name not supplied', 11, 1);
        RETURN
    END

    --CHECK COUNTRY PARAM
    IF @CountryID IS NULL
    BEGIN
        RAISERROR(N'Country ID not supplied', 11, 1);
        RETURN
    END

    --CHECK IF FULLNAME ALREADY EXISTS
    DECLARE @FullName_db nvarchar(255)
    SELECT @FullName_db = FullName FROM Tyres WHERE FullName = @FullName
    IF @FullName_db IS NOT NULL
    BEGIN
        RAISERROR(N'Full name already exists', 11, 1);
        RETURN
    END

    --CHECK IF SHORTNAME ALREADY EXISTS
    DECLARE @ShortName_db nvarchar(100)
    SELECT @ShortName_db = ShortName FROM Tyres WHERE ShortName = @ShortName
    IF @ShortName_db IS NOT NULL
    BEGIN
        RAISERROR(N'Short name already exists', 11, 1);
        RETURN
    END

    --CHECK THAT COUNTRY EXISTS
    DECLARE @CountryID_db int
    SELECT @CountryID_db = ID FROM Countries WHERE ID = @CountryID
    IF @CountryID_db IS NULL
    BEGIN
        RAISERROR(N'Country does not exist', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD TRACK
    INSERT INTO Tracks(FullName, ShortName, CountryID) VALUES (@FullName, @ShortName, @CountryID);
END
GO