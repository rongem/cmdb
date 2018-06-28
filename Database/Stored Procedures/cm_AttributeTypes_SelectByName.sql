


CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectByName] 
(
	@AttributeTypeName nvarchar(50)
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeName = @AttributeTypeName
END



