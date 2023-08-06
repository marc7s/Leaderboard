CREATE LOGIN >login_here< WITH PASSWORD = 'strong_password_here'
GO

CREATE USER >username_here< FOR LOGIN >login_here<;
GO

GRANT CONNECT, SELECT, EXEC TO >username_here<;
GO