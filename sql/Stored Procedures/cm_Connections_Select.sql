CREATE PROCEDURE [dbo].[cm_Connections_Select]
AS
    SET NOCOUNT ON;

SELECT
    c.ConnectionId,
    c.ConnectionRuleId,
    cr.ConnectionTypeId,
    ct.Name AS ConnectionTypeName,
    c.UpperItemId,
    ui.Name AS UpperItemName,
    c.LowerItemId,
    li.Name AS LowerItemName,
    c.Description
FROM dbo.Connections c
INNER JOIN dbo.ConnectionRules cr ON cr.ConnectionRuleId = c.ConnectionRuleId
INNER JOIN dbo.ConnectionTypes ct ON ct.ConnectionTypeId = cr.ConnectionTypeId
INNER JOIN dbo.ConfigurationItems ui ON ui.ConfigurationItemId = c.UpperItemId
INNER JOIN dbo.ConfigurationItems li ON li.ConfigurationItemId = c.LowerItemId
ORDER BY ui.Name ASC, li.Name ASC;
GO
