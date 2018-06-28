

CREATE PROCEDURE [dbo].[cm_Responsibility_GetResponsibility]
(
	@ItemId uniqueidentifier,
	@ResponsibleToken nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(*)
FROM         cm_Responsibility
WHERE ItemId = @ItemId AND ResponsibleToken = @ResponsibleToken

