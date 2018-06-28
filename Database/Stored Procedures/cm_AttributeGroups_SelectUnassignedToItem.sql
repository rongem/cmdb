
CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectUnassignedToItem]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     *
	FROM    cm_AttributeGroups
	WHERE	GroupId NOT IN (SELECT GroupId FROM cm_ItemTypeAttributeGroupMappings WHERE ItemTypeId = @ItemTypeId)
	ORDER BY GroupName ASC;

