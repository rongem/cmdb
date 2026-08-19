CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Update]
(
    @ConfigurationItemId bigint,
    @Name nvarchar(255),
    @ItemTypeId bigint,
    @TypeName nvarchar(128),
    @TypeColor nvarchar(32)
)
AS
    SET NOCOUNT ON;

UPDATE dbo.ConfigurationItems
SET
    Name = @Name,
    ItemTypeId = @ItemTypeId,
    TypeName = @TypeName,
    TypeColor = @TypeColor,
    UpdatedAt = SYSUTCDATETIME()
WHERE ConfigurationItemId = @ConfigurationItemId;
GO
