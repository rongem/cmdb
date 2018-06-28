
CREATE PROCEDURE [dbo].[cm_ItemAttributes_GetCountForAttributeGroup]
(
	@AttributeGroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(AttributeId)
FROM         cm_ItemAttributes
WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings WHERE GroupId = @AttributeGroupId);

