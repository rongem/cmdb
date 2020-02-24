
CREATE PROCEDURE [dbo].[cm_AttributeTypes_Insert]
(
	@AttributeTypeId uniqueidentifier,
	@AttributeTypeName nvarchar(50),
	@AttributeGroup uniqueidentifier,
	@ValidityRule nvarchar(100)
)
AS
	SET NOCOUNT OFF;

	IF (@AttributeTypeId IS NULL)
		SELECT @AttributeTypeId = NEWID();

INSERT INTO [cm_AttributeTypes] ([AttributeTypeId], [AttributeTypeName], [AttributeGroup], [ValidityRule])
	VALUES (@AttributeTypeId, @AttributeTypeName, @AttributeGroup, @ValidityRule);
