
CREATE PROCEDURE [dbo].[cm_ItemAttributes_Insert]
(
	@AttributeId uniqueidentifier,
	@ItemId uniqueidentifier,
	@AttributeTypeId uniqueidentifier,
	@AttributeValue nvarchar(100),
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
	DECLARE @AttributeCreated datetime;
	DECLARE @AttributeLastChange datetime;
	DECLARE @AttributeVersion int;
	IF @AttributeId IS NULL
		SELECT @AttributeId = NEWID();

	SELECT @AttributeCreated = CURRENT_TIMESTAMP, @AttributeLastChange = CURRENT_TIMESTAMP, @AttributeVersion = 0;

-- History füllen
	INSERT INTO cm_ItemAttributesHistory
		VALUES (@AttributeId, @ItemId, @AttributeTypeId, (SELECT [AttributeTypeName] FROM cm_AttributeTypes WHERE AttributeTypeId = @AttributeTypeId), 
			'<created>', @AttributeValue, CURRENT_TIMESTAMP, @ChangedByToken)

	INSERT INTO [cm_ItemAttributes] ([AttributeId], [ItemId], [AttributeTypeId], [AttributeValue], [AttributeCreated], [AttributeLastChange], [AttributeVersion]) VALUES (@AttributeId, @ItemId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion);
	
-- Timestamp des Configuration Item füllen
	UPDATE [cm_ConfigurationItems] SET [ItemLastChange] = CURRENT_TIMESTAMP WHERE [ItemId] = @ItemId;
	
