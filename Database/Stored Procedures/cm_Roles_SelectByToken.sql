



CREATE PROCEDURE [dbo].[cm_Roles_SelectByToken]
(
	@Token nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT        Token, IsGroup, [Role]
FROM            dbo.cm_Roles
WHERE Token = @Token;


