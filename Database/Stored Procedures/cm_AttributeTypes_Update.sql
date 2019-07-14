﻿
CREATE PROCEDURE [dbo].[cm_AttributeTypes_Update]
(
	@AttributeTypeName nvarchar(50),
	@AttributeGroup uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier,
	@Original_AttributeTypeName nvarchar(50),
	@Original_AttributeGroup uniqueidentifier
)
AS
	SET NOCOUNT OFF;

-- Fügt zuerst die Mappings hinzu, die ggf. noch benötigt werden, um die Attribute zu transferieren
IF (@AttributeGroup <> @Original_AttributeGroup)
	INSERT INTO cm_ItemTypeAttributeGroupMappings (ItemTypeId, GroupId)
		SELECT ItemTypeId, @AttributeGroup FROM cm_ItemTypeAttributeGroupMappings
			WHERE GroupId = @Original_AttributeGroup AND ItemTypeId NOT IN 
				(SELECT ItemTypeId FROM cm_ItemTypeAttributeGroupMappings WHERE GroupId = @AttributeGroup);

UPDATE [cm_AttributeTypes] SET [AttributeTypeName] = @AttributeTypeName, [AttributeGroup] = @AttributeGroup
	WHERE (([AttributeTypeId] = @Original_AttributeTypeId) 
		AND ([AttributeTypeName] = @Original_AttributeTypeName)
		AND ([AttributeGroup] = @Original_AttributeGroup));
	
