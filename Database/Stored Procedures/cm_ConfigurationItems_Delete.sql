
CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Delete]
(
	@Original_ItemId uniqueidentifier,
	@Original_ItemType uniqueidentifier,
	@Original_ItemName nvarchar(50),
	@Original_ItemCreated datetime,
	@Original_ItemLastChange datetime,
	@Original_ItemVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
BEGIN TRY
	BEGIN TRANSACTION;

		-- History füllen
		INSERT INTO [dbo].[cm_ConfigurationItemsHistory] 
			SELECT ItemId, ItemType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType), ItemName, '<deleted>', CURRENT_TIMESTAMP, @ChangedByToken 
				FROM [dbo].[cm_ConfigurationItems]
				WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange) AND ([ItemVersion] = @Original_ItemVersion));

		-- Attribute löschen
		DECLARE @AttributeId uniqueidentifier,
			@AttributeTypeId uniqueidentifier,
			@AttributeValue nvarchar(100),
			@AttributeCreated datetime,
			@AttributeLastChange datetime,
			@AttributeVersion int;

		DECLARE itemAttributesCursor CURSOR FOR
			SELECT     AttributeId, AttributeTypeId, AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion
				FROM       cm_ItemAttributes
				WHERE	   ItemId = @Original_ItemId
			FOR READ ONLY;

		OPEN itemAttributesCursor;

		FETCH NEXT FROM itemAttributesCursor
			INTO @AttributeId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion;

		WHILE @@FETCH_STATUS = 0
		BEGIN
			EXEC cm_ItemAttributes_Delete @AttributeId, @Original_ItemId, @AttributeTypeId, @AttributeValue,
					@AttributeCreated, @AttributeLastChange, @AttributeVersion, @ChangedByToken;
			FETCH NEXT FROM itemAttributesCursor
				INTO @AttributeId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion;
		END
		
		CLOSE itemAttributesCursor;
		DEALLOCATE itemAttributesCursor;

		-- Connections löschen
		DECLARE @ConnId uniqueidentifier, 
			@ConnUpperItem uniqueidentifier, 
			@ConnLowerItem uniqueidentifier, 
			@ConnRuleId uniqueidentifier,
			@ConnCreated datetime,
			@ConnDescription nvarchar(100);

		DECLARE connectionsCursor CURSOR FOR
			SELECT     ConnId, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnDescription, ConnCreated
				FROM       cm_Connections
				WHERE ConnUpperItem = @Original_ItemId OR ConnLowerItem = @Original_ItemId
			FOR READ ONLY;

		OPEN connectionsCursor;

		FETCH NEXT FROM connectionsCursor
			INTO @ConnId, @ConnUpperItem, @ConnLowerItem, @ConnRuleId, @ConnDescription, @ConnCreated;

		WHILE @@FETCH_STATUS = 0
		BEGIN
			EXEC cm_Connections_Delete @ConnId, @ConnUpperItem, @ConnLowerItem, @ConnRuleId, @ConnCreated, @ConnDescription, @ChangedByToken;
			FETCH NEXT FROM connectionsCursor
				INTO @ConnId, @ConnUpperItem, @ConnLowerItem, @ConnRuleId, @ConnDescription, @ConnCreated;
		END

		CLOSE connectionsCursor;
		DEALLOCATE connectionsCursor;

		-- Links löschen
		DELETE FROM [cm_ItemLinks]
			WHERE ItemId = @Original_ItemId;

		-- Verantwortlichkeiten löschen
		DELETE [cm_Responsibility] 
			WHERE ItemId = @Original_ItemId;

		-- ItemLastChange wurde durch das Löschen der Attribute verändert
		SELECT @Original_ItemLastChange = [ItemLastChange] FROM cm_ConfigurationItems WHERE [ItemId] = @Original_ItemId AND [ItemName] = @Original_ItemName AND ItemVersion = @Original_ItemVersion;

		-- Item löschen
		DELETE FROM [cm_ConfigurationItems] 
			WHERE (([ItemId] = @Original_ItemId) AND ([ItemType] = @Original_ItemType) AND ([ItemName] = @Original_ItemName) 
			AND ([ItemCreated] = @Original_ItemCreated) AND ([ItemLastChange] = @Original_ItemLastChange) 
			AND ([ItemVersion] = @Original_ItemVersion));

	COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF (XACT_STATE()) = -1  
    BEGIN  
        ROLLBACK TRANSACTION;  
    END;  

    -- Test whether the transaction is active and valid.  
    IF (XACT_STATE()) = 1  
    BEGIN  
        COMMIT TRANSACTION;     
    END;  
END CATCH