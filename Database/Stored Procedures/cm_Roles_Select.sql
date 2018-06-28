
CREATE PROCEDURE [dbo].[cm_Roles_Select]
AS
	SET NOCOUNT ON;
SELECT        Token, IsGroup, [Role]
FROM            dbo.cm_Roles
