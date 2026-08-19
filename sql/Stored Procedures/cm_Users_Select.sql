CREATE PROCEDURE [dbo].[cm_Users_Select]
AS
    SET NOCOUNT ON;

SELECT
    UserId,
    Name,
    Role,
    LastVisit,
    Passphrase
FROM dbo.Users
ORDER BY Name ASC;
GO
