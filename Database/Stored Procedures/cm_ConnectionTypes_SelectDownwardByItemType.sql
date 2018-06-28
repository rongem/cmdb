

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectDownwardByItemType]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
	WHERE	(ConnTypeId IN (SELECT ConnType FROM cm_ConnectionRules 
		WHERE ItemUpperType = @ItemTypeId))
ORDER BY ConnTypeName ASC


