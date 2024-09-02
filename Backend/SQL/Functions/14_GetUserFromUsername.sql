CREATE OR ALTER FUNCTION GetUserFromUsername(@Username nvarchar(100)) 
RETURNS TABLE 
AS
RETURN 
SELECT TOP 1 
    u.ID,
	u.Username
FROM Users u
WHERE u.Username = @Username