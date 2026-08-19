CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectOne]
(
    @ConnectionTypeId bigint
)
AS
    SET NOCOUNT ON;

SELECT
    ConnectionTypeId,
    Name,
    ReverseName
FROM dbo.ConnectionTypes
WHERE ConnectionTypeId = @ConnectionTypeId;
GO
