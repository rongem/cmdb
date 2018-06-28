



CREATE PROCEDURE [dbo].[cm_ItemAttributes_GetCountForAttributeType]
(
	@AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(AttributeId)
	FROM         cm_ItemAttributes
	WHERE AttributeTypeId = @AttributeTypeId;




