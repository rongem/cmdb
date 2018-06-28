
CREATE PROCEDURE [dbo].[cm_AttributeGroups_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, GroupName
FROM         cm_AttributeGroups
ORDER BY GroupName ASC
