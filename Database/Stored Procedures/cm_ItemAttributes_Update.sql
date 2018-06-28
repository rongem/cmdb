
CREATE PROCEDURE [dbo].[cm_ItemAttributes_Update]
(
	@AttributeValue nvarchar(100),
	@Original_AttributeId uniqueidentifier,
	@Original_AttributeLastChange datetime,
	@Original_AttributeVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;

-- History füllen
INSERT INTO cm_ItemAttributesHistory
	SELECT AttributeId, ItemId, AttributeTypeId, (SELECT [AttributeTypeName] FROM cm_AttributeTypes WHERE cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId), 
			AttributeValue, @AttributeValue, CURRENT_TIMESTAMP, @ChangedByToken FROM cm_ItemAttributes
		WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange) AND ([AttributeVersion] = @Original_AttributeVersion));


UPDATE [cm_ItemAttributes] SET [AttributeValue] = @AttributeValue, [AttributeLastChange] = CURRENT_TIMESTAMP, [AttributeVersion] = [AttributeVersion] + 1 
	WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange) AND ([AttributeVersion] = @Original_AttributeVersion));

UPDATE [cm_ConfigurationItems] SET [ItemLastChange] = CURRENT_TIMESTAMP WHERE [ItemId] = (SELECT [ItemId] FROM [cm_ItemAttributes] WHERE [AttributeId] = @Original_AttributeId);
	
