CREATE PROCEDURE [dbo].[cm_Users_Insert]
(
    @Name nvarchar(128),
    @Role tinyint,
    @LastVisit datetime2(3),
    @Passphrase nvarchar(max) = NULL
)
AS
    SET NOCOUNT ON;

INSERT INTO dbo.Users (Name, Role, LastVisit, Passphrase)
VALUES (@Name, @Role, @LastVisit, @Passphrase);

SELECT SCOPE_IDENTITY() AS UserId;
GO
