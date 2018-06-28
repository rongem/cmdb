


CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByConnectionRuleForLowerTypeAndConnType]
(
	@ItemLowerType uniqueidentifier,
	@ConnType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId IN (SELECT ItemUpperType FROM cm_ConnectionRules
		WHERE ItemLowerType = @ItemLowerType AND ConnType = @ConnType)
	ORDER BY TypeName ASC;


