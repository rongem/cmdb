
CREATE PROCEDURE [dbo].[cm_AttributeTypes_Update]
(
	@AttributeTypeName nvarchar(50),
	@Original_AttributeTypeId uniqueidentifier,
	@Original_AttributeTypeName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_AttributeTypes] SET [AttributeTypeName] = @AttributeTypeName WHERE (([AttributeTypeId] = @Original_AttributeTypeId) AND ([AttributeTypeName] = @Original_AttributeTypeName));
	
