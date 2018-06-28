
CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectAllowedDownwardByItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
	WHERE	(ConnTypeId IN (SELECT ConnType FROM cm_ConnectionRules 
		WHERE ItemUpperType = (SELECT ItemType FROM cm_ConfigurationItems 
			WHERE ItemId = @ItemId)))
ORDER BY ConnTypeName ASC

