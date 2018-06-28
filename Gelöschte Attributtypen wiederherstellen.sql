USE [RZ-CMDB]
GO

DECLARE @AttributeId uniqueidentifier
DECLARE @ItemId uniqueidentifier
DECLARE @AttributeTypeId uniqueidentifier
DECLARE @AttributeValue nvarchar(100)
DECLARE @ChangedByToken nvarchar(50)

SELECT @AttributeTypeId = '63887B50-E388-4532-AD14-C269DF3117E6';

DECLARE itemAttributesCursor CURSOR FOR
	SELECT [AttributeId]
		  ,[ItemId]
		  ,[AttributeOldValue]
		  ,[ChangedByToken]
		  FROM [dbo].[cm_ItemAttributesHistory]
		  WHERE AttributeTypeId = @AttributeTypeId
		  AND AttributeNewValue = '<deleted>'
		  AND ItemId IN (SELECT ItemId FROM cm_ConfigurationItems)
	FOR READ ONLY;

OPEN itemAttributesCursor;

FETCH NEXT FROM itemAttributesCursor
	INTO @AttributeId, @ItemId, @AttributeValue, @ChangedByToken;

WHILE @@FETCH_STATUS = 0
BEGIN
	EXECUTE [dbo].[cm_ItemAttributes_Insert] 
	   @AttributeId
	  ,@ItemId
	  ,@AttributeTypeId
	  ,@AttributeValue
	  ,@ChangedByToken

	FETCH NEXT FROM itemAttributesCursor
		INTO @AttributeId, @ItemId, @AttributeValue, @ChangedByToken;
END
		
CLOSE itemAttributesCursor;
DEALLOCATE itemAttributesCursor;



