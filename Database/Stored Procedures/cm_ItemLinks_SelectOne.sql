

CREATE PROCEDURE [dbo].[cm_ItemLinks_SelectOne]
(
	@LinkId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     LinkId, ItemId, LinkURI, LinkDescription
FROM         cm_ItemLinks
WHERE	LinkId = @LinkId;


