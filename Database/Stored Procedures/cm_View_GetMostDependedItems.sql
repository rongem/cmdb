
CREATE PROCEDURE [dbo].[cm_View_GetMostDependedItems]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT        dbo.cm_ItemTypes.TypeName, dbo.cm_ConfigurationItems.ItemName, COUNT(dbo.cm_Connections.ConnUpperItem) AS DependingItems
		FROM            dbo.cm_ConfigurationItems INNER JOIN
						 dbo.cm_ItemTypes ON dbo.cm_ConfigurationItems.ItemType = dbo.cm_ItemTypes.TypeId INNER JOIN
						 dbo.cm_Connections ON dbo.cm_ConfigurationItems.ItemId = dbo.cm_Connections.ConnLowerItem
		GROUP BY dbo.cm_ItemTypes.TypeName, dbo.cm_ConfigurationItems.ItemName
		ORDER BY DependingItems DESC
END

