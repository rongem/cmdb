
CREATE PROCEDURE [dbo].[cm_ItemLinks_SelectByItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     LinkId, ItemId, LinkURI, LinkDescription
FROM         cm_ItemLinks
WHERE	ItemId = @ItemId;

