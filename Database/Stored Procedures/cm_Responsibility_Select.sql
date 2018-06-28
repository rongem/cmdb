
CREATE PROCEDURE [dbo].[cm_Responsibility_Select]
AS
	SET NOCOUNT ON;
SELECT     ItemId, ResponsibleToken
FROM         cm_Responsibility
