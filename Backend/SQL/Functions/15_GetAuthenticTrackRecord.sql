CREATE OR ALTER FUNCTION GetAuthenticTrackRecord(@TrackID int) 
RETURNS TABLE 
AS
RETURN 
SELECT TOP 1 
    t.ID,
    t.Time,
    t.Millis,
    t.Valid,
    w.Name AS Weather,
    class.ID AS ClassID,
    class.Name AS ClassName,
    d.FirstName AS DriverFirstName,
    d.LastName AS DriverLastName,
    d.ShortName AS DriverShortName,
    d.Number AS DriverNumber,
    s.ID AS SetupID,
    st.Custom AS SetupCustom,
    st.Description AS SetupDescription,
    driverCountries.ID AS DriverCountryID,
    driverCountries.FullName AS DriverCountryFullName,
    driverCountries.ShortName AS DriverCountryShortName,
    g.ID AS GameID,
    g.Name AS GameName,
    tr.ID AS TrackID,
    tr.FullName AS TrackFullName,
    tr.ShortName AS TrackShortName,
    cars.ID AS CarID,
    cars.FullName AS CarFullName,
    cars.ShortName AS CarShortName,
    w.ID AS WeatherID,
    w.Name AS WeatherName,
    tyres.ID AS TyreID,
    tyres.FullName AS TyreFullName,
    tyres.ShortName AS TyreShortName,
    countries.ID AS CountryID,
    countries.FullName AS CountryFullName,
    countries.ShortName AS CountryShortName,
    countries.Alpha2Code AS CountryAlpha2Code
FROM AuthenticTimes t
INNER JOIN Configs c ON t.ConfigID = c.ID
INNER JOIN Setups s ON c.SetupID = s.ID
INNER JOIN SetupTypes st ON s.TypeID = st.ID
INNER JOIN AuthenticClasses class ON t.ClassID = class.ID
INNER JOIN AuthenticDrivers d ON t.DriverID = d.ID
INNER JOIN Cars cars ON c.CarID = cars.ID
INNER JOIN Countries driverCountries ON d.CountryID = driverCountries.ID
INNER JOIN Games g ON c.GameID = g.ID
INNER JOIN Tracks tr ON c.TrackID = tr.ID
INNER JOIN Weathers w ON c.WeatherID = w.ID
INNER JOIN Tyres tyres ON c.TyreID = tyres.ID
INNER JOIN Countries countries ON tr.CountryID = countries.ID
WHERE c.TrackID = @TrackID
ORDER BY Time ASC