CREATE PROCEDURE [dbo].[cm_Connections_Insert]
(
    @ConnectionRuleId bigint,
    @UpperItemId bigint,
    @LowerItemId bigint,
    @Description nvarchar(max) = ''
)
AS
    SET NOCOUNT ON;

INSERT INTO dbo.Connections (ConnectionRuleId, UpperItemId, LowerItemId, Description)
VALUES (@ConnectionRuleId, @UpperItemId, @LowerItemId, @Description);

SELECT SCOPE_IDENTITY() AS ConnectionId;
GO
