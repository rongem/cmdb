
CREATE PROCEDURE [dbo].[cm_ItemLinks_Select]
AS
	SET NOCOUNT ON;
SELECT     LinkId, ItemId, LinkURI, LinkDescription
FROM         cm_ItemLinks

