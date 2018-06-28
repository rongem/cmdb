
CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_Insert]
(
	@GroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
INSERT INTO [cm_ItemTypeAttributeGroupMappings] ([GroupId], [ItemTypeId]) VALUES (@GroupId, @ItemTypeId);
