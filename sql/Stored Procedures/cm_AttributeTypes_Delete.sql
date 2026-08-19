CREATE PROCEDURE [dbo].[cm_AttributeTypes_Delete]
(
    @AttributeTypeId bigint
)
AS
    SET NOCOUNT ON;

DELETE FROM dbo.AttributeTypes
WHERE AttributeTypeId = @AttributeTypeId;
GO
