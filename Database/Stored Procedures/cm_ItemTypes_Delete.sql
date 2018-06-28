
CREATE PROCEDURE [dbo].[cm_ItemTypes_Delete]
(
	@Original_TypeId uniqueidentifier,
	@Original_TypeName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ItemTypes] WHERE (([TypeId] = @Original_TypeId) AND ([TypeName] = @Original_TypeName))
