CREATE PROCEDURE [dbo].[cm_Connections_Delete]
(
    @ConnectionId bigint
)
AS
    SET NOCOUNT ON;

DELETE FROM dbo.Connections
WHERE ConnectionId = @ConnectionId;
GO
