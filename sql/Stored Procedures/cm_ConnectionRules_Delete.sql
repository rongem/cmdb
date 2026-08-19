CREATE PROCEDURE [dbo].[cm_ConnectionRules_Delete]
(
    @ConnectionRuleId bigint
)
AS
    SET NOCOUNT ON;

DELETE FROM dbo.ConnectionRules
WHERE ConnectionRuleId = @ConnectionRuleId;
GO
