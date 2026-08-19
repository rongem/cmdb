CREATE PROCEDURE [dbo].[cm_ConnectionRules_Insert]
(
    @ConnectionTypeId bigint,
    @UpperItemTypeId bigint,
    @LowerItemTypeId bigint,
    @MaxConnectionsToUpper int,
    @MaxConnectionsToLower int,
    @ValidationExpression nvarchar(max)
)
AS
    SET NOCOUNT ON;

INSERT INTO dbo.ConnectionRules (
    ConnectionTypeId,
    UpperItemTypeId,
    LowerItemTypeId,
    MaxConnectionsToUpper,
    MaxConnectionsToLower,
    ValidationExpression
)
VALUES (
    @ConnectionTypeId,
    @UpperItemTypeId,
    @LowerItemTypeId,
    @MaxConnectionsToUpper,
    @MaxConnectionsToLower,
    @ValidationExpression
);

SELECT SCOPE_IDENTITY() AS ConnectionRuleId;
GO
