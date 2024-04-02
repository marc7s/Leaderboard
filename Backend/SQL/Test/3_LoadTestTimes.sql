DROP TABLE IF EXISTS #Times;

CREATE TABLE #Times(
    ID int IDENTITY(1, 1) NOT NULL PRIMARY KEY,
    Time nvarchar(12) NOT NULL,
    Username nvarchar(255) NOT NULL,
    ConfigDescription nvarchar(255) NOT NULL,
    Valid bit NOT NULL
);

INSERT INTO #Times(Time, Username, ConfigDescription, Valid) VALUES
    -- 2022-10-09 Suzuka
    (N'00:01:36.700', N'Virre', N'F121 Ferrari TT Suzuka', 1),
    (N'00:01:59.700', N'Käl', N'F121 Ferrari TT Suzuka', 0),
    (N'00:01:39.979', N'Martin', N'F121 Ferrari TT Suzuka', 0),
    (N'00:01:42.220', N'Swedde', N'F121 Ferrari TT Suzuka', 0),
    (N'00:01:32.553', N'Marcus', N'F121 Ferrari TT Suzuka', 1),

    -- 2022-10-09 Monza
    (N'00:01:23.013', N'Virre', N'F121 Ferrari TT Suzuka', 1),
    (N'00:01:16.819', N'Virre', N'F121 Ferrari TT Suzuka', 0),
    (N'00:01:24.862', N'Bao', N'F121 Ferrari TT Suzuka', 1),
    (N'00:01:27.574', N'Käl', N'F121 Ferrari TT Suzuka', 0),
    (N'00:01:39.000', N'Käl', N'F121 Ferrari TT Suzuka', 1),
    (N'00:01:27.253', N'Martin', N'F121 Ferrari TT Suzuka', 1),

    -- 2022-10-28 Red Bull Ring
    (N'00:01:43.999', N'Olle', N'F121 Ferrari TT Red Bull Ring', 0),
    (N'00:01:23.490', N'Olle', N'F121 Ferrari TT Red Bull Ring', 0),
    (N'00:01:24.942', N'Olle', N'F121 Ferrari TT Red Bull Ring', 0),

    -- 2022-10-28 Monza
    (N'00:01:41.348', N'Olle', N'F121 Ferrari TT Suzuka', 0),
    (N'00:01:36.484', N'Olle', N'F121 Ferrari TT Suzuka', 0),
    (N'00:01:25.870', N'Olle', N'F121 Ferrari TT Suzuka', 0),
    (N'00:01:37.828', N'Olle', N'F121 Ferrari TT Suzuka', 1),
    (N'00:01:36.105', N'Olle', N'F121 Ferrari TT Suzuka', 1),

    -- 2022-10-28 Mexico
    (N'00:01:35.128', N'Olle', N'F121 Ferrari TT Hermanos Rodriguez', 0),

    -- 2022-10-29 Mexico
    (N'00:01:18.521', N'Marcus', N'F121 Ferrari TT Custom Hermanos Rodriguez', 1),
    (N'00:01:17.933', N'Marcus', N'F121 Ferrari TT Custom Hermanos Rodriguez', 1),
    (N'00:01:16.881', N'Marcus', N'F121 Ferrari TT Custom Hermanos Rodriguez', 1),

    -- 2022-11-06 Zandvoort
    (N'00:01:12.709', N'Marcus', N'F121 Ferrari TT Custom Zandvoort', 1),

    -- 2022-11-06 Mexico
    (N'00:01:16.748', N'Marcus', N'F121 Mercedes TT Custom Hermanos Rodriguez', 1),
    (N'00:01:16.230', N'Marcus', N'F121 Mercedes TT Custom Hermanos Rodriguez', 1),
    (N'00:01:16.161', N'Marcus', N'F121 Mercedes TT Custom Hermanos Rodriguez', 1),
    (N'00:01:15.756', N'Marcus', N'F121 Mercedes TT Custom Hermanos Rodriguez', 1),

    -- 2022-11-08 Monza
    (N'00:01:22.235', N'Marcus', N'F121 Ferrari TT Custom Monza', 1),
    (N'00:01:22.074', N'Marcus', N'F121 Ferrari TT Custom Monza', 1),
    (N'00:01:22.008', N'Marcus', N'F121 Ferrari TT Custom Monza', 1),
    (N'00:01:21.695', N'Marcus', N'F121 Ferrari TT Custom Monza', 1),
    (N'00:01:21.382', N'Marcus', N'F121 Ferrari TT Custom Monza', 1);

DECLARE @TimeID int = 0
DECLARE @TimeTime nvarchar(12)
DECLARE @TimeUserID int = 0
DECLARE @TimeConfigID int = 0
DECLARE @TimeValid bit = 0

WHILE (1 = 1)
BEGIN
    SELECT TOP 1 @TimeID = ID
    FROM #Times
    WHERE ID > @TimeID 
    ORDER BY ID

    IF @@ROWCOUNT = 0 BREAK;

    SELECT @TimeUserID = u.ID FROM dbo.Users u INNER JOIN #Times t ON u.Username = t.Username
    WHERE t.ID = @TimeID
    IF @TimeUserID IS NULL
    BEGIN
        RAISERROR(N'User does not exist', 11, 1);
        RETURN
    END

    SELECT @TimeConfigID = c.ID FROM dbo.Configs c INNER JOIN #Times t ON c.Description = t.ConfigDescription AND c.Description IS NOT NULL
    WHERE t.ID = @TimeID
    IF @TimeConfigID IS NULL
    BEGIN
        RAISERROR(N'Config does not exist', 11, 1);
        RETURN
    END

    SELECT 
        @TimeTime = Time, 
        @TimeValid = Valid 
    FROM #Times WHERE ID = @TimeID

    EXEC AddTime @Time = @TimeTime, @UserID = @TimeUserID, @ConfigID = @TimeConfigID, @Valid = @TimeValid
END