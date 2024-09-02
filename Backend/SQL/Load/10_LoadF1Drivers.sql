INSERT INTO AuthenticDrivers(FirstName, LastName, ShortName, Number, ClassID, CountryID)
SELECT drivers.FirstName, drivers.LastName, drivers.ShortName, drivers.Number, AuthenticClasses.ID, Countries.ID
FROM (
    SELECT 'Max' AS FirstName,          'Verstappen' AS LastName,   'VER' AS ShortName,     1 AS Number,    'Netherlands' AS Country UNION
    SELECT 'Lewis' AS FirstName,        'Hamilton' AS LastName,     'HAM' AS ShortName,     44 AS Number,   'Great Britain' AS Country UNION
    SELECT 'Valtteri' AS FirstName,     'Bottas' AS LastName,       'BOT' AS ShortName,     77 AS Number,   'Finland' AS Country UNION
    SELECT 'Sergio' AS FirstName,       'Perez' AS LastName,        'PER' AS ShortName,     11 AS Number,   'Mexico' AS Country UNION
    SELECT 'Carlos' AS FirstName,       'Sainz' AS LastName,        'SAI' AS ShortName,     55 AS Number,   'Spain' AS Country UNION
    SELECT 'Lando' AS FirstName,        'Norris' AS LastName,       'NOR' AS ShortName,     4 AS Number,    'Great Britain' AS Country UNION
    SELECT 'Charles' AS FirstName,      'Leclerc' AS LastName,      'LEC' AS ShortName,     16 AS Number,   'Monaco' AS Country UNION
    SELECT 'Daniel' AS FirstName,       'Ricciardo' AS LastName,    'RIC' AS ShortName,     3 AS Number,    'Australia' AS Country UNION
    SELECT 'Pierre' AS FirstName,       'Gasly' AS LastName,        'GAS' AS ShortName,     10 AS Number,   'France' AS Country UNION
    SELECT 'Fernando' AS FirstName,     'Alonso' AS LastName,       'ALO' AS ShortName,     14 AS Number,   'Spain' AS Country UNION
    SELECT 'Esteban' AS FirstName,      'Ocon' AS LastName,         'OCO' AS ShortName,     31 AS Number,   'France' AS Country UNION
    SELECT 'Sebastian' AS FirstName,    'Vettel' AS LastName,       'VET' AS ShortName,     5 AS Number,    'Germany' AS Country UNION
    SELECT 'Lance' AS FirstName,        'Stroll' AS LastName,       'STR' AS ShortName,     18 AS Number,   'Canada' AS Country UNION
    SELECT 'Yuki' AS FirstName,         'Tsunoda' AS LastName,      'TSU' AS ShortName,     22 AS Number,   'Japan' AS Country UNION
    SELECT 'George' AS FirstName,       'Russell' AS LastName,      'RUS' AS ShortName,     63 AS Number,   'Great Britain' AS Country UNION
    SELECT 'Kimi' AS FirstName,         'Räikkönen' AS LastName,    'RAI' AS ShortName,     7 AS Number,    'Finland' AS Country UNION
    SELECT 'Nicholas' AS FirstName,     'Latifi' AS LastName,       'LAT' AS ShortName,     6 AS Number,    'Canada' AS Country UNION
    SELECT 'Antonio' AS FirstName,      'Giovinazzi' AS LastName,   'GIO' AS ShortName,     99 AS Number,   'Italy' AS Country UNION
    SELECT 'Mick' AS FirstName,         'Schumacher' AS LastName,   'MSC' AS ShortName,     47 AS Number,   'Germany' AS Country UNION
    SELECT 'Robert' AS FirstName,       'Kubica' AS LastName,       'KUB' AS ShortName,     88 AS Number,   'Poland' AS Country UNION
    SELECT 'Nikita' AS FirstName,       'Mazepin' AS LastName,      'MAZ' AS ShortName,     9 AS Number,    'Russia' AS Country
) drivers
LEFT JOIN AuthenticClasses ON AuthenticClasses.Name = 'Formula 1'
LEFT JOIN Countries ON Countries.ShortName = drivers.Country