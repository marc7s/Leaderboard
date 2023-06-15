CREATE OR ALTER PROCEDURE AddAutoTime
    @Time nvarchar(12),
    @UserID int,
    @GameName nvarchar(255),
    @TrackName nvarchar(255),
    @CarName nvarchar(255),
    @WeatherName nvarchar(255),
    @TyreName nvarchar(255),
    @SetupFrontWing int,
    @SetupRearWing int,
    @SetupOnThrottle int,
    @SetupOffThrottle int,
    @SetupFrontCamber float,
    @SetupRearCamber float,
    @SetupFrontToe float,
    @SetupRearToe float,
    @SetupFrontSuspension int,
    @SetupRearSuspension int,
    @SetupFrontAntiRollBar int,
    @SetupRearAntiRollBar int,
    @SetupFrontSuspensionHeight int,
    @SetupRearSuspensionHeight int,
    @SetupBrakePressure int,
    @SetupBrakeBias int,
    @SetupRearLeftTyrePressure float,
    @SetupRearRightTyrePressure float,
    @SetupFrontLeftTyrePressure float,
    @SetupFrontRightTyrePressure float,
    @SetupBallast int,
    @SetupFuelLoad float,
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

    --CHECK GAMENAME PARAM
    IF @GameName IS NULL
    BEGIN
        RAISERROR(N'Game Name not supplied', 11, 1);
        RETURN
    END

    --CHECK TRACKNAME PARAM
    IF @TrackName IS NULL
    BEGIN
        RAISERROR(N'Track Name not supplied', 11, 1);
        RETURN
    END

    --CHECK CARNAME PARAM
    IF @CarName IS NULL
    BEGIN
        RAISERROR(N'Car Name not supplied', 11, 1);
        RETURN
    END

    --CHECK WEATHERNAME PARAM
    IF @WeatherName IS NULL
    BEGIN
        RAISERROR(N'Weather Name not supplied', 11, 1);
        RETURN
    END

    --CHECK TYRENAME PARAM
    IF @TyreName IS NULL
    BEGIN
        RAISERROR(N'Tyre Name not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFRONTWING PARAM
    IF @SetupFrontWing IS NULL
    BEGIN
        RAISERROR(N'Setup Front Wing not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPREARWING PARAM
    IF @SetupRearWing IS NULL
    BEGIN
        RAISERROR(N'Setup Rear Wing not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPONTHROTTLE PARAM
    IF @SetupOnThrottle IS NULL
    BEGIN
        RAISERROR(N'Setup On Throttle not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPOFFTHROTTLE PARAM
    IF @SetupOffThrottle IS NULL
    BEGIN
        RAISERROR(N'Setup Off Throttle not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFRONTCAMBER PARAM
    IF @SetupFrontCamber IS NULL
    BEGIN
        RAISERROR(N'Setup Front Camber not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPREARCAMBER PARAM
    IF @SetupRearCamber IS NULL
    BEGIN
        RAISERROR(N'Setup Rear Camber not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFRONTTOE PARAM
    IF @SetupFrontToe IS NULL
    BEGIN
        RAISERROR(N'Setup Front Toe not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPREARTOE PARAM
    IF @SetupRearToe IS NULL
    BEGIN
        RAISERROR(N'Setup Rear Toe not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFRONTSUSPENSION PARAM
    IF @SetupFrontSuspension IS NULL
    BEGIN
        RAISERROR(N'Setup Front Suspension not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPREARSUSPENSION PARAM
    IF @SetupRearSuspension IS NULL
    BEGIN
        RAISERROR(N'Setup Rear Suspension not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFRONTANTIROLLBAR PARAM
    IF @SetupFrontAntiRollBar IS NULL
    BEGIN
        RAISERROR(N'Setup Front Anti Roll Bar not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPREARANTIROLLBAR PARAM
    IF @SetupRearAntiRollBar IS NULL
    BEGIN
        RAISERROR(N'Setup Rear Anti Roll Bar not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFRONTSUSPENSIONHEIGHT PARAM
    IF @SetupFrontSuspensionHeight IS NULL
    BEGIN
        RAISERROR(N'Setup Front Suspension Height not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPREARSUSPENSIONHEIGHT PARAM
    IF @SetupRearSuspensionHeight IS NULL
    BEGIN
        RAISERROR(N'Setup Rear Suspension Height not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPBRAKEPRESSURE PARAM
    IF @SetupBrakePressure IS NULL
    BEGIN
        RAISERROR(N'Setup Brake Pressure not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPBRAKEBIAS PARAM
    IF @SetupBrakeBias IS NULL
    BEGIN
        RAISERROR(N'Setup Brake Bias not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPREARLEFTTYREPRESSURE PARAM
    IF @SetupRearLeftTyrePressure IS NULL
    BEGIN
        RAISERROR(N'Setup Rear Left Tyre Pressure not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPREARRIGHTTYREPRESSURE PARAM
    IF @SetupRearRightTyrePressure IS NULL
    BEGIN
        RAISERROR(N'Setup Rear Right Tyre Pressure not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFRONTLEFTTYREPRESSURE PARAM
    IF @SetupFrontLeftTyrePressure IS NULL
    BEGIN
        RAISERROR(N'Setup Front Left Tyre Pressure not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFRONTRIGHTTYREPRESSURE PARAM
    IF @SetupFrontRightTyrePressure IS NULL
    BEGIN
        RAISERROR(N'Setup Front Right Tyre Pressure not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPBALLAST PARAM
    IF @SetupBallast IS NULL
    BEGIN
        RAISERROR(N'Setup Ballast not supplied', 11, 1);
        RETURN
    END

    --CHECK SETUPFUELLOAD PARAM
    IF @SetupFuelLoad IS NULL
    BEGIN
        RAISERROR(N'Setup Fuel Load not supplied', 11, 1);
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

    --CHECK THAT GAME EXISTS
    DECLARE @GameID_db int
    SELECT @GameID_db = ID FROM Games WHERE Name = @GameName
    IF @GameID_db IS NULL
    BEGIN
        RAISERROR(N'Game does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT TRACK EXISTS
    DECLARE @TrackID_db int
    SELECT @TrackID_db = ID FROM Tracks WHERE FullName = @TrackName
    IF @TrackID_db IS NULL
    BEGIN
        RAISERROR(N'Track does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT CAR EXISTS
    DECLARE @CarID_db int
    SELECT @CarID_db = ID FROM Cars WHERE FullName = @CarName
    IF @CarID_db IS NULL
    BEGIN
        RAISERROR(N'Car does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT WEATHER EXISTS
    DECLARE @WeatherID_db int
    SELECT @WeatherID_db = ID FROM Weathers WHERE Name = @WeatherName
    IF @WeatherID_db IS NULL
    BEGIN
        RAISERROR(N'Weather does not exist', 11, 1);
        RETURN
    END

    --CHECK THAT TYRE EXISTS
    DECLARE @TyreID_db int
    SELECT @TyreID_db = ID FROM Tyres WHERE FullName = @TyreName
    IF @TyreID_db IS NULL
    BEGIN
        RAISERROR(N'Tyre does not exist', 11, 1);
        RETURN
    END

    --GET SETUP ID
    DECLARE @SetupID_db int
    SELECT @SetupID_db = ID FROM Setups
    WHERE
        FrontWing = @SetupFrontWing AND
        RearWing = @SetupRearWing AND
        OnThrottle = @SetupOnThrottle AND
        OffThrottle = @SetupOffThrottle AND
        FrontCamber = @SetupFrontCamber AND
        RearCamber = @SetupRearCamber AND
        FrontToe = @SetupFrontToe AND
        RearToe = @SetupRearToe AND
        FrontSuspension = @SetupFrontSuspension AND
        RearSuspension = @SetupRearSuspension AND
        FrontAntiRollBar = @SetupFrontAntiRollBar AND
        RearAntiRollBar = @SetupRearAntiRollBar AND
        FrontSuspensionHeight = @SetupFrontSuspensionHeight AND
        RearSuspensionHeight = @SetupRearSuspensionHeight AND
        BrakePressure = @SetupBrakePressure AND
        BrakeBias = @SetupBrakeBias AND
        RearLeftTyrePressure = @SetupRearLeftTyrePressure AND
        RearRightTyrePressure = @SetupRearRightTyrePressure AND
        FrontLeftTyrePressure = @SetupFrontLeftTyrePressure AND
        FrontRightTyrePressure = @SetupFrontRightTyrePressure AND
        Ballast = @SetupBallast AND
        FuelLoad = @SetupFuelLoad
    IF @SetupID_db IS NULL
    BEGIN
        --SETUP DOES NOT EXIST, CREATE IT
        DECLARE @SetupTypeID_db int
        SELECT @SetupTypeID_db = ID FROM SetupTypes WHERE Description = 'Custom'
        
        DECLARE @SetupTable TABLE (ID int)
        
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
        OUTPUT INSERTED.ID INTO @SetupTable(ID)
        VALUES(
            @SetupTypeID_db,
            @SetupFrontWing,
            @SetupRearWing,
            @SetupOnThrottle,
            @SetupOffThrottle,
            @SetupFrontCamber,
            @SetupRearCamber,
            @SetupFrontToe,
            @SetupRearToe,
            @SetupFrontSuspension,
            @SetupRearSuspension,
            @SetupFrontAntiRollBar,
            @SetupRearAntiRollBar,
            @SetupFrontSuspensionHeight,
            @SetupRearSuspensionHeight,
            @SetupBrakePressure,
            @SetupBrakeBias,
            @SetupRearLeftTyrePressure,
            @SetupRearRightTyrePressure,
            @SetupFrontLeftTyrePressure,
            @SetupFrontRightTyrePressure,
            @SetupBallast,
            @SetupFuelLoad
        );

        SELECT @SetupID_db = ID FROM @SetupTable
    END

    --GET CONFIG ID
    DECLARE @ConfigID_db int
    SELECT @ConfigID_db = ID FROM Configs
    WHERE
        Description IS NULL AND
        GameID = @GameID_db AND
        TrackID = @TrackID_db AND
        CarID = @CarID_db AND
        WeatherID = @WeatherID_db AND
        TyreID = @TyreID_db AND
        SetupID = @SetupID_db AND
        Authentic = 0
    IF @ConfigID_db IS NULL
    BEGIN
        --CONFIG DOES NOT EXIST, CREATE IT
        DECLARE @ConfigTable TABLE (ID int)
        
        INSERT INTO Configs(Description, GameID, TrackID, CarID, WeatherID, TyreID, SetupID, Authentic)
        OUTPUT INSERTED.ID INTO @ConfigTable(ID)
        VALUES(NULL, @GameID_db, @TrackID_db, @CarID_db, @WeatherID_db, @TyreID_db, @SetupID_db, 0);

        SELECT @ConfigID_db = ID FROM @ConfigTable
    END

    

    DECLARE @TimeConverted Time(3)
    SELECT @TimeConverted = CONVERT(Time(3), @Time)

    --CHECK TIME DUPLICATE
    DECLARE @TimeID_db int
    SELECT @TimeID_db = ID FROM Times
    WHERE
        Time = @TimeConverted AND
        UserID = @UserID_db AND
        ConfigID = @ConfigID_db AND
        Valid = @Valid
    IF @TimeID_db IS NOT NULL
    BEGIN
        RAISERROR(N'Time already exists', 11, 1);
        RETURN
    END

    --ALL GOOD, ADD TIME
    INSERT INTO Times(Time, Millis, UserID, ConfigID, Valid, AddedManually) VALUES (@TimeConverted, DATEDIFF(MILLISECOND, 0, @TimeConverted), @UserID_db, @ConfigID_db, @Valid, 0);
END
GO