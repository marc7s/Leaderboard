CREATE OR ALTER PROCEDURE UpdateCar
    @CarID int,
    @NewFullName nvarchar(255),
    @NewShortName nvarchar(100)
AS
BEGIN
    --ERROR HANDLING

    --CHECK CAR PARAM
    IF @CarID IS NULL
    BEGIN
        RAISERROR(N'Car not supplied', 11, 1);
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

    --CHECK THAT CAR EXISTS
    DECLARE @CarID_db int
    SELECT @CarID_db = ID FROM Cars WHERE ID = @CarID
    IF @CarID_db IS NULL
    BEGIN
        RAISERROR(N'Car does not exist', 11, 1);
        RETURN
    END

    --ALL GOOD, UPDATE CAR
    UPDATE Cars SET ShortName = @NewShortName, FullName = @NewFullName WHERE ID = @CarID;
END
GO