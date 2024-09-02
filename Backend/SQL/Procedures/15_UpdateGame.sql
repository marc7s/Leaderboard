CREATE OR ALTER PROCEDURE UpdateGame
    @GameID int,
    @NewName nvarchar(255)
AS
BEGIN
    --ERROR HANDLING

    --CHECK GAME PARAM
    IF @GameID IS NULL
    BEGIN
        RAISERROR(N'Game not supplied', 11, 1);
        RETURN
    END

    --CHECK NAME PARAM
    IF @NewName IS NULL
    BEGIN
        RAISERROR(N'New name not supplied', 11, 1);
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

    --ALL GOOD, UPDATE GAME
    UPDATE Games SET Name = @NewName WHERE ID = @GameID;
END
GO