CREATE PROCEDURE [dbo].[cm_ConnectionRules_Filter]
	@ItemUpperType uniqueidentifier,
	@ItemLowerType uniqueidentifier,
	@ConnType uniqueidentifier
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemUpperType) AS ItemUpperTypeName,
		   ItemLowerType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemLowerType) AS ItemLowerTypeName,
		   ConnType, (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = ConnType) AS ConnTypeName, 
		   MaxConnectionsToUpper, MaxConnectionsToLower,
		   (SELECT COUNT(ConnectionRuleId) FROM cm_Connections WHERE ConnectionRuleId = RuleId) AS ExistingConnections
FROM         cm_ConnectionRules
	WHERE ItemUpperType = IIF(@ItemUpperType IS NULL OR @ItemUpperType = '00000000-0000-0000-0000-000000000000', ItemUpperType, @ItemUpperType)
		AND ItemLowerType = IIF(@ItemLowerType IS NULL OR @ItemLowerType = '00000000-0000-0000-0000-000000000000', ItemLowerType, @ItemLowerType)
		AND ConnType = IIF(@ConnType IS NULL OR @ConnType = '00000000-0000-0000-0000-000000000000', ConnType, @ConnType);
-- Filter nur anwenden, wenn sie Daten enthalten
