
CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Select]
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
ORDER BY ItemName ASC
