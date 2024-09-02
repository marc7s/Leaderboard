CREATE OR ALTER FUNCTION GetTrackFromShortName(@ShortName nvarchar(100)) 
RETURNS TABLE 
AS
RETURN 
SELECT TOP 1 
    t.ID,
	t.FullName,
	t.ShortName,
	t.AddedAt,
	c.ID AS CountryID,
	c.FullName AS CountryFullName,
	c.ShortName AS CountryShortName,
	c.Alpha2Code AS CountryAlpha2Code
FROM Tracks t 
INNER JOIN Countries c ON t.CountryID = c.ID
WHERE t.ShortName = @ShortName