﻿
CREATE PROCEDURE [dbo].[cm_AttributeTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     AttributeTypeId, AttributeTypeName, AttributeGroup, ValidityRule
FROM         cm_AttributeTypes
ORDER BY AttributeTypeName ASC
