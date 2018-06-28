
CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectAllowedUpwardByItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
	WHERE	(ConnTypeId IN (SELECT ConnType FROM cm_ConnectionRules 
		WHERE ItemLowerType = (SELECT ItemType FROM cm_ConfigurationItems 
			WHERE ItemId = @ItemId)))
ORDER BY ConnTypeReverseName ASC

