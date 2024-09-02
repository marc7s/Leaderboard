CREATE OR ALTER PROCEDURE UpdateUser
    @UserID int,
    @NewUsername nvarchar(255)
AS
BEGIN
    --ERROR HANDLING

    --CHECK USER PARAM
    IF @UserID IS NULL
    BEGIN
        RAISERROR(N'User not supplied', 11, 1);
        RETURN
    END

    --CHECK USERNAME PARAM
    IF @NewUsername IS NULL
    BEGIN
        RAISERROR(N'New username not supplied', 11, 1);
        RETURN
    END

    --CHECK THAT USER EXISTS
    DECLARE @UserID_db int
    SELECT @UserID_db = ID FROM Users WHERE ID = @UserID
    IF @UserID_db IS NULL
    BEGIN
        RAISERROR(N'User does not exist', 11, 1);
        RETURN
    END

    --ALL GOOD, UPDATE USER
    UPDATE Users SET Username = @NewUsername WHERE ID = @UserID;
END
GO