CREATE OR ALTER FUNCTION GetGames() 
RETURNS TABLE 
AS
RETURN 
SELECT
	ID,
	Name,
	AddedAt
FROM Games
WHERE Authentic = 0