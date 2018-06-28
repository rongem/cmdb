
CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Delete]
(
	@Original_ConnTypeId uniqueidentifier,
	@Original_ConnTypeName nvarchar(50),
	@Original_ConnTypeReverseName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ConnectionTypes] WHERE (([ConnTypeId] = @Original_ConnTypeId) AND ([ConnTypeName] = @Original_ConnTypeName) AND ([ConnTypeReverseName] = @Original_ConnTypeReverseName))
