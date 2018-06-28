


CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByConnectionRuleForUpperTypeAndConnType]
(
	@ItemUpperType uniqueidentifier,
	@ConnType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId IN (SELECT ItemLowerType FROM cm_ConnectionRules
		WHERE ItemUpperType = @ItemUpperType AND ConnType = @ConnType)
	ORDER BY TypeName ASC;


