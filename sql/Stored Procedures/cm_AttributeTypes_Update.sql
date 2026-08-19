CREATE PROCEDURE [dbo].[cm_AttributeTypes_Update]
(
    @AttributeTypeId bigint,
    @Name nvarchar(128),
    @AttributeGroupId bigint,
    @DataType varchar(20),
    @ValidationExpression nvarchar(max) = NULL,
    @MinValue nvarchar(200) = NULL,
    @MaxValue nvarchar(200) = NULL,
    @EnumGroupId bigint = NULL
)
AS
    SET NOCOUNT ON;

UPDATE dbo.AttributeTypes
SET
    Name = @Name,
    AttributeGroupId = @AttributeGroupId,
    DataType = @DataType,
    ValidationExpression = @ValidationExpression,
    MinValue = @MinValue,
    MaxValue = @MaxValue,
    EnumGroupId = @EnumGroupId,
    UpdatedAt = SYSUTCDATETIME()
WHERE AttributeTypeId = @AttributeTypeId;
GO
