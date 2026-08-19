CREATE PROCEDURE [dbo].[cm_ItemTypes_Update]
(
    @ItemTypeId bigint,
    @Name nvarchar(128),
    @Color nvarchar(32)
)
AS
    SET NOCOUNT ON;

UPDATE dbo.ItemTypes
SET
    Name = @Name,
    Color = @Color,
    UpdatedAt = SYSUTCDATETIME()
WHERE ItemTypeId = @ItemTypeId;
GO
