CREATE PROCEDURE [dbo].[cm_ItemTypes_Select]
AS
    SET NOCOUNT ON;

SELECT
    ItemTypeId,
    Name,
    Color
FROM dbo.ItemTypes
ORDER BY Name ASC;
GO
