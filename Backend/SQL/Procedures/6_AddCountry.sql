CREATE OR ALTER PROCEDURE AddCountry
    @FullName nvarchar(255),
    @ShortName nvarchar(100),
    @Alpha2Code nvarchar(2)
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

    --CHECK ALPHA2CODE PARAM
    IF @Alpha2Code IS NULL
    BEGIN
        RAISERROR(N'Alpha 2 code not supplied', 11, 1);
        RETURN
    END

    --CHECK IF FULLNAME ALREADY EXISTS
    DECLARE @FullName_db nvarchar(255)
    SELECT @FullName_db = FullName FROM Countries WHERE FullName = @FullName
    IF @FullName_db IS NOT NULL
    BEGIN
        RAISERROR(N'Full name already exists', 11, 1);
        RETURN
    END

    --CHECK IF SHORTNAME ALREADY EXISTS
    DECLARE @ShortName_db nvarchar(100)
    SELECT @ShortName_db = ShortName FROM Countries WHERE ShortName = @ShortName
    IF @ShortName_db IS NOT NULL
    BEGIN
        RAISERROR(N'Short name already exists', 11, 1);
        RETURN
    END

    --CHECK IF ALPHA2CODE ALREADY EXISTS
    DECLARE @Alpha2Code_db nvarchar(2)
    SELECT @Alpha2Code_db = Alpha2Code FROM Countries WHERE Alpha2Code = @Alpha2Code
    IF @Alpha2Code_db IS NOT NULL
    BEGIN
        RAISERROR(N'Alpha 2 code already exists', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD COUNTRY
    INSERT INTO Countries(FullName, ShortName, Alpha2Code) VALUES (@FullName, @ShortName, @Alpha2Code);
END
GO