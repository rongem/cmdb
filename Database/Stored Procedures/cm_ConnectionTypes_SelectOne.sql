
CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectOne]
(
	@ConnTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
WHERE ConnTypeId = @ConnTypeId;

