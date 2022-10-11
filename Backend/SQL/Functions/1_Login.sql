CREATE OR ALTER FUNCTION Login(@Username nvarchar(255), @Password nvarchar(255)) 
RETURNS TABLE 
AS
RETURN 
SELECT TOP 1 Username FROM Users WHERE Username = @Username AND Password = CONVERT(varbinary(500), HASHBYTES('SHA2_512', @Password), 1)