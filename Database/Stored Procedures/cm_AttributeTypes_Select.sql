
CREATE PROCEDURE [dbo].[cm_AttributeTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     AttributeTypeId, AttributeTypeName
FROM         cm_AttributeTypes
ORDER BY AttributeTypeName ASC
