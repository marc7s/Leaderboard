CREATE OR ALTER FUNCTION GetCountries() 
RETURNS TABLE 
AS
RETURN 
SELECT
	ID,
	FullName,
    ShortName,
	AddedAt
FROM Countries