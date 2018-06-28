

CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectOne]
(
	@GroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, GroupName
FROM         cm_AttributeGroups
WHERE GroupId = @GroupId

