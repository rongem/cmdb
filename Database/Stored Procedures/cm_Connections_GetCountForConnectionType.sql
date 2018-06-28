
CREATE PROCEDURE [dbo].[cm_Connections_GetCountForConnectionType]
(
	@ConnTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(ConnId)
FROM         cm_Connections
WHERE (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = RuleId) = @ConnTypeId

