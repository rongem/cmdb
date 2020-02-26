


CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectByCorrespondingAttributeValuesForType] 
(
	@AttributeTypeId uniqueidentifier
)
AS
BEGIN
    -- Liefert zu einem Attributtyp diejenigen Attributtypen zurück, für die bei allen Configuration Items der Wert identisch ist zum jeweiligen Wert des angegebenen Attributs
	SET NOCOUNT ON;

	DECLARE @AttributeValue nvarchar(50);
	-- Hilfstabellen
	DECLARE @TempTable TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @TempTable1 TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @TempTable2 TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @FlagFirstRun bit;

	-- Der erste Lauf muss anders behandelt werden
	SELECT @FlagFirstRun = 1;

	-- Cursor für den Attributwert
	DECLARE itemAttributesCursor CURSOR FOR
		SELECT    DISTINCT AttributeValue FROM cm_ItemAttributes WHERE AttributeTypeId = @AttributeTypeId
		FOR READ ONLY;

	OPEN itemAttributesCursor;

	FETCH NEXT FROM itemAttributesCursor
		INTO @AttributeValue

	WHILE @@FETCH_STATUS = 0
	BEGIN
		-- Liest alle Attributtypen aus, die zu dem aktuellen Wert genau einen Wert über alle Attribute besitzen
		INSERT INTO @TempTable1 
			SELECT  AttributeTypeId FROM cm_ItemAttributes 
				WHERE ItemId IN (SELECT ItemId FROM cm_ItemAttributes  WHERE AttributeTypeId = @AttributeTypeId AND AttributeValue = @AttributeValue) 
				AND AttributeValue <> @AttributeValue
				GROUP BY AttributeTypeId
				HAVING COUNT(DISTINCT AttributeValue) = 1;

		-- Mit den Hilfstabellen wird dafür gesorgt, dass Wert für Wert immer nur die Attributtypen übrig bleiben, bei denen für alle Werte die Gleichheit besteht
		IF @FlagFirstRun = 1
			BEGIN
				SELECT @FlagFirstRun = 0;
				INSERT INTO @TempTable
					SELECT AttributeTypeId FROM @TempTable1;
			END
		ELSE
			BEGIN
				-- Lagert zuerst TempTable nach TempTable2 um, um dann TempTable aus der Schnittmenge zwischen TempTable1 und TempTable2 neu zu bilden
				INSERT INTO @TempTable2
					SELECT AttributeTypeId FROM @TempTable;
				DELETE FROM @TempTable;
				INSERT INTO @TempTable
					SELECT AttributeTypeId FROM @TempTable1
						INTERSECT SELECT AttributeTypeId FROM @TempTable2;
				DELETE FROM @TempTable2
			END
		DELETE FROM @TempTable1;
		FETCH NEXT FROM itemAttributesCursor
			INTO @AttributeValue;
	END
		
	CLOSE itemAttributesCursor;
	DEALLOCATE itemAttributesCursor;

	-- Gibt alle übriggebliebenen Attributwerte zurück
	SELECT     AttributeTypeId, AttributeTypeName, AttributeGroup, ValidationRule
		FROM         cm_AttributeTypes
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM @TempTable)
		ORDER BY AttributeTypeName ASC;
END



