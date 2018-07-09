
CREATE PROCEDURE [dbo].[cm_Roles_Delete]
(
	@Original_Token nvarchar(50),
	@Original_IsGroup bit,
	@Original_Role int,
	@DeleteResponsibilities bit
)
AS
	SET NOCOUNT OFF;
DELETE FROM [dbo].[cm_Roles] WHERE (([Token] = @Original_Token) AND ([IsGroup] = @Original_IsGroup) AND ([Role] = @Original_Role));
IF (@DeleteResponsibilities = 1)
	DELETE FROM cm_Responsibility WHERE ResponsibleToken = @Original_Token;