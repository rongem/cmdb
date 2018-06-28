
CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, ItemTypeId
FROM         cm_ItemTypeAttributeGroupMappings
ORDER BY GroupId ASC, ItemTypeId ASC
