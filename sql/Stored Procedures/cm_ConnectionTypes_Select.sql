CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Select]
AS
    SET NOCOUNT ON;

SELECT
    ConnectionTypeId,
    Name,
    ReverseName
FROM dbo.ConnectionTypes
ORDER BY Name ASC;
GO
