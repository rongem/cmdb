CREATE PROCEDURE [dbo].[cm_Users_SelectOne]
(
    @UserId bigint
)
AS
    SET NOCOUNT ON;

SELECT
    UserId,
    Name,
    Role,
    LastVisit,
    Passphrase
FROM dbo.Users
WHERE UserId = @UserId;
GO
