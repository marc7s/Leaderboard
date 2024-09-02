CREATE OR ALTER FUNCTION GetCountries() 
RETURNS TABLE 
AS
RETURN 
SELECT
	ID,
	FullName,
    ShortName,
	Alpha2Code,
	AddedAt
FROM Countries