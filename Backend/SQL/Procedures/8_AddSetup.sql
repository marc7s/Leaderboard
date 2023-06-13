CREATE OR ALTER PROCEDURE AddSetup
    @SetupTypeName nvarchar(255),
    @Custom bit,
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
    --CHECK NAME AND CUSTOM PARAMS
    IF @SetupTypeName IS NULL AND @Custom IS NULL
    BEGIN
        RAISERROR(N'At least one of SetupTypeName or Custom has to be supplied', 11, 1);
        RETURN
    END
    
    --FIND SETUP TYPE ID
    DECLARE @SetupTypeID_db int
    SELECT @SetupTypeID_db = ID FROM SetupTypes WHERE Description = @SetupTypeName
    IF @SetupTypeName IS NULL OR @SetupTypeID_db IS NULL
    BEGIN
        SELECT @SetupTypeID_db = ID FROM SetupTypes WHERE Description = CASE WHEN @Custom = 1 THEN 'Custom' ELSE 'Default' END
    END

    --ALL GOOD, ADD SETUP
    DECLARE @InsertedTable TABLE(ID int)
    INSERT INTO Setups(
        TypeID, 
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
        @SetupTypeID_db,
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