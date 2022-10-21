CREATE OR ALTER PROCEDURE UpdateTyre
    @TyreID int,
    @NewFullName nvarchar(255),
    @NewShortName nvarchar(100)
AS
BEGIN
    --ERROR HANDLING

    --CHECK TYRE PARAM
    IF @TyreID IS NULL
    BEGIN
        RAISERROR(N'Tyre not supplied', 11, 1);
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

    --CHECK THAT TYRE EXISTS
    DECLARE @TyreID_db int
    SELECT @TyreID_db = ID FROM Tyres WHERE ID = @TyreID
    IF @TyreID_db IS NULL
    BEGIN
        RAISERROR(N'Tyre does not exist', 11, 1);
        RETURN
    END

    --ALL GOOD, UPDATE TYRE
    UPDATE Tyres SET ShortName = @NewShortName, FullName = @NewFullName WHERE ID = @TyreID;
END
GO