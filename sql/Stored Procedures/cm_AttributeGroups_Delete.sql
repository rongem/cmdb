CREATE PROCEDURE [dbo].[cm_AttributeGroups_Delete]
(
    @AttributeGroupId bigint
)
AS
    SET NOCOUNT ON;

DELETE FROM dbo.AttributeGroups
WHERE AttributeGroupId = @AttributeGroupId;
GO
