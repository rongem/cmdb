INSERT INTO cm_ItemLinks
SELECT      NEWID()
			, cm_ConfigurationItems.ItemId
			, 'http://info/Dienststellen/ZSE/ZSEIII/ZSEIIIB4/Dokumentation/Lieferscheine/' + SUBSTRING(cm_ItemAttributes.AttributeValue, 7, 4) + '-' + SUBSTRING(cm_ItemAttributes.AttributeValue, 4, 2) + '_LS-' + cm_ConfigurationItems.ItemName + '.pdf'
			, 'Lieferschein'
FROM            cm_ConfigurationItems INNER JOIN
                         cm_ItemAttributes ON cm_ConfigurationItems.ItemId = cm_ItemAttributes.ItemId INNER JOIN
                         cm_ItemTypes ON cm_ConfigurationItems.ItemType = cm_ItemTypes.TypeId
WHERE        (cm_ItemTypes.TypeName = N'Lieferschein')