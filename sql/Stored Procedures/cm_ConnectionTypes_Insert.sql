CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Insert]
(
    @Name nvarchar(128),
    @ReverseName nvarchar(128)
)
AS
    SET NOCOUNT ON;

INSERT INTO dbo.ConnectionTypes (Name, ReverseName)
VALUES (@Name, @ReverseName);

SELECT SCOPE_IDENTITY() AS ConnectionTypeId;
GO
