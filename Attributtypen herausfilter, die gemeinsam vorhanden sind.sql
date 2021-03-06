/****** Skript für SelectTopNRows-Befehl aus SSMS ******/


DECLARE @AttributeTypeId uniqueidentifier;
SELECT @AttributeTypeId = '7A6C30C6-7161-4BE8-934E-DC2DE91BEF26'; --'74B4AF88-B668-414F-937F-3BD537F433B3';

	DECLARE @AttributeValue nvarchar(50);
	DECLARE @TempTable TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @TempTable1 TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @TempTable2 TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @FlagFirstRun bit;
	DECLARE @CountValues int;

	SELECT @FlagFirstRun = 1;


	DECLARE itemAttributesCursor CURSOR FOR
		SELECT    DISTINCT AttributeValue FROM cm_ItemAttributes WHERE AttributeTypeId = @AttributeTypeId
		FOR READ ONLY;

	OPEN itemAttributesCursor;

	FETCH NEXT FROM itemAttributesCursor
		INTO @AttributeValue

	WHILE @@FETCH_STATUS = 0
	BEGIN
		SELECT @CountValues = (SELECT COUNT(*) FROM cm_ItemAttributes WHERE AttributeValue = @AttributeValue);

		--SELECT @AttributeValue, @CountValues;

		INSERT INTO @TempTable1 
			SELECT DISTINCT AttributeTypeId FROM cm_ItemAttributes
				WHERE ItemId IN (SELECT ItemId FROM cm_ItemAttributes  WHERE AttributeTypeId = @AttributeTypeId AND AttributeValue = @AttributeValue)
				AND AttributeTypeId <> @AttributeTypeId
				AND AttributeValue <> @AttributeValue
				GROUP BY AttributeTypeId
				HAVING COUNT(DISTINCT AttributeValue) = 1;

		IF @FlagFirstRun = 1
			BEGIN
				SELECT @FlagFirstRun = 0;
				INSERT INTO @TempTable
					SELECT AttributeTypeId FROM @TempTable1;
			END
		ELSE
			BEGIN
				DELETE FROM @TempTable2
				INSERT INTO @TempTable2
					SELECT AttributeTypeId FROM @TempTable;
				DELETE FROM @TempTable;
				INSERT INTO @TempTable
					SELECT AttributeTypeId FROM @TempTable1
						INTERSECT SELECT AttributeTypeId FROM @TempTable2;
			END
		DELETE FROM @TempTable1;
		FETCH NEXT FROM itemAttributesCursor
			INTO @AttributeValue;
	END
		
	CLOSE itemAttributesCursor;
	DEALLOCATE itemAttributesCursor;

	SELECT     AttributeTypeId, AttributeTypeName
		FROM         cm_AttributeTypes
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM @TempTable)
		ORDER BY AttributeTypeName ASC;
