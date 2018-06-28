

CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_SelectByAttributeType]
(
	@AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, AttributeTypeId
	FROM         [cm_GroupAttributeTypeMappings]
	WHERE AttributeTypeId = @AttributeTypeId

