

CREATE PROCEDURE [dbo].[cm_Connections_SelectOneByContent]
(
	@UpperItemId uniqueidentifier,
	@LowerItemId uniqueidentifier,
	@ConnType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated, ConnDescription
FROM         cm_Connections
WHERE ConnUpperItem = @UpperItemId AND (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) = @ConnType AND ConnLowerItem = @LowerItemId

