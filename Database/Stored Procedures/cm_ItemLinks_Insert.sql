
CREATE PROCEDURE [dbo].[cm_ItemLinks_Insert]
(
	@LinkId uniqueidentifier,
	@ItemId uniqueidentifier,
	@LinkURI nvarchar(500),
	@LinkDescription nvarchar(500)
)
AS
	SET NOCOUNT OFF;

IF @LinkId IS NULL
	SELECT @LinkId = NEWID();

INSERT INTO [cm_ItemLinks] ([LinkId], [ItemId], [LinkURI], [LinkDescription]) VALUES (@LinkId, @ItemId, @LinkURI, @LinkDescription);
	
