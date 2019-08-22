CREATE PROCEDURE [dbo].[cm_View_Value_Proposals]
	@text nvarchar(max)
AS
BEGIN
	SET NOCOUNT ON;
	SELECT TOP(20) ItemName AS Word FROM cm_ConfigurationItems
		WHERE ItemName LIKE '%' + @text + '%'
	UNION
	SELECT TOP(20) AttributeValue as Word FROM cm_ItemAttributes
		WHERE AttributeValue LIKE '%' + @text + '%'
	ORDER BY Word;
END
