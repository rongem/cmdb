
CREATE PROCEDURE [dbo].[cm_ItemAttributes_SelectByItemAndType]
(
	@ItemId uniqueidentifier,
	@AttributeType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     cm_ItemAttributes.AttributeId, cm_ItemAttributes.ItemId, cm_ItemAttributes.AttributeTypeId, cm_ItemAttributes.AttributeValue, cm_ItemAttributes.AttributeCreated, cm_ItemAttributes.AttributeLastChange, cm_ItemAttributes.AttributeVersion, cm_AttributeTypes.AttributeTypeName
FROM         cm_ItemAttributes INNER JOIN cm_AttributeTypes ON cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId
WHERE ItemId = @ItemId AND cm_ItemAttributes.AttributeTypeId = @AttributeType
ORDER BY AttributeTypeName ASC, AttributeValue ASC

