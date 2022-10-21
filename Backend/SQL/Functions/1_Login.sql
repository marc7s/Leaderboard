CREATE OR ALTER FUNCTION Login(@Username nvarchar(255), @Password nvarchar(255)) 
RETURNS TABLE 
AS
RETURN 
SELECT 
    TOP 1 Username, ID 
FROM Users 
WHERE 
    Username = @Username AND -- Username is equal
    HASHBYTES('SHA2_256', Username) = HASHBYTES('SHA2_256', @Username) AND -- Also check that username is equal with a case sensitive compare by hashing. Both comparisons are made to ensure hash collisions cannot cause the username to incorrectly be deemed correct
    Password = CONVERT(varbinary(500), HASHBYTES('SHA2_512', @Password), 1) -- Hash the supplied password and compare it against the stored password hash
    AND Admin = 1 -- Check that the user is an admin