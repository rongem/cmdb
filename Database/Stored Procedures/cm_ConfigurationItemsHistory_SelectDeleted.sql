

CREATE PROCEDURE [dbo].[cm_ConfigurationItemsHistory_SelectDeleted]
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemTypeName, ItemOldName, ItemNewName, ItemChange, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName, ChangedByToken
	FROM         cm_ConfigurationItemsHistory
	WHERE ItemNewName = '<deleted>' OR ItemId NOT IN (SELECT ItemId FROM cm_ConfigurationItems)
	ORDER BY ItemOldName ASC

