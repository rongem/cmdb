CREATE TABLE [dbo].[cm_ConfigurationItems] (
    [ItemId]         UNIQUEIDENTIFIER CONSTRAINT [DF_Table1_ObjId] DEFAULT (newid()) NOT NULL,
    [ItemType]       UNIQUEIDENTIFIER NOT NULL,
    [ItemName]       NVARCHAR (50)    NOT NULL,
    [ItemCreated]    DATETIME         CONSTRAINT [DF_cm_ConfigurationItems_ItemCreated] DEFAULT (getdate()) NOT NULL,
    [ItemLastChange] DATETIME         CONSTRAINT [DF_cm_ConfigurationItems_ItemLastChange] DEFAULT (getdate()) NOT NULL,
    [ItemVersion]    INT              CONSTRAINT [DF_cm_ConfigurationItems_ItemVersion] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [cm_PK_ConfigurationItems] PRIMARY KEY CLUSTERED ([ItemId] ASC),
    CONSTRAINT [cm_FK_ConfigurationItems_ItemTypes] FOREIGN KEY ([ItemType]) REFERENCES [dbo].[cm_ItemTypes] ([TypeId]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_ConfigurationItems_NameAndTypeUnique]
    ON [dbo].[cm_ConfigurationItems]([ItemType] ASC, [ItemName] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ConfigurationItems_ItemType]
    ON [dbo].[cm_ConfigurationItems]([ItemType] ASC);


GO
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_ConfigurationItems_Name]
    ON [dbo].[cm_ConfigurationItems]([ItemName] ASC);

