CREATE PROCEDURE [dbo].[cm_Users_Delete]
(
    @UserId bigint
)
AS
    SET NOCOUNT ON;

DELETE FROM dbo.Users
WHERE UserId = @UserId;
GO
