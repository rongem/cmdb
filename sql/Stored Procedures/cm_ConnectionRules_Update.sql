CREATE PROCEDURE [dbo].[cm_ConnectionRules_Update]
(
    @ConnectionRuleId bigint,
    @ConnectionTypeId bigint,
    @UpperItemTypeId bigint,
    @LowerItemTypeId bigint,
    @MaxConnectionsToUpper int,
    @MaxConnectionsToLower int,
    @ValidationExpression nvarchar(max)
)
AS
    SET NOCOUNT ON;

UPDATE dbo.ConnectionRules
SET
    ConnectionTypeId = @ConnectionTypeId,
    UpperItemTypeId = @UpperItemTypeId,
    LowerItemTypeId = @LowerItemTypeId,
    MaxConnectionsToUpper = @MaxConnectionsToUpper,
    MaxConnectionsToLower = @MaxConnectionsToLower,
    ValidationExpression = @ValidationExpression,
    UpdatedAt = SYSUTCDATETIME()
WHERE ConnectionRuleId = @ConnectionRuleId;
GO
