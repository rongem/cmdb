
CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectForItemType] 
(
	@ItemTypeId uniqueidentifier
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT dbo.cm_AttributeTypes.AttributeTypeId, dbo.cm_AttributeTypes.AttributeTypeName, dbo.cm_AttributeTypes.AttributeGroup, dbo.cm_AttributeTypes.ValidationRule
		FROM dbo.cm_AttributeTypes INNER JOIN
             dbo.cm_ItemTypeAttributeGroupMappings ON dbo.cm_AttributeTypes.AttributeGroup = dbo.cm_ItemTypeAttributeGroupMappings.GroupId
		WHERE (dbo.cm_ItemTypeAttributeGroupMappings.ItemTypeId = @ItemTypeId)
		ORDER BY AttributeTypeName;
END
