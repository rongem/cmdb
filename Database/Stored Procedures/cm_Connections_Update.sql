CREATE PROCEDURE [dbo].[cm_Connections_Update]
	@Original_ConnId uniqueidentifier,
	@Original_ConnUpperItem uniqueidentifier,
	@Original_ConnLowerItem uniqueidentifier,
	@Original_ConnectionRuleId uniqueidentifier,
	@Original_ConnCreated datetime,
	@Original_ConnDescription nvarchar(100),
	@ConnDescription nvarchar(100),
	@ChangedByToken nvarchar(50)
AS

DECLARE @Original_ConnType uniqueidentifier;

SELECT @Original_ConnType = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = @Original_ConnectionRuleId);

--History füllen
INSERT INTO cm_ConnectionsHistory
	SELECT ConnId, @Original_ConnType, (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE 
		ConnTypeId = @Original_ConnType), ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnDescription, CURRENT_TIMESTAMP, '<deleted>', @ChangedByToken FROM cm_Connections 
			WHERE ([ConnId] = @Original_ConnId) AND ([ConnUpperItem] = @Original_ConnUpperItem) AND ([ConnLowerItem] = @Original_ConnLowerItem) AND ([ConnectionRuleId] = @Original_ConnectionRuleId) 
			AND ([ConnDescription] = @Original_ConnDescription) AND ([ConnCreated] = @Original_ConnCreated);

	UPDATE cm_Connections SET ConnDescription = @ConnDescription, ConnCreated = CURRENT_TIMESTAMP 
		WHERE ([ConnId] = @Original_ConnId) AND ([ConnUpperItem] = @Original_ConnUpperItem) AND ([ConnLowerItem] = @Original_ConnLowerItem) AND ([ConnectionRuleId] = @Original_ConnectionRuleId)
		AND ([ConnDescription] = @Original_ConnDescription) AND ([ConnCreated] = @Original_ConnCreated);
RETURN 0
