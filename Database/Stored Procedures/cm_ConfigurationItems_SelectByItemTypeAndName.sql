

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectByItemTypeAndName]
(
	@ItemType uniqueidentifier,
	@ItemName nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
	FROM         cm_ConfigurationItems
	WHERE ItemType = @ItemType AND ItemName = @ItemName


