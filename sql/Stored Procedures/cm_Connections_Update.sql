CREATE PROCEDURE [dbo].[cm_Connections_Update]
(
    @ConnectionId bigint,
    @ConnectionRuleId bigint,
    @UpperItemId bigint,
    @LowerItemId bigint,
    @Description nvarchar(max) = ''
)
AS
    SET NOCOUNT ON;

UPDATE dbo.Connections
SET
    ConnectionRuleId = @ConnectionRuleId,
    UpperItemId = @UpperItemId,
    LowerItemId = @LowerItemId,
    Description = @Description,
    UpdatedAt = SYSUTCDATETIME()
WHERE ConnectionId = @ConnectionId;
GO
