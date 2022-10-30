INSERT INTO AuthenticTeams(FullName, ShortName, ClassID, CountryID)
SELECT teams.FullName, teams.ShortName, AuthenticClasses.ID, Countries.ID
FROM (
    SELECT 'Mercedes AMG Petronas' AS FullName,               'Mercedes' AS ShortName,          'Germany' AS Country UNION
    SELECT 'Red Bull Racing Honda' AS FullName,               'Red Bull' AS ShortName,          'Austria' AS Country UNION
    SELECT 'Scuderia Ferrari' AS FullName,                    'Ferrari' AS ShortName,           'Italy' AS Country UNION
    SELECT 'McLaren Mercedes' AS FullName,                    'McLaren' AS ShortName,           'Great Britain' AS Country UNION
    SELECT 'Alpine Renault' AS FullName,                      'Alpine' AS ShortName,            'France' AS Country UNION
    SELECT 'AlphaTauri Honda' AS FullName,                    'AlphaTauri' AS ShortName,        'Italy' AS Country UNION
    SELECT 'Aston Martin Mercedes' AS FullName,               'Aston Martin' AS ShortName,      'Great Britain' AS Country UNION
    SELECT 'Williams Mercedes' AS FullName,                   'Williams' AS ShortName,          'Great Britain' AS Country UNION
    SELECT 'Alfa Romeo Racing Ferrari' AS FullName,           'Alfa Romeo' AS ShortName,        'Switzerland' AS Country UNION
    SELECT 'Haas Ferrari' AS FullName,                        'Haas' AS ShortName,              'USA' AS Country
) teams
LEFT JOIN AuthenticClasses ON AuthenticClasses.Name = 'Formula 1'
LEFT JOIN Countries ON Countries.ShortName = teams.Country