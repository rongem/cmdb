
CREATE PROCEDURE [dbo].[cm_ItemAttributes_GetCountForAttributeGroupAndItemType]
(
	@AttributeGroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
	SELECT     COUNT(AttributeId)
		FROM         cm_ItemAttributes
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_AttributeTypes WHERE AttributeGroup = @AttributeGroupId)
		AND ItemId IN (SELECT ItemId FROM cm_ConfigurationItems WHERE ItemType = @ItemTypeId);


