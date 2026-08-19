CREATE PROCEDURE [dbo].[cm_ConnectionRules_Select]
AS
    SET NOCOUNT ON;

SELECT
    cr.ConnectionRuleId,
    cr.ConnectionTypeId,
    ct.Name AS ConnectionTypeName,
    cr.UpperItemTypeId,
    uit.Name AS UpperItemTypeName,
    cr.LowerItemTypeId,
    lit.Name AS LowerItemTypeName,
    cr.MaxConnectionsToUpper,
    cr.MaxConnectionsToLower,
    cr.ValidationExpression
FROM dbo.ConnectionRules cr
INNER JOIN dbo.ConnectionTypes ct ON ct.ConnectionTypeId = cr.ConnectionTypeId
INNER JOIN dbo.ItemTypes uit ON uit.ItemTypeId = cr.UpperItemTypeId
INNER JOIN dbo.ItemTypes lit ON lit.ItemTypeId = cr.LowerItemTypeId
ORDER BY uit.Name ASC, lit.Name ASC, ct.Name ASC;
GO
