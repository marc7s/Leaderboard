CREATE OR ALTER FUNCTION GetUsers() 
RETURNS TABLE 
AS
RETURN 
SELECT
	ID,
	Username,
	AddedAt
FROM Users