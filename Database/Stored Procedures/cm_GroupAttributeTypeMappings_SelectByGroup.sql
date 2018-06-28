

CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_SelectByGroup]
(
	@GroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, AttributeTypeId
	FROM         [cm_GroupAttributeTypeMappings]
	WHERE GroupId = @GroupId

