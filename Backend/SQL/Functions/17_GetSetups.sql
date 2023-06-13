CREATE OR ALTER FUNCTION GetSetups() 
RETURNS TABLE 
AS
RETURN 
SELECT
	s.ID,
	st.Description,
	st.Custom,
	s.AddedAt
FROM Setups s
INNER JOIN SetupTypes st ON s.TypeID = st.ID