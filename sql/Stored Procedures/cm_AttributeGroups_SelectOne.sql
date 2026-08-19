CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectOne]
(
    @AttributeGroupId bigint
)
AS
    SET NOCOUNT ON;

SELECT
    AttributeGroupId,
    Name
FROM dbo.AttributeGroups
WHERE AttributeGroupId = @AttributeGroupId;
GO
