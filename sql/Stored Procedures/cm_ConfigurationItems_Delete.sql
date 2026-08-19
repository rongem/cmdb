CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Delete]
(
    @ConfigurationItemId bigint
)
AS
    SET NOCOUNT ON;

DELETE FROM dbo.ConfigurationItems
WHERE ConfigurationItemId = @ConfigurationItemId;
GO
