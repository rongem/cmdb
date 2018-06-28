
CREATE PROCEDURE [dbo].[cm_ItemTypes_Update]
(
	@TypeName nvarchar(50),
	@TypeBackColor nchar(7),
	@Original_TypeId uniqueidentifier,
	@Original_TypeName nvarchar(50),
	@Original_TypeBackColor nchar(7)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ItemTypes] SET [TypeName] = @TypeName, [TypeBackColor] = @TypeBackColor 
	WHERE (([TypeId] = @Original_TypeId) AND ([TypeName] = @Original_TypeName) AND ([TypeBackColor] = @Original_TypeBackColor));
	
