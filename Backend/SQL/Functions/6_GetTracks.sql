CREATE OR ALTER FUNCTION GetTracks() 
RETURNS TABLE 
AS
RETURN 
SELECT
	t.ID,
	t.FullName,
	t.ShortName,
	t.CountryID,
	t.AddedAt,
	c.ID AS CountryCountryID,
	c.FullName AS CountryFullName,
	c.ShortName AS CountryShortName
FROM Tracks t
INNER JOIN Countries c ON t.CountryID = c.ID