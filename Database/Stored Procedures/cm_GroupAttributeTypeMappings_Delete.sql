
CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_Delete]
(
	@Original_GroupId uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_GroupAttributeTypeMappings] WHERE (([GroupId] = @Original_GroupId) AND ([AttributeTypeId] = @Original_AttributeTypeId))
