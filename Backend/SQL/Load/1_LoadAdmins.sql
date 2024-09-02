EXEC AddUser @Username = N'Marcus';
DECLARE @MarcusPass nvarchar(255) = N'ENTER_YOUR_PASSWORD_HERE';
IF @MarcusPass LIKE N'%PASSWORD_HERE%'
BEGIN
    RAISERROR(N'You must choose a password for your admin!', 11, 1);
    RETURN
END
UPDATE Users SET Admin = 1, Password = HASHBYTES('SHA2_512', @MarcusPass) WHERE Username = N'Marcus';