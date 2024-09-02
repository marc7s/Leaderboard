CREATE OR ALTER PROCEDURE AddUser
    @Username nvarchar(255)
AS
BEGIN
    --ERROR HANDLING

    --CHECK USER PARAM
    IF @Username IS NULL
    BEGIN
        RAISERROR(N'User not supplied', 11, 1);
        RETURN
    END

    --CHECK IF USER ALREADY EXISTS
    DECLARE @Username_db nvarchar(255)
    SELECT @Username_db = Username FROM Users WHERE Username = @Username
    IF @Username_db IS NOT NULL
    BEGIN
        RAISERROR(N'User already exists', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD USER
    INSERT INTO Users(Username) VALUES (@Username);
END
GO