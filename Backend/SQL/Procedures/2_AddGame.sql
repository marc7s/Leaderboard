CREATE OR ALTER PROCEDURE AddGame
    @Name nvarchar(255)
AS
BEGIN
    --ERROR HANDLING

    --CHECK GAME PARAM
    IF @Name IS NULL
    BEGIN
        RAISERROR(N'Game name not supplied', 11, 1);
        RETURN
    END

    --CHECK IF GAME ALREADY EXISTS
    DECLARE @Name_db nvarchar(255)
    SELECT @Name_db = Name FROM Games WHERE Name = @Name
    IF @Name_db IS NOT NULL
    BEGIN
        RAISERROR(N'Game already exists', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD GAME
    INSERT INTO Games(Name) VALUES (@Name);
END
GO