﻿

CREATE PROCEDURE [dbo].[cm_Connections_SelectForUpperItemAndRule]
(
	@UpperItemId uniqueidentifier,
	@RuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated, ConnDescription
FROM         cm_Connections
WHERE ConnUpperItem = @UpperItemId AND ConnectionRuleId = @RuleId
ORDER BY (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId)) + ' - ' +  
		(SELECT TypeName FROM cm_ItemTypes WHERE TypeId = (SELECT ItemType From cm_ConfigurationItems WHERE ItemId = ConnLowerItem)) + ': ' +
		(SELECT ItemName From cm_ConfigurationItems WHERE ItemId = ConnLowerItem) ASC


