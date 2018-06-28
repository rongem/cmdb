
CREATE PROCEDURE [dbo].[cm_ItemAttributes_DeleteByAttributeGroupAndItemType]
(
	@AttributeGroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier,
	@ChangedByToken nvarchar(50)
)

AS
	SET NOCOUNT OFF;

	BEGIN TRANSACTION;

		DECLARE @Original_AttributeId uniqueidentifier;
		DECLARE @Original_ItemId uniqueidentifier;
		DECLARE @Original_AttributeTypeId uniqueidentifier;
		DECLARE @Original_AttributeValue nvarchar(100);
		DECLARE @Original_AttributeCreated datetime;
		DECLARE @Original_AttributeLastChange datetime;
		DECLARE @Original_AttributeVersion int;

		DECLARE @AttributeTypeId uniqueidentifier;
		DECLARE @ItemId uniqueidentifier;

		DECLARE groupAttributesCursor CURSOR FOR
			SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings
				WHERE GroupId = @AttributeGroupId
			FOR READ ONLY;

		OPEN groupAttributesCursor;

		FETCH NEXT FROM groupAttributesCursor
			INTO @AttributeTypeId;

		WHILE @@FETCH_STATUS = 0
		BEGIN
		
			DECLARE itemAttributeCursor CURSOR FOR
				SELECT		AttributeId, ItemId, AttributeTypeId, AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion
					FROM	cm_ItemAttributes
					WHERE	AttributeTypeId = @AttributeTypeId 
					AND ItemId IN (SELECT ItemId FROM cm_ConfigurationItems WHERE ItemType = @ItemTypeId);

			OPEN itemAttributeCursor;

			FETCH NEXT FROM itemAttributeCursor
				INTO @Original_AttributeId, @Original_ItemId, @Original_AttributeTypeId, @Original_AttributeValue, @Original_AttributeCreated, 
					@Original_AttributeLastChange, @Original_AttributeVersion;
			
			WHILE @@FETCH_STATUS = 0
			BEGIN
				EXEC cm_ItemAttributes_Delete @Original_AttributeId, @Original_ItemId, @Original_AttributeTypeId, @Original_AttributeValue,
					@Original_AttributeCreated, @Original_AttributeLastChange, @Original_AttributeVersion, @ChangedByToken
				FETCH NEXT FROM itemAttributeCursor
					INTO @Original_AttributeId, @Original_ItemId, @Original_AttributeTypeId, @Original_AttributeValue, @Original_AttributeCreated, 
						@Original_AttributeLastChange, @Original_AttributeVersion;
			END

			CLOSE itemAttributeCursor;
			DEALLOCATE itemAttributeCursor;

			FETCH NEXT FROM groupAttributesCursor
				INTO @AttributeTypeId;

		END 
		CLOSE groupAttributesCursor;

		DEALLOCATE groupAttributesCursor;

	COMMIT TRANSACTION;

