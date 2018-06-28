
CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectByItemType]
(
	@ItemType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
WHERE ItemType = @ItemType
ORDER BY ItemName ASC

