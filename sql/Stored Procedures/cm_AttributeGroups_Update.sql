CREATE PROCEDURE [dbo].[cm_AttributeGroups_Update]
(
    @AttributeGroupId bigint,
    @Name nvarchar(128)
)
AS
    SET NOCOUNT ON;

UPDATE dbo.AttributeGroups
SET Name = @Name,
    UpdatedAt = SYSUTCDATETIME()
WHERE AttributeGroupId = @AttributeGroupId;
GO
