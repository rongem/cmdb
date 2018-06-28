
CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Insert]
(
	@ConnTypeId uniqueidentifier,
	@ConnTypeName nvarchar(50),
	@ConnTypeReverseName nvarchar(50)
)
AS
	SET NOCOUNT OFF;

IF (@ConnTypeId IS NULL)
	SELECT @ConnTypeId = NEWID();

INSERT INTO [cm_ConnectionTypes] ([ConnTypeId], [ConnTypeName], [ConnTypeReverseName]) VALUES (@ConnTypeId, @ConnTypeName, @ConnTypeReverseName);
	
SELECT ConnTypeId, ConnTypeName, ConnTypeReverseName FROM cm_ConnectionTypes WHERE (ConnTypeId = @ConnTypeId)
