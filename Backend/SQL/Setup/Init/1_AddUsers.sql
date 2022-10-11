EXEC AddUser @Username = N'Marcus';
DECLARE @MarcusPass nvarchar(255) = N'test';
UPDATE Users SET Admin = 1, Password = HASHBYTES('SHA2_512', @MarcusPass) WHERE Username = N'Marcus';
EXEC AddUser @Username = N'Emma';
EXEC AddUser @Username = N'Virre';
EXEC AddUser @Username = N'Bao';
EXEC AddUser @Username = N'Käl';
EXEC AddUser @Username = N'Martin';
EXEC AddUser @Username = N'Swedde';