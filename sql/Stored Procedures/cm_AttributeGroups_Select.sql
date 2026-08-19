CREATE PROCEDURE [dbo].[cm_AttributeGroups_Select]
AS
    SET NOCOUNT ON;

SELECT
    AttributeGroupId,
    Name
FROM dbo.AttributeGroups
ORDER BY Name ASC;
GO
