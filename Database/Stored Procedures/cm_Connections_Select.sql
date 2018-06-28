
CREATE PROCEDURE [dbo].[cm_Connections_Select]
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated, ConnDescription
FROM         cm_Connections
ORDER BY ConnType ASC, ConnUpperItem ASC, ConnLowerItem ASC
