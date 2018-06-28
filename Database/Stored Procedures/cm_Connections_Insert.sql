
CREATE PROCEDURE [dbo].[cm_Connections_Insert]
(
	@ConnId uniqueidentifier,
	@ConnUpperItem uniqueidentifier,
	@ConnLowerItem uniqueidentifier,
	@ConnectionRuleId uniqueidentifier,
	@ConnDescription nvarchar(50),
	@ChangedByToken [nvarchar](50)
)
AS
	SET NOCOUNT OFF;

IF @ConnId IS NULL
	SELECT @ConnId = NEWID();

DECLARE 	@ConnType uniqueidentifier;

SELECT @ConnType = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = @ConnectionRuleId);

-- History füllen
INSERT INTO cm_ConnectionsHistory 
	VALUES (@ConnId, @ConnType, (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = @ConnType), @ConnUpperItem, @ConnLowerItem, @ConnectionRuleId, @ConnDescription, CURRENT_TIMESTAMP, '<created>', @ChangedByToken)

INSERT INTO [cm_Connections] ([ConnId], [ConnUpperItem], [ConnLowerItem], [ConnectionRuleId], [ConnCreated], [ConnDescription]) 
	VALUES (@ConnId, @ConnUpperItem, @ConnLowerItem, @ConnectionRuleId, CURRENT_TIMESTAMP, @ConnDescription);
	
