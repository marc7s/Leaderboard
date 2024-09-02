DROP TABLE IF EXISTS #Configs;

CREATE TABLE #Configs(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Description nvarchar(255) NOT NULL,
    GameName nvarchar(255) NOT NULL,
    TrackShortName nvarchar(255) NOT NULL,
    CarShortName nvarchar(100) NOT NULL,
    WeatherName nvarchar(255) NOT NULL,
    TyreShortName nvarchar(255) NOT NULL,
    SetupDescription nvarchar(255) NOT NULL
);

INSERT INTO #Configs(Description, GameName, TrackShortName, CarShortName, WeatherName, TyreShortName, SetupDescription) VALUES
    (N'F121 Ferrari TT Suzuka', N'F1 2021', N'Suzuka', N'Ferrari SF21', N'Dry', N'Soft', N'Balanced Default'),
    (N'F121 Ferrari TT Wet Suzuka', N'F1 2021', N'Suzuka', N'Ferrari SF21', N'Wet', N'Full Wet', N'Balanced Default'),
    (N'F121 Ferrari TT Monza', N'F1 2021', N'Monza', N'Ferrari SF21', N'Dry', N'Soft', N'Balanced Default'),
    (N'F121 Ferrari TT Wet Monza', N'F1 2021', N'Monza', N'Ferrari SF21', N'Wet', N'Full Wet', N'Balanced Default'),
    (N'F121 Ferrari TT Red Bull Ring', N'F1 2021', N'Red Bull Ring', N'Ferrari SF21', N'Dry', N'Soft', N'Balanced Default'),
    (N'F121 Ferrari TT Hermanos Rodriguez', N'F1 2021', N'Hermanos Rodriguez', N'Ferrari SF21', N'Dry', N'Soft', N'Balanced Default'),
    (N'F121 Ferrari TT Custom Hermanos Rodriguez', N'F1 2021', N'Hermanos Rodriguez', N'Ferrari SF21', N'Dry', N'Soft', N'Custom'),
    (N'F121 Ferrari TT Custom Zandvoort', N'F1 2021', N'Zandvoort', N'Ferrari SF21', N'Dry', N'Soft', N'Custom'),
    (N'F121 Mercedes TT Custom Hermanos Rodriguez', N'F1 2021', N'Hermanos Rodriguez', N'Mercedes W12', N'Dry', N'Soft', N'Custom'),
    (N'F121 Ferrari TT Custom Monza', N'F1 2021', N'Monza', N'Ferrari SF21', N'Dry', N'Soft', N'Custom');

DECLARE @ConfigID int = 0
DECLARE @ConfigDescription nvarchar(255)
DECLARE @ConfigGameID int = 0
DECLARE @ConfigTrackID int = 0
DECLARE @ConfigCarID int = 0
DECLARE @ConfigWeatherID int = 0
DECLARE @ConfigTyreID int = 0
DECLARE @ConfigSetupID int = 0

WHILE (1 = 1)
BEGIN
    SELECT TOP 1 @ConfigID = ID
    FROM #Configs
    WHERE ID > @ConfigID 
    ORDER BY ID

    IF @@ROWCOUNT = 0 BREAK;

    SELECT @ConfigGameID = g.ID FROM dbo.Games g INNER JOIN #Configs c ON g.Name = c.GameName
    WHERE c.ID = @ConfigID
    IF @ConfigGameID IS NULL
    BEGIN
        RAISERROR(N'Game does not exist', 11, 1);
        RETURN
    END

    SELECT @ConfigTrackID = t.ID FROM dbo.Tracks t INNER JOIN #Configs c ON t.ShortName = c.TrackShortName
    WHERE c.ID = @ConfigID
    IF @ConfigTrackID IS NULL
    BEGIN
        RAISERROR(N'Track does not exist', 11, 1);
        RETURN
    END

    SELECT @ConfigCarID = cars.ID FROM dbo.Cars cars INNER JOIN #Configs c ON cars.ShortName = c.CarShortName
    WHERE c.ID = @ConfigID
    IF @ConfigCarID IS NULL
    BEGIN
        RAISERROR(N'Car does not exist', 11, 1);
        RETURN
    END

    SELECT @ConfigWeatherID = w.ID FROM dbo.Weathers w INNER JOIN #Configs c ON w.Name = c.WeatherName
    WHERE c.ID = @ConfigID
    IF @ConfigWeatherID IS NULL
    BEGIN
        RAISERROR(N'Weather does not exist', 11, 1);
        RETURN
    END

    SELECT @ConfigTyreID = t.ID FROM dbo.Tyres t INNER JOIN #Configs c ON t.ShortName = c.TyreShortName
    WHERE c.ID = @ConfigID
    IF @ConfigTyreID IS NULL
    BEGIN
        RAISERROR(N'Tyre does not exist', 11, 1);
        RETURN
    END

    SELECT @ConfigSetupID = s.ID FROM dbo.Setups s INNER JOIN #Configs c ON s.Description = c.SetupDescription
    WHERE c.ID = @ConfigID
    IF @ConfigSetupID IS NULL
    BEGIN
        RAISERROR(N'Setup does not exist', 11, 1);
        RETURN
    END

    SELECT @ConfigDescription = Description FROM #Configs WHERE ID = @ConfigID

    EXEC AddConfig 
        @Description = @ConfigDescription,
        @GameID = @ConfigGameID,
        @TrackID = @ConfigTrackID,
        @CarID = @ConfigCarID,
        @WeatherID = @ConfigWeatherID,
        @TyreID = @ConfigTyreID,
        @SetupID = @ConfigSetupID
END