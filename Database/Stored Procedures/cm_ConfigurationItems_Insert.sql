
CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Insert]
(
	@ItemId uniqueidentifier,
	@ItemType uniqueidentifier,
	@ItemName nvarchar(50),
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;

	IF (@ItemId IS NULL)
		SELECT @ItemId = NEWID();

-- History füllen
	INSERT INTO [dbo].[cm_ConfigurationItemsHistory] VALUES (@ItemId, @ItemType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = @ItemType), '<created>', @ItemName, CURRENT_TIMESTAMP, @ChangedByToken)

	INSERT INTO [cm_ConfigurationItems] ([ItemId], [ItemType], [ItemName], [ItemCreated], [ItemLastChange], [ItemVersion]) 
		VALUES (@ItemId, @ItemType, @ItemName, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

	INSERT INTO cm_Responsibility (ItemId, ResponsibleToken)
		VALUES (@ItemId, @ChangedByToken);
	
