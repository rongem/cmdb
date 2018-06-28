
CREATE PROCEDURE [dbo].[cm_AttributeGroups_Update]
(
	@GroupName nvarchar(50),
	@Original_GroupId uniqueidentifier,
	@Original_GroupName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_AttributeGroups] SET [GroupName] = @GroupName WHERE (([GroupId] = @Original_GroupId) AND ([GroupName] = @Original_GroupName) );
