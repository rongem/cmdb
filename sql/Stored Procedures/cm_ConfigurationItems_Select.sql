CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Select]
AS
    SET NOCOUNT ON;

SELECT
    ci.ConfigurationItemId,
    ci.Name,
    ci.ItemTypeId,
    it.Name AS ItemTypeName,
    ci.TypeName,
    ci.TypeColor,
    ci.CreatedAt,
    ci.UpdatedAt
FROM dbo.ConfigurationItems ci
INNER JOIN dbo.ItemTypes it ON it.ItemTypeId = ci.ItemTypeId
ORDER BY ci.Name ASC;
GO
