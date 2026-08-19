CREATE PROCEDURE [dbo].[cm_AttributeGroups_Insert]
(
    @Name nvarchar(128)
)
AS
    SET NOCOUNT ON;

INSERT INTO dbo.AttributeGroups (Name)
VALUES (@Name);

SELECT SCOPE_IDENTITY() AS AttributeGroupId;
GO
