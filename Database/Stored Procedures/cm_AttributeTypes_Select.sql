
CREATE PROCEDURE [dbo].[cm_AttributeTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     AttributeTypeId, AttributeTypeName, AttributeGroup
FROM         cm_AttributeTypes
ORDER BY AttributeTypeName ASC
