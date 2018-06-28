


CREATE PROCEDURE [dbo].[cm_Roles_SelectByRole]
(
	@Role int
)
AS
	SET NOCOUNT ON;
SELECT        Token, IsGroup, [Role]
FROM            dbo.cm_Roles
WHERE IsGroup = 1 AND [Role] >= @Role;

