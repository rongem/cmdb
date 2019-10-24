CREATE PROCEDURE [dbo].[cm_ConnectionsHistory_SelectByItemId]
	@ItemId uniqueidentifier
AS
	SELECT ConnId, ConnType, ConnTypeName, ConnTypeReverseName, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnDescription, ConnChange, ConnReason, ChangedByToken
		FROM cm_ConnectionsHistory
		WHERE ConnUpperItem = @ItemId
			OR ConnLowerItem = @ItemId
		ORDER BY ConnChange
RETURN 0
