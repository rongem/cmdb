

CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_SelectByContent]
(
	@GroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, ItemTypeId
FROM         cm_ItemTypeAttributeGroupMappings
WHERE GroupId = @GroupId AND ItemTypeId = @ItemTypeId

