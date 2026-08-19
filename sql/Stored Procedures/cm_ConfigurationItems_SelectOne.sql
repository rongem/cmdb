CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectOne]
(
    @ConfigurationItemId bigint
)
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
WHERE ci.ConfigurationItemId = @ConfigurationItemId;
GO
