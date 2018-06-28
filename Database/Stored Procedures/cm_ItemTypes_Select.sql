
CREATE PROCEDURE [dbo].[cm_ItemTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	ORDER BY TypeName ASC
