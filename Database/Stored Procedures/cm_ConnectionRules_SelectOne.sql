

CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectOne]
(
	@RuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower, ValidationRule
FROM         cm_ConnectionRules
WHERE RuleId = @RuleId


