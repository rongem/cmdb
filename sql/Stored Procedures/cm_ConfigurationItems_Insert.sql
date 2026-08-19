CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Insert]
(
    @Name nvarchar(255),
    @ItemTypeId bigint,
    @TypeName nvarchar(128),
    @TypeColor nvarchar(32)
)
AS
    SET NOCOUNT ON;

INSERT INTO dbo.ConfigurationItems (Name, ItemTypeId, TypeName, TypeColor)
VALUES (@Name, @ItemTypeId, @TypeName, @TypeColor);

SELECT SCOPE_IDENTITY() AS ConfigurationItemId;
GO
