
CREATE PROCEDURE [dbo].[cm_ConfigurationItems_GetCountForItemType]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(ItemId)
FROM         cm_ConfigurationItems
WHERE ItemType = @ItemTypeId

