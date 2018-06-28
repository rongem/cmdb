

CREATE PROCEDURE [dbo].[cm_Responsibility_SelectForItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ResponsibleToken
FROM         cm_Responsibility
WHERE ItemId = @ItemId

