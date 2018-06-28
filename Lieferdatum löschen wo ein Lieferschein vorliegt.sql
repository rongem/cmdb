
DECLARE @AttributeId uniqueidentifier,
		@ItemId uniqueidentifier,
		@AttributeTypeId uniqueidentifier,
		@AttributeValue nvarchar(100),
		@AttributeCreated datetime,
		@AttributeLastChange datetime,
		@AttributeVersion int;

DECLARE itemAttributesCursor CURSOR FOR
	SELECT AttributeId, ItemId, AttributeTypeId, AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion 
		FROM cm_ItemAttributes WHERE AttributeTypeId = '397C4EFF-4A82-4885-A477-1923817EFE74' AND ItemId IN (
			SELECT ConnUpperItem FROM cm_Connections WHERE ConnLowerItem IN (
				SELECT ItemId FROM cm_ConfigurationItems WHERE ItemType = 'A47B2AF2-E249-4081-8BD6-7B6665C432C7'))
	FOR READ ONLY;

OPEN itemAttributesCursor;

FETCH NEXT FROM itemAttributesCursor
	INTO @AttributeId, @ItemId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion;

WHILE @@FETCH_STATUS = 0
BEGIN
	EXEC cm_ItemAttributes_Delete @AttributeId, @ItemId, @AttributeTypeId, @AttributeValue,
			@AttributeCreated, @AttributeLastChange, @AttributeVersion, 'MAP\24330335';
	FETCH NEXT FROM itemAttributesCursor
		INTO @AttributeId, @ItemId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion;
END
		
CLOSE itemAttributesCursor;
DEALLOCATE itemAttributesCursor;
