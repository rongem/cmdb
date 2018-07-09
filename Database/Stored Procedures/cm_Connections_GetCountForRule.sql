
CREATE PROCEDURE [dbo].[cm_Connections_GetCountForRule]
(
	@RuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;

SELECT COUNT([ConnId])
  FROM [dbo].[cm_Connections]
	WHERE ConnectionRuleId = @RuleId;


