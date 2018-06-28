SELECT     (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName, ItemName
	,(SELECT AttributeValue FROM cm_ItemAttributes WHERE cm_ItemAttributes.ItemId = cm_ConfigurationItems.ItemId 
		AND AttributeTypeId = (SELECT AttributeTypeId FROM cm_AttributeTypes WHERE AttributeTypeName = 'Hersteller')) AS Hersteller
	,(SELECT AttributeValue FROM cm_ItemAttributes WHERE cm_ItemAttributes.ItemId = cm_ConfigurationItems.ItemId 
		AND AttributeTypeId = (SELECT AttributeTypeId FROM cm_AttributeTypes WHERE AttributeTypeName = 'Modell')) AS Modell
	,(SELECT AttributeValue FROM cm_ItemAttributes WHERE cm_ItemAttributes.ItemId = cm_ConfigurationItems.ItemId 
		AND AttributeTypeId = (SELECT AttributeTypeId FROM cm_AttributeTypes WHERE AttributeTypeName = 'Seriennummer')) AS Seriennummer
	,(SELECT AttributeValue FROM cm_ItemAttributes WHERE cm_ItemAttributes.ItemId = cm_ConfigurationItems.ItemId 
		AND AttributeTypeId = (SELECT AttributeTypeId FROM cm_AttributeTypes WHERE AttributeTypeName = 'Status')) AS Status
FROM         cm_ConfigurationItems
WHERE ItemId NOT IN (SELECT ItemId FROM cm_ItemAttributes WHERE AttributeTypeId = (SELECT AttributeTypeId FROM cm_AttributeTypes WHERE AttributeTypeName = 'assyst-Id'))
AND ItemType IN (SELECT TypeId FROM cm_ItemTypes WHERE TypeName IN ('Backup-System', 'Blade-Interconnect', 'Server-Hardware', 'Storage-System'))
AND ItemName <> 'defekt-1'
ORDER BY TypeName ASC, ItemName ASC

