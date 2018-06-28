DECLARE @TempTable TABLE (
	ItemType nvarchar(50),
	ItemName nvarchar(50),
	Lieferschein nvarchar(100),
	Lieferdatum nvarchar(100),
	Bestellschein nvarchar(100)
);

INSERT INTO @TempTable
	SELECT TypeName, ItemName, 
	(SELECT AttributeValue FROM cm_ItemAttributes WHERE AttributeTypeId = '74B4AF88-B668-414F-937F-3BD537F433B3' AND ItemId = cm_ConfigurationItems.ItemId),
	(SELECT AttributeValue FROM cm_ItemAttributes WHERE AttributeTypeId = '397C4EFF-4A82-4885-A477-1923817EFE74' AND ItemId = cm_ConfigurationItems.ItemId),
	(SELECT AttributeValue FROM cm_ItemAttributes WHERE AttributeTypeId = '80ED942E-C84F-49C3-AFFB-D63EE5D61576' AND ItemId = cm_ConfigurationItems.ItemId)
	FROM cm_ConfigurationItems INNER JOIN cm_ItemTypes ON cm_ConfigurationItems.ItemType = cm_ItemTypes.TypeId;

SELECT * FROM @TempTable 

