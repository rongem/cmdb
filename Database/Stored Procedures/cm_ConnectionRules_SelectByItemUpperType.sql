
CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectByItemUpperType]
(
	@ItemUpperTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower
FROM         cm_ConnectionRules
WHERE ItemUpperType = @ItemUpperTypeId
ORDER BY ConnType ASC, ItemLowerType ASC

