CREATE OR ALTER FUNCTION GetNumberOfRecordsFromUsername(@Username nvarchar(255)) 
RETURNS TABLE 
AS
RETURN 
SELECT COUNT(*) AS NumberOfRecords FROM GetRecords()
WHERE Username = @Username