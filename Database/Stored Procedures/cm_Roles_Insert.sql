
CREATE PROCEDURE [dbo].[cm_Roles_Insert]
(
	@Token nvarchar(50),
	@IsGroup bit,
	@Role int
)
AS
	SET NOCOUNT OFF;
INSERT INTO [dbo].[cm_Roles] ([Token], [IsGroup], [Role]) VALUES (@Token, @IsGroup, @Role);
	
