CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Delete]
(
    @ConnectionTypeId bigint
)
AS
    SET NOCOUNT ON;

DELETE FROM dbo.ConnectionTypes
WHERE ConnectionTypeId = @ConnectionTypeId;
GO
