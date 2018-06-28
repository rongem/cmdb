

CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_Update]
(
	@GroupId uniqueidentifier,
	@Original_GroupId uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;

-- Fügt zuerst die Mappings hinzu, die ggf. noch benötigt werden, um die Attribute zu transferieren
INSERT INTO cm_ItemTypeAttributeGroupMappings (ItemTypeId, GroupId)
	SELECT ItemTypeId, @GroupId FROM cm_ItemTypeAttributeGroupMappings
		WHERE GroupId = @Original_GroupId AND ItemTypeId NOT IN 
			(SELECT ItemTypeId FROM cm_ItemTypeAttributeGroupMappings WHERE GroupId = @GroupId);

UPDATE [cm_GroupAttributeTypeMappings] SET [GroupId] = @GroupId WHERE (([GroupId] = @Original_GroupId) AND ([AttributeTypeId] = @Original_AttributeTypeId))

