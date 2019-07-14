
CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectGroupedByGroup] 
(
	@GroupId uniqueidentifier
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeGroup = @GroupId
		ORDER BY AttributeTypeName ASC;
END

