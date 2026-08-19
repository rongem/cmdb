CREATE PROCEDURE [dbo].[cm_AttributeTypes_Insert]
(
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

INSERT INTO dbo.AttributeTypes (
    Name,
    AttributeGroupId,
    DataType,
    ValidationExpression,
    MinValue,
    MaxValue,
    EnumGroupId
)
VALUES (
    @Name,
    @AttributeGroupId,
    @DataType,
    @ValidationExpression,
    @MinValue,
    @MaxValue,
    @EnumGroupId
);

SELECT SCOPE_IDENTITY() AS AttributeTypeId;
GO
