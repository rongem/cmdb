
CREATE PROCEDURE [dbo].[cm_AttributeGroups_Insert]
(
	@GroupId uniqueidentifier,
	@GroupName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
IF (@GroupId IS NULL)
	SELECT @GroupId = NEWID();

INSERT INTO [cm_AttributeGroups] ([GroupId], [GroupName]) VALUES (@GroupId, @GroupName);
	