1. Create a new SQL Server Login with the username and password specified in the `.env` file
2. Run `2_SetupDataBaseUser.sql` with the correct username specified in the `.env` file
3. Make sure `TCP/IP` is enabled in SQL Server Configuration Manager under `SQL Server Network Configuration` -> `Protocols for SQLEXPRESS`
4. Connect to the database through SSMS, then right click to enter `Properties`. Under `Security`, make sure `Server authentication` is set to `SQL Server and Windows Authentication mode`