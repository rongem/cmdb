
CREATE PROCEDURE [dbo].[cm_Responsibility_Insert]
(
	@ItemId uniqueidentifier,
	@ResponsibleToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
INSERT INTO [cm_Responsibility] ([ItemId], [ResponsibleToken]) VALUES (@ItemId, @ResponsibleToken);
	
SELECT ItemId, ResponsibleToken FROM cm_Responsibility WHERE (ItemId = @ItemId) AND (ResponsibleToken = @ResponsibleToken)
