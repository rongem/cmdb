



CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByAllowedAttributeType]
(
	@AttributeType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId IN (SELECT ItemTypeId FROM cm_ItemTypeAttributeGroupMappings
		WHERE GroupId IN (SELECT GroupId FROM cm_GroupAttributeTypeMappings WHERE AttributeTypeId = @AttributeType))
	ORDER BY TypeName ASC;



