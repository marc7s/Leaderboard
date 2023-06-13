CREATE OR ALTER PROCEDURE AddTime
    @Time nvarchar(12),
    @UserID int,
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

    --CHECK USER PARAM
    IF @UserID IS NULL
    BEGIN
        RAISERROR(N'User not supplied', 11, 1);
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
    DECLARE @UserID_db int
    SELECT @UserID_db = ID FROM Users WHERE ID = @UserID
    IF @UserID_db IS NULL
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

    DECLARE @TimeConverted Time(3)
    SELECT @TimeConverted = CONVERT(Time(3), @Time)
    --ALL GOOD, ADD TIME
    INSERT INTO Times(Time, Millis, UserID, ConfigID, Valid) VALUES (@TimeConverted, DATEDIFF(MILLISECOND, 0, @TimeConverted), @UserID, @ConfigID, @Valid);
END
GO