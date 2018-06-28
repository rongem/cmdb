

CREATE PROCEDURE [dbo].[cm_ConfigurationItemsHistory_SelectItemById]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemTypeName, ItemOldName, ItemNewName, ItemChange, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName, ChangedByToken
	FROM         cm_ConfigurationItemsHistory
	WHERE ItemId = @ItemId
	ORDER BY ItemChange DESC

