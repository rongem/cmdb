
CREATE PROCEDURE [dbo].[cm_ConnectionRules_Update]
(
	@MaxConnectionsToUpper int,
	@MaxConnectionsToLower int,
	@Original_RuleId uniqueidentifier,
	@Original_ItemUpperType uniqueidentifier,
	@Original_ItemLowerType uniqueidentifier,
	@Original_ConnType uniqueidentifier,
	@Original_MaxConnectionsToUpper int,
	@Original_MaxConnectionsToLower int
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ConnectionRules] SET [MaxConnectionsToUpper] = @MaxConnectionsToUpper, [MaxConnectionsToLower] = @MaxConnectionsToLower WHERE (([RuleId] = @Original_RuleId) AND ([ItemUpperType] = @Original_ItemUpperType) AND ([ItemLowerType] = @Original_ItemLowerType) AND ([ConnType] = @Original_ConnType) AND ([MaxConnectionsToUpper] = @Original_MaxConnectionsToUpper) AND ([MaxConnectionsToLower] = @Original_MaxConnectionsToLower));
	
