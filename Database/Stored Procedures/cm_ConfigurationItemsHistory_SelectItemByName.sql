

CREATE PROCEDURE [dbo].[cm_ConfigurationItemsHistory_SelectItemByName]
(
	@Name nvarchar(50)
)
AS
	SET NOCOUNT ON;

SELECT @Name = '%' + @Name + '%';
SELECT     ItemId, ItemType, ItemTypeName, ItemOldName, ItemNewName, ItemChange, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName, ChangedByToken
	FROM         cm_ConfigurationItemsHistory
	WHERE ItemOldName LIKE @Name OR ItemNewName LIKE @Name OR ItemTypeName LIKE @Name
	ORDER BY ItemChange DESC

