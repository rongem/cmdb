CREATE PROCEDURE [dbo].[cm_Connections_SelectByRule]
	@RuleId uniqueidentifier
AS
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated, ConnDescription
FROM         cm_Connections
WHERE ConnectionRuleId = @RuleId;

