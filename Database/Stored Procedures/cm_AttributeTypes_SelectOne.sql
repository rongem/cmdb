

CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectOne] 
(
	@AttributeTypeId uniqueidentifier
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeId = @AttributeTypeId
END


