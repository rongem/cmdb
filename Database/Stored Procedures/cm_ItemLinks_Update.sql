
CREATE PROCEDURE [dbo].[cm_ItemLinks_Update]
(
	@LinkURI nvarchar(500),
	@LinkDescription nvarchar(500),
	@Original_LinkId uniqueidentifier,
	@Original_ItemId uniqueidentifier,
	@Original_LinkURI nvarchar(500),
	@Original_LinkDescription nvarchar(500)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ItemLinks] SET [LinkURI] = @LinkURI, [LinkDescription] = @LinkDescription WHERE (([LinkId] = @Original_LinkId) AND ([ItemId] = @Original_ItemId) AND ([LinkURI] = @Original_LinkURI) AND ([LinkDescription] = @Original_LinkDescription));
	
