
CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_Delete]
(
	@Original_GroupId uniqueidentifier,
	@Original_ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ItemTypeAttributeGroupMappings] WHERE (([GroupId] = @Original_GroupId) AND ([ItemTypeId] = @Original_ItemTypeId))
