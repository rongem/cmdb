

CREATE PROCEDURE [dbo].[cm_Roles_GetRoleForToken]
(
	@Token nvarchar(50),
	@IsGroup bit
)
AS
	SET NOCOUNT ON;
SELECT        [Role]
FROM            dbo.cm_Roles
WHERE [Token] = @Token AND IsGroup = @IsGroup;
