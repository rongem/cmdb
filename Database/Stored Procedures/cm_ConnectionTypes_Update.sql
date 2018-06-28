
CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Update]
(
	@ConnTypeName nvarchar(50),
	@ConnTypeReverseName nvarchar(50),
	@Original_ConnTypeId uniqueidentifier,
	@Original_ConnTypeName nvarchar(50),
	@Original_ConnTypeReverseName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ConnectionTypes] SET [ConnTypeName] = @ConnTypeName, [ConnTypeReverseName] = @ConnTypeReverseName WHERE (([ConnTypeId] = @Original_ConnTypeId) AND ([ConnTypeName] = @Original_ConnTypeName) AND ([ConnTypeReverseName] = @Original_ConnTypeReverseName));
	
