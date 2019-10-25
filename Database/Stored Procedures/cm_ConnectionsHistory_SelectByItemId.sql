CREATE PROCEDURE [dbo].[cm_ConnectionsHistory_SelectByItemId]
	@ItemId uniqueidentifier
AS
	SELECT ConnId, ConnType, ConnTypeName, ConnUpperItem, ConnLowerItem,
		(IIF((SELECT COUNT(*) FROM cm_ConfigurationItems WHERE ItemId = ConnLowerItem) = 1,
			(SELECT ItemName FROM cm_ConfigurationItems WHERE ItemId = ConnLowerItem),
			(SELECT TOP(1) ItemOldName FROM cm_ConfigurationItemsHistory WHERE ItemId = ConnLowerItem ORDER BY ItemChange DESC)))
			AS TargetItemName,
		(IIF((SELECT COUNT(*) FROM cm_ConfigurationItems WHERE ItemId = ConnLowerItem) = 1,
			(SELECT TypeName FROM cm_ItemTypes WHERE TypeId = (SELECT ItemType FROM cm_ConfigurationItems WHERE ItemId = ConnLowerItem)),
			(SELECT TOP(1) ItemTypeName FROM cm_ConfigurationItemsHistory WHERE ItemId = ConnLowerItem ORDER BY ItemChange DESC)))
			AS TargetTypeName,
		(SELECT  COUNT(*) FROM cm_ConfigurationItems WHERE ItemId = ConnLowerItem) AS TargetItemIsActive,
		ConnectionRuleId, ConnDescription, ConnChange, ConnReason, ChangedByToken
		FROM cm_ConnectionsHistory
		WHERE ConnUpperItem = @ItemId
	UNION SELECT ConnId, ConnType, ConnTypeReverseName AS ConnTypeName, ConnUpperItem, ConnLowerItem, 
		(IIF((SELECT COUNT(*) FROM cm_ConfigurationItems WHERE ItemId = ConnUpperItem) = 1,
			(SELECT ItemName FROM cm_ConfigurationItems WHERE ItemId = ConnUpperItem),
			(SELECT TOP(1) ItemOldName FROM cm_ConfigurationItemsHistory WHERE ItemId = ConnUpperItem ORDER BY ItemChange DESC)))
			AS TargetItemName,
		(IIF((SELECT COUNT(*) FROM cm_ConfigurationItems WHERE ItemId = ConnUpperItem) = 1,
			(SELECT TypeName FROM cm_ItemTypes WHERE TypeId = (SELECT ItemType FROM cm_ConfigurationItems WHERE ItemId = ConnUpperItem)),
			(SELECT TOP(1) ItemTypeName FROM cm_ConfigurationItemsHistory WHERE ItemId = ConnUpperItem ORDER BY ItemChange DESC)))
			AS TargetTypeName,
		(SELECT  COUNT(*) FROM cm_ConfigurationItems WHERE ItemId = ConnUpperItem) AS TargetItemIsActive,
		ConnectionRuleId, ConnDescription, ConnChange, ConnReason, ChangedByToken
		FROM cm_ConnectionsHistory
		WHERE ConnLowerItem = @ItemId
		ORDER BY ConnChange
RETURN 0
