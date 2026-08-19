CREATE PROCEDURE [dbo].[cm_ItemTypes_Delete]
(
    @ItemTypeId bigint
)
AS
    SET NOCOUNT ON;

DELETE FROM dbo.ItemTypes
WHERE ItemTypeId = @ItemTypeId;
GO
