
CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectUngrouped] 

AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeId NOT IN (SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings)
		ORDER BY AttributeTypeName ASC;
END

