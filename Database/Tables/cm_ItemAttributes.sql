CREATE TABLE [dbo].[cm_ItemAttributes] (
    [AttributeId]         UNIQUEIDENTIFIER NOT NULL,
    [ItemId]              UNIQUEIDENTIFIER CONSTRAINT [DF_Table7_AttributeId] DEFAULT (newid()) NOT NULL,
    [AttributeTypeId]     UNIQUEIDENTIFIER NOT NULL,
    [AttributeValue]      NVARCHAR (100)   NOT NULL,
    [AttributeCreated]    DATETIME         NOT NULL,
    [AttributeLastChange] DATETIME         NOT NULL,
    [AttributeVersion]    INT              NOT NULL,
    CONSTRAINT [cm_PK_ItemAttributes] PRIMARY KEY CLUSTERED ([AttributeId] ASC),
    CONSTRAINT [cm_FK_ItemAttributes_AttributeTypes] FOREIGN KEY ([AttributeTypeId]) REFERENCES [dbo].[cm_AttributeTypes] ([AttributeTypeId]),
    CONSTRAINT [cm_FK_ItemAttributes_ConfigurationItems] FOREIGN KEY ([ItemId]) REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId]),
    CONSTRAINT [cm_IX_ItemAttributes_ItemAndAttributeType] UNIQUE NONCLUSTERED ([AttributeTypeId] ASC, [ItemId] ASC)
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ItemAttributes_Type]
    ON [dbo].[cm_ItemAttributes]([AttributeTypeId] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ItemAttributes_Value]
    ON [dbo].[cm_ItemAttributes]([AttributeValue] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ItemAttributes_Item]
    ON [dbo].[cm_ItemAttributes]([ItemId] ASC);

