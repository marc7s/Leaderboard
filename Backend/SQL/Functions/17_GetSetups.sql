CREATE OR ALTER FUNCTION GetSetups() 
RETURNS TABLE 
AS
RETURN 
SELECT
	s.ID,
	s.Description,
	s.Custom,
	s.Manual,
	s.AddedAt
FROM Setups s