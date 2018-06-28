
CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Update]
(
	@Original_ItemId uniqueidentifier,
	@ItemType uniqueidentifier,
	@ItemName nvarchar(50),
	@Original_ItemCreated datetime,
	@Original_ItemLastChange datetime,
	@Original_ItemVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
-- History füllen
INSERT INTO [dbo].[cm_ConfigurationItemsHistory] 
	SELECT ItemId, ItemType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType), ItemName, @ItemName, CURRENT_TIMESTAMP, @ChangedByToken 
		FROM [dbo].[cm_ConfigurationItems]
		WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange) AND ([ItemVersion] = @Original_ItemVersion));

UPDATE [cm_ConfigurationItems] SET [ItemType] = @ItemType, [ItemName] = @ItemName, [ItemLastChange] = CURRENT_TIMESTAMP, [ItemVersion] = @Original_ItemVersion + 1
	WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange) AND ([ItemVersion] = @Original_ItemVersion));
	
