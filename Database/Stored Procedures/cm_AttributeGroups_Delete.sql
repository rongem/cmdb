
CREATE PROCEDURE [dbo].[cm_AttributeGroups_Delete]
(
	@Original_GroupId uniqueidentifier,
	@Original_GroupName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_AttributeGroups] WHERE ([GroupId] = @Original_GroupId) AND ([GroupName] = @Original_GroupName)
