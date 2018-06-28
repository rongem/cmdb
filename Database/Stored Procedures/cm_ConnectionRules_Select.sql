
CREATE PROCEDURE [dbo].[cm_ConnectionRules_Select]
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower
FROM         cm_ConnectionRules
ORDER BY ItemUpperType ASC, ItemLowerType ASC, ConnType ASC
