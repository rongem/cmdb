
CREATE PROCEDURE [dbo].[cm_AttributeTypes_Insert]
(
	@AttributeTypeId uniqueidentifier,
	@AttributeTypeName nvarchar(50),
	@AttributeGroup uniqueidentifier,
	@ValidationRule nvarchar(200)
)
AS
	SET NOCOUNT OFF;

	IF (@AttributeTypeId IS NULL)
		SELECT @AttributeTypeId = NEWID();

INSERT INTO [cm_AttributeTypes] ([AttributeTypeId], [AttributeTypeName], [AttributeGroup], [ValidationRule])
	VALUES (@AttributeTypeId, @AttributeTypeName, @AttributeGroup, @ValidationRule);
