
CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
ORDER BY ConnTypeName ASC
