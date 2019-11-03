CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectAvailableForRule]
(
	@RuleId uniqueidentifier,
	@ItemsToConnect int
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
WHERE (ItemType = (SELECT ItemLowerType FROM cm_ConnectionRules WHERE RuleId = @RuleId) AND
	ItemId NOT IN (SELECT ConnLowerItem FROM cm_Connections WHERE ConnectionRuleId = @RuleId)) OR
	ItemId IN (SELECT ConnLowerItem FROM cm_Connections WHERE ConnectionRuleId = @RuleId
		AND (SELECT Count(*) FROM cm_Connections WHERE ConnLowerItem = ConnLowerItem AND ConnectionRuleId = @RuleId) <= 
		(SELECT MaxConnectionsToUpper - @ItemsToConnect FROM cm_ConnectionRules WHERE RuleId = @RuleId))
ORDER BY ItemName ASC