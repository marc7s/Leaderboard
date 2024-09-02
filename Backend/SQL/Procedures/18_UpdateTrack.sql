CREATE OR ALTER PROCEDURE UpdateTrack
    @TrackID int,
    @CountryID int,
    @NewFullName nvarchar(255),
    @NewShortName nvarchar(100)
AS
BEGIN
    --ERROR HANDLING

    --CHECK TRACK PARAM
    IF @TrackID IS NULL
    BEGIN
        RAISERROR(N'Track not supplied', 11, 1);
        RETURN
    END

    --CHECK COUNTRY PARAM
    IF @CountryID IS NULL
    BEGIN
        RAISERROR(N'Country not supplied', 11, 1);
        RETURN
    END

    --CHECK SHORT NAME PARAM
    IF @NewShortName IS NULL
    BEGIN
        RAISERROR(N'New short name not supplied', 11, 1);
        RETURN
    END

    --CHECK FULL NAME PARAM
    IF @NewFullName IS NULL
    BEGIN
        RAISERROR(N'New full name not supplied', 11, 1);
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

    --CHECK THAT COUNTRY EXISTS
    DECLARE @CountryID_db int
    SELECT @CountryID_db = ID FROM Countries WHERE ID = @CountryID
    IF @CountryID_db IS NULL
    BEGIN
        RAISERROR(N'Country does not exist', 11, 1);
        RETURN
    END

    --ALL GOOD, UPDATE TRACK
    UPDATE Tracks SET CountryID = @CountryID, ShortName = @NewShortName, FullName = @NewFullName WHERE ID = @TrackID;
END
GO