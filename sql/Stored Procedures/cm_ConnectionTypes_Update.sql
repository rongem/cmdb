CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Update]
(
    @ConnectionTypeId bigint,
    @Name nvarchar(128),
    @ReverseName nvarchar(128)
)
AS
    SET NOCOUNT ON;

UPDATE dbo.ConnectionTypes
SET
    Name = @Name,
    ReverseName = @ReverseName,
    UpdatedAt = SYSUTCDATETIME()
WHERE ConnectionTypeId = @ConnectionTypeId;
GO
