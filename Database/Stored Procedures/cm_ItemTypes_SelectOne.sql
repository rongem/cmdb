

CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectOne]
(
	@TypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId = @TypeId

