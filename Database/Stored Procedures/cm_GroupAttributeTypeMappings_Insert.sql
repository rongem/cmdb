
CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_Insert]
(
	@GroupId uniqueidentifier,
	@AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
IF @GroupId IS NULL
	SELECT @GroupId = NEWID();

INSERT INTO [cm_GroupAttributeTypeMappings] ([GroupId], [AttributeTypeId]) VALUES (@GroupId, @AttributeTypeId);
	
