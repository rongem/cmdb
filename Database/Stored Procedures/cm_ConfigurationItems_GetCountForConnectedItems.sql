CREATE PROCEDURE dbo.cm_ConfigurationItems_GetCountForConnectedItems
	@ItemId uniqueidentifier,
	@ConnType uniqueidentifier, 
	@TargetItemTypeId uniqueidentifier
AS	 
BEGIN
	SET NOCOUNT ON;
	SELECT Count (ItemId) FROM cm_ConfigurationItems WHERE ItemType = @TargetItemTypeId AND (ItemId IN (
		SELECT ConnLowerItem FROM cm_Connections WHERE ConnUpperItem = @ItemId AND (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = RuleId) = @ConnType));
END
