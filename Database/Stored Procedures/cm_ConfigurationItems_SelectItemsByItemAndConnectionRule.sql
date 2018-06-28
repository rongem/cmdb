
CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectItemsByItemAndConnectionRule]
(
	@ItemId uniqueidentifier,
	@ConnectionRuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;

	DECLARE @UpperItemType uniqueidentifier,
		@LowerItemType uniqueidentifier,
		@ConnType uniqueidentifier,
		@CurrentItemType uniqueidentifier;

	SELECT @UpperItemType = ItemUpperType, @LowerItemType = ItemLowerType, @ConnType = ConnType FROM cm_ConnectionRules WHERE RuleId = @ConnectionRuleId;
	SELECT @CurrentItemType = ItemType FROM cm_ConfigurationItems WHERE ItemId = @ItemId;

	IF @CurrentItemType = @UpperItemType
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE ItemType = @LowerItemType AND ItemId IN (SELECT ConnLowerItem FROM cm_Connections 
				WHERE ConnUpperItem = @ItemId AND (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = RuleId) = @ConnType)
			ORDER BY ItemName ASC;
	ELSE IF @CurrentItemType = @LowerItemType
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE ItemType = @UpperItemType AND ItemId IN (SELECT ConnUpperItem FROM cm_Connections 
				WHERE ConnLowerItem = @ItemId AND (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = RuleId) = @ConnType)
			ORDER BY ItemName ASC;
	ELSE
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE 1 = 0;

