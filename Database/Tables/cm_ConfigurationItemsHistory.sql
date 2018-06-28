CREATE TABLE [dbo].[cm_ConfigurationItemsHistory] (
    [ItemId]         UNIQUEIDENTIFIER NOT NULL,
    [ItemType]       UNIQUEIDENTIFIER NOT NULL,
    [ItemTypeName]   NVARCHAR (50)    NOT NULL,
    [ItemOldName]    NVARCHAR (50)    NOT NULL,
    [ItemNewName]    NVARCHAR (50)    NOT NULL,
    [ItemChange]     DATETIME         NOT NULL,
    [ChangedByToken] NVARCHAR (50)    NOT NULL
);

