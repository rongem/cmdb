

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectUpwardByItemType]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
	WHERE	(ConnTypeId IN (SELECT ConnType FROM cm_ConnectionRules 
		WHERE ItemLowerType = @ItemTypeId))
ORDER BY ConnTypeReverseName ASC


