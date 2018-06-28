CREATE TABLE [dbo].[cm_ItemAttributesHistory] (
    [AttributeId]       UNIQUEIDENTIFIER NOT NULL,
    [ItemId]            UNIQUEIDENTIFIER NOT NULL,
    [AttributeTypeId]   UNIQUEIDENTIFIER NOT NULL,
    [AttributeTypeName] NVARCHAR (50)    NOT NULL,
    [AttributeOldValue] NVARCHAR (100)   NOT NULL,
    [AttributeNewValue] NVARCHAR (100)   NOT NULL,
    [AttributeChange]   DATETIME         NOT NULL,
    [ChangedByToken]    NVARCHAR (50)    NOT NULL
);

