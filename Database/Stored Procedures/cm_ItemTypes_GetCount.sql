CREATE PROCEDURE [dbo].[cm_ItemTypes_GetCount]
AS
	SELECT COUNT(TypeId) FROM cm_ItemTypes;
