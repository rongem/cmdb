


CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_GetCountForGroup]
(
	@GroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(*)
FROM         cm_ItemTypeAttributeGroupMappings
WHERE GroupId = @GroupId


