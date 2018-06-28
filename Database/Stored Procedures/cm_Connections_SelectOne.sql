


CREATE PROCEDURE [dbo].[cm_Connections_SelectOne]
(
	@ConnId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated, ConnDescription
FROM         cm_Connections
WHERE ConnId = @ConnId


