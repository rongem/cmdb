
CREATE PROCEDURE [dbo].[cm_ItemTypes_Insert]
(
	@TypeId uniqueidentifier,
	@TypeName nvarchar(50),
	@TypeBackColor nchar(7)
)
AS
	SET NOCOUNT OFF;

IF (@TypeId IS NULL)
	SELECT @TypeId = NEWID();

INSERT INTO [cm_ItemTypes] ([TypeId], [TypeName], [TypeBackColor]) VALUES (@TypeId, @TypeName, @TypeBackColor);
	
