CREATE OR ALTER PROCEDURE UpdateCountry
    @CountryID int,
    @NewFullName nvarchar(255),
    @NewShortName nvarchar(100),
    @NewAlpha2Code nvarchar(2)
AS
BEGIN
    --ERROR HANDLING

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

    --CHECK ALPHA2CODE PARAM
    IF @NewAlpha2Code IS NULL
    BEGIN
        RAISERROR(N'New alpha 2 code not supplied', 11, 1);
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

    --CHECK THAT ALPA2CODE DOES NOT ALREADY EXIST
    DECLARE @Alpha2Code_db int
    SELECT @Alpha2Code_db = Alpha2Code FROM Countries WHERE ID = @NewAlpha2Code
    IF @Alpha2Code_db IS NULL
    BEGIN
        RAISERROR(N'Alpha 2 code already exists', 11, 1);
        RETURN
    END

    --ALL GOOD, UPDATE COUNTRY
    UPDATE Countries SET ShortName = @NewShortName, FullName = @NewFullName, Alpha2Code = @NewAlpha2Code WHERE ID = @CountryID;
END
GO