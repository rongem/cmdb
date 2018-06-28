
CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectGroupedByGroup] 
(
	@GroupId uniqueidentifier
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings WHERE GroupId = @GroupId)
		ORDER BY AttributeTypeName ASC;
END

