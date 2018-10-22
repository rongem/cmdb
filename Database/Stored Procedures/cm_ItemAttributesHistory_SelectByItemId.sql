CREATE PROCEDURE [dbo].[cm_ItemAttributesHistory_SelectByItemId]
	@ItemId uniqueidentifier
AS
	SELECT AttributeId, AttributeTypeId, AttributeTypeName, ItemId, AttributeOldValue, AttributeNewValue, AttributeChange, ChangedByToken
		FROM cm_ItemAttributesHistory 
		WHERE ItemId = @ItemId
		ORDER BY AttributeChange ASC
RETURN 0
