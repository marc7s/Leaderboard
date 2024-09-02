CREATE OR ALTER PROCEDURE RemoveTime
    @TimeID int
AS
BEGIN
    --ERROR HANDLING

    --CHECK TIME PARAM
    IF @TimeID IS NULL
    BEGIN
        RAISERROR(N'Time ID not supplied', 11, 1);
        RETURN
    END


    --CHECK THAT TIME EXISTS
    DECLARE @TimeID_db int
    SELECT @TimeID_db = ID FROM Times WHERE ID = @TimeID
    IF @TimeID_db IS NULL
    BEGIN
        RAISERROR(N'Time ID does not exist', 11, 1);
        RETURN
    END


    --ALL GOOD, REMOVE TIME
    DELETE FROM Times WHERE ID =  @TimeID;
END
GO