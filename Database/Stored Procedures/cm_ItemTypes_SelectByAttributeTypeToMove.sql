CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByAttributeTypeToMove]
	@AttributeTypeId uniqueidentifier,
	@TargetAttributGroupId uniqueidentifier
AS
SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId IN (SELECT DISTINCT ItemType FROM cm_ConfigurationItems
		WHERE ItemId IN (SELECT ItemId FROM cm_ItemAttributes
			WHERE AttributeTypeId = @AttributeTypeId))
	AND TypeId NOT IN (SELECT ItemTypeId FROM cm_ItemTypeAttributeGroupMappings
		WHERE GroupId = @TargetAttributGroupId)
	ORDER BY TypeName ASC
