CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectOne]
(
    @ItemTypeId bigint
)
AS
    SET NOCOUNT ON;

SELECT
    ItemTypeId,
    Name,
    Color
FROM dbo.ItemTypes
WHERE ItemTypeId = @ItemTypeId;
GO
