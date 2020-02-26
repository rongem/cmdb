
CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectByItemLowerType]
(
	@ItemLowerTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower, ValidationRule
FROM         cm_ConnectionRules
WHERE ItemLowerType = @ItemLowerTypeId
ORDER BY ConnType ASC, ItemUpperType ASC

