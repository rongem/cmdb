
CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, AttributeTypeId
FROM         [cm_GroupAttributeTypeMappings]
ORDER BY GroupId ASC, AttributeTypeId ASC
