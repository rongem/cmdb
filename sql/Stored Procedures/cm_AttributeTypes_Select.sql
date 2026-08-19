CREATE PROCEDURE [dbo].[cm_AttributeTypes_Select]
AS
    SET NOCOUNT ON;

SELECT
    at.AttributeTypeId,
    at.Name,
    at.AttributeGroupId,
    ag.Name AS AttributeGroupName,
    at.DataType,
    at.ValidationExpression,
    at.MinValue,
    at.MaxValue,
    at.EnumGroupId
FROM dbo.AttributeTypes at
INNER JOIN dbo.AttributeGroups ag ON ag.AttributeGroupId = at.AttributeGroupId
ORDER BY at.Name ASC;
GO
