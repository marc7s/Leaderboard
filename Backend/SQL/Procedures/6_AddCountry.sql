CREATE OR ALTER PROCEDURE AddCountry
    @FullName nvarchar(255),
    @ShortName nvarchar(100)
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

    --ALL GOOD, ADD COUNTRY
    INSERT INTO Countries(FullName, ShortName) VALUES (@FullName, @ShortName);
END
GO