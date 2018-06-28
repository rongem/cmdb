


CREATE PROCEDURE [dbo].[cm_Roles_SelectByTokenType]
(
	@IsGroup bit
)
AS
	SET NOCOUNT ON;
SELECT        Token, IsGroup, [Role]
FROM            dbo.cm_Roles
WHERE IsGroup = @IsGroup;

