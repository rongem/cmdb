
CREATE PROCEDURE [dbo].[cm_ConnectionRules_Insert]
(
	@RuleId uniqueidentifier,
	@ItemUpperType uniqueidentifier,
	@ItemLowerType uniqueidentifier,
	@ConnType uniqueidentifier,
	@MaxConnectionsToUpper int,
	@MaxConnectionsToLower int,
	@ValidationRule nvarchar(200)
)
AS
	SET NOCOUNT OFF;
IF @RuleId IS NULL
	SELECT @RuleId = NEWID();

INSERT INTO [cm_ConnectionRules] ([RuleId], [ItemUpperType], [ItemLowerType], [ConnType], [MaxConnectionsToUpper], [MaxConnectionsToLower], [ValidationRule])
	VALUES (@RuleId, @ItemUpperType, @ItemLowerType, @ConnType, @MaxConnectionsToUpper, @MaxConnectionsToLower, @ValidationRule);
