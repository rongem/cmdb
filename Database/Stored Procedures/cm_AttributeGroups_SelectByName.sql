


CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectByName]
(
	@GroupName nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, GroupName
FROM         cm_AttributeGroups
WHERE GroupName = @GroupName


