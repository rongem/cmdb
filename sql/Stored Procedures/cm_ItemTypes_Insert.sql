CREATE PROCEDURE [dbo].[cm_ItemTypes_Insert]
(
    @Name nvarchar(128),
    @Color nvarchar(32)
)
AS
    SET NOCOUNT ON;

INSERT INTO dbo.ItemTypes (Name, Color)
VALUES (@Name, @Color);

SELECT SCOPE_IDENTITY() AS ItemTypeId;
GO
