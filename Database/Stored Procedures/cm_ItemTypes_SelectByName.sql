

CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByName]
(
	@TypeName nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeName = @TypeName

