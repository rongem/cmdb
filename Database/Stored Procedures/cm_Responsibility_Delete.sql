
CREATE PROCEDURE [dbo].[cm_Responsibility_Delete]
(
	@Original_ItemId uniqueidentifier,
	@Original_ResponsibleToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_Responsibility] WHERE (([ItemId] = @Original_ItemId) AND ([ResponsibleToken] = @Original_ResponsibleToken))
