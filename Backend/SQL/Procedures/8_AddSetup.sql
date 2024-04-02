CREATE OR ALTER PROCEDURE AddSetup
    @Description nvarchar(255),
    @Custom bit,
    @Manual bit,
    @FrontWing int,
    @RearWing int,
    @OnThrottle int,
    @OffThrottle int,
    @FrontCamber float,
    @RearCamber float,
    @FrontToe float,
    @RearToe float,
    @FrontSuspension int,
    @RearSuspension int,
    @FrontAntiRollBar int,
    @RearAntiRollBar int,
    @FrontSuspensionHeight int,
    @RearSuspensionHeight int,
    @BrakePressure int,
    @BrakeBias int,
    @RearLeftTyrePressure float,
    @RearRightTyrePressure float,
    @FrontLeftTyrePressure float,
    @FrontRightTyrePressure float,
    @Ballast int,
    @FuelLoad float
AS
BEGIN
    --ERROR HANDLING
    --CHECK CUSTOM PARAM
    IF @Custom IS NULL
    BEGIN
        RAISERROR(N'Custom param missing', 11, 1);
        RETURN
    END

    --CHECK MANUAL PARAM
    IF @Manual IS NULL
    BEGIN
        RAISERROR(N'Manual param missing', 11, 1);
        RETURN
    END

    --CHECK DESCRIPTION AND MANUAL PARAMS
    IF @Description IS NULL AND @Manual = 1
    BEGIN
        RAISERROR(N'Manual setups must have a description', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD SETUP
    DECLARE @InsertedTable TABLE(ID int)
    INSERT INTO Setups(
        Description,
        Custom,
        Manual, 
        FrontWing, 
        RearWing, 
        OnThrottle, 
        OffThrottle, 
        FrontCamber, 
        RearCamber, 
        FrontToe, 
        RearToe, 
        FrontSuspension, 
        RearSuspension, 
        FrontAntiRollBar, 
        RearAntiRollBar, 
        FrontSuspensionHeight, 
        RearSuspensionHeight, 
        BrakePressure, 
        BrakeBias, 
        RearLeftTyrePressure, 
        RearRightTyrePressure, 
        FrontLeftTyrePressure, 
        FrontRightTyrePressure, 
        Ballast, 
        FuelLoad
    )
    OUTPUT INSERTED.ID INTO @InsertedTable
    VALUES (
        @Description,
        @Custom,
        @Manual,
        @FrontWing,
        @RearWing,
        @OnThrottle,
        @OffThrottle,
        @FrontCamber,
        @RearCamber,
        @FrontToe,
        @RearToe,
        @FrontSuspension,
        @RearSuspension,
        @FrontAntiRollBar,
        @RearAntiRollBar,
        @FrontSuspensionHeight,
        @RearSuspensionHeight,
        @BrakePressure,
        @BrakeBias,
        @RearLeftTyrePressure,
        @RearRightTyrePressure,
        @FrontLeftTyrePressure,
        @FrontRightTyrePressure,
        @Ballast,
        @FuelLoad
    );

    SELECT ID FROM @InsertedTable;
END
GO