USE Master;
GO

DECLARE @DatabaseName nvarchar(50)
SET @DatabaseName = N'Leaderboard'

DECLARE @SQL varchar(max)

SELECT @SQL = COALESCE(@SQL,'') + 'Kill ' + Convert(varchar, SPId) + ';'
FROM MASTER..SysProcesses
WHERE DBId = DB_ID(@DatabaseName) AND SPId <> @@SPId

--SELECT @SQL 
EXEC(@SQL);
GO

DROP DATABASE Leaderboard