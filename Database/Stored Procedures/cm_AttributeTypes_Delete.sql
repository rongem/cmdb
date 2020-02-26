
CREATE PROCEDURE [dbo].[cm_AttributeTypes_Delete]
(
	@Original_AttributeTypeId uniqueidentifier,
	@Original_AttributeTypeName nvarchar(50),
	@Original_AttributeGroup uniqueidentifier,
	@Original_ValidationRule nvarchar(100)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_AttributeTypes] WHERE (([AttributeTypeId] = @Original_AttributeTypeId) 
	AND ([AttributeTypeName] = @Original_AttributeTypeName)
	AND ([AttributeGroup] = @Original_AttributeGroup)
	AND ([ValidationRule] = @Original_ValidationRule))
