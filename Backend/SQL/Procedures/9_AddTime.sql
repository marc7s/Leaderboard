CREATE OR ALTER PROCEDURE AddTime
    @Time Time(3),
    @Username nvarchar(255),
    @ConfigID int,
    @Valid bit
AS
BEGIN
    --ERROR HANDLING

    --CHECK TIME PARAM
    IF @Time IS NULL
    BEGIN
        RAISERROR(N'Time not supplied', 11, 1);
        RETURN
    END

    --CHECK USERNAME PARAM
    IF @Username IS NULL
    BEGIN
        RAISERROR(N'Username not supplied', 11, 1);
        RETURN
    END

    --CHECK CONFIG PARAM
    IF @ConfigID IS NULL
    BEGIN
        RAISERROR(N'Config ID not supplied', 11, 1);
        RETURN
    END

    --CHECK VALID PARAM
    IF @Valid IS NULL
    BEGIN
        RAISERROR(N'Valid not supplied', 11, 1);
        RETURN
    END

    --CHECK THAT USER EXISTS
    DECLARE @Username_db nvarchar(255)
    SELECT @Username_db = Username FROM Users WHERE Username = @Username
    IF @Username_db IS NULL
    BEGIN
        RAISERROR(N'User does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT CONFIG EXISTS
    DECLARE @ConfigID_db int
    SELECT @ConfigID_db = ID FROM Configs WHERE ID = @ConfigID
    IF @ConfigID_db IS NULL
    BEGIN
        RAISERROR(N'Config does not exist', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD TIME
    INSERT INTO Times(Time, Millis, Username, ConfigID, Valid) VALUES (@Time, DATEDIFF(MILLISECOND, 0, @Time), @Username, @ConfigID, @Valid);
END
GO