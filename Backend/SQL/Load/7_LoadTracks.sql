DROP TABLE IF EXISTS #Tracks;

CREATE TABLE #Tracks(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    FullName nvarchar(255) NOT NULL,
    ShortName nvarchar(255) NOT NULL,
    CountryShortName nvarchar(255) NOT NULL
);

INSERT INTO #Tracks(FullName, ShortName, CountryShortName) VALUES
    (N'Bahrain International Circuit', 'Bahrain', 'Bahrain'),
    (N'Autodromo Internazionale Enzo e Dino Ferrari', 'Imola', 'Italy'),
    (N'Autodromo de Algarve', N'Algarve', N'Portugal'),
    (N'Circuit de Catalunya', N'Catalunya', N'Spain'),
    (N'Circuit de Monaco', N'Monaco', N'Monaco'),
    (N'Baku City Circuit', N'Baku', N'Azerbaijan'),
    (N'Circuit Paul Ricard', N'Paul Ricard', N'France'),
    (N'Red Bull Ring', N'Red Bull Ring', N'Austria'),
    (N'Silverstone Circuit', N'Silverstone', N'Great Britain'),
    (N'Hungaroring', N'Hungaroring', N'Hungary'),
    (N'Circuit de Spa-Francorchamps', N'Spa', N'Belgium'),
    (N'Circuit Zandvoort', N'Zandvoort', N'Netherlands'),
    (N'Autodromo Nazionale di Monza', N'Monza', N'Italy'),
    (N'Sochi Autodrom', N'Sochi', N'Russia'),
    (N'Intercity Istanbul Park', N'Istanbul Park', N'Turkey'),
    (N'Circuit of the Americas', N'COTA', N'USA'),
    (N'Autodromo Hermanos Rodriguez', N'Hermanos Rodriguez', N'Mexico'),
    (N'Autodromo Jose Carlos Pace', N'Interlagos', N'Brazil'),
    (N'Losail International Circuit', N'Losail', N'Qatar'),
    (N'Jeddah Corniche Circuit', N'Jeddah', N'Saudi Arabia'),
    (N'Yas Marina Circuit', N'Yas Marina', N'U.A.E.'),
    (N'Suzuka International Racing Course', N'Suzuka', N'Japan'),
    (N'Albert Park Circuit', N'Albert Park', N'Australia'),
    (N'Shanghai International Circuit', N'Shanghai', N'China'),
    (N'Hockenheimring Baden-Würtemberg', N'Hockenheimring', N'Germany'),
    (N'Marina Bay Street Circuit', N'Marina Bay', N'Singapore'),
    (N'Short Bahrain International Circuit', N'Short Bahrain', N'Bahrain'),
    (N'Short Silverstone Circuit', N'Short Silverstone', N'Great Britain'),
    (N'Short Circuit of the Americas', N'Short COTA', N'USA'),
    (N'Short Suzuka International Racing Course', N'Short Suzuka', N'Japan'),
    (N'Hanoi Street Circuit', N'Hanoi', N'Vietnam'),
    (N'Circuit Gilles Villeneuve', N'Gilles Villeneuve', N'Canada');

DECLARE @TrackID int = 0
DECLARE @TrackFullName nvarchar(255)
DECLARE @TrackShortName nvarchar(255)
DECLARE @TrackCountryID int = 0

WHILE (1 = 1)
BEGIN
    SELECT TOP 1 @TrackID = ID
    FROM #Tracks
    WHERE ID > @TrackID 
    ORDER BY ID

    IF @@ROWCOUNT = 0 BREAK;

    SELECT @TrackCountryID = c.ID FROM dbo.Countries c INNER JOIN #Tracks t ON c.ShortName = t.CountryShortName
    WHERE t.ID = @TrackID
    IF @TrackCountryID IS NULL
    BEGIN
        RAISERROR(N'Country does not exist', 11, 1);
        RETURN
    END

    SELECT 
        @TrackFullName = FullName, 
        @TrackShortName = ShortName 
    FROM #Tracks WHERE ID = @TrackID

    EXEC AddTrack @CountryID = @TrackCountryID, @FullName = @TrackFullName, @ShortName = @TrackShortName
END