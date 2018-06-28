
CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectAssignedToItem]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     *
	FROM    cm_AttributeGroups
	WHERE	GroupId IN (SELECT GroupId FROM cm_ItemTypeAttributeGroupMappings WHERE ItemTypeId = @ItemTypeId)
	ORDER BY GroupName ASC;
