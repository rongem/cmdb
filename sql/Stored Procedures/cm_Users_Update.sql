CREATE PROCEDURE [dbo].[cm_Users_Update]
(
    @UserId bigint,
    @Name nvarchar(128),
    @Role tinyint,
    @LastVisit datetime2(3),
    @Passphrase nvarchar(max) = NULL
)
AS
    SET NOCOUNT ON;

UPDATE dbo.Users
SET
    Name = @Name,
    Role = @Role,
    LastVisit = @LastVisit,
    Passphrase = @Passphrase,
    UpdatedAt = SYSUTCDATETIME()
WHERE UserId = @UserId;
GO
