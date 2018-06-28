
CREATE PROCEDURE [dbo].[cm_ItemAttributes_Delete]
(
	@Original_AttributeId uniqueidentifier,
	@Original_ItemId uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier,
	@Original_AttributeValue nvarchar(100),
	@Original_AttributeCreated datetime,
	@Original_AttributeLastChange datetime,
	@Original_AttributeVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
INSERT INTO cm_ItemAttributesHistory
	SELECT AttributeId, ItemId, AttributeTypeId, (SELECT [AttributeTypeName] FROM cm_AttributeTypes WHERE cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId), 
			AttributeValue, '<deleted>', CURRENT_TIMESTAMP, @ChangedByToken FROM cm_ItemAttributes
		WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange) AND ([AttributeVersion] = @Original_AttributeVersion));

-- Configuration Item aktualisieren
UPDATE [cm_ConfigurationItems] SET [ItemLastChange] = CURRENT_TIMESTAMP WHERE [ItemId] = @Original_ItemId;

DELETE FROM [cm_ItemAttributes] WHERE (([AttributeId] = @Original_AttributeId) AND ([ItemId] = @Original_ItemId) AND ([AttributeTypeId] = @Original_AttributeTypeId) 
	AND ([AttributeValue] = @Original_AttributeValue) AND ([AttributeCreated] = @Original_AttributeCreated) AND ([AttributeLastChange] = @Original_AttributeLastChange) 
	AND ([AttributeVersion] = @Original_AttributeVersion))
