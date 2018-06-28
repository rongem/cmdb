CREATE TABLE [dbo].[cm_Responsibility] (
    [ItemId]           UNIQUEIDENTIFIER NOT NULL,
    [ResponsibleToken] NVARCHAR (50)    NOT NULL,
    CONSTRAINT [cm_PK_Responsibility] PRIMARY KEY CLUSTERED ([ItemId] ASC, [ResponsibleToken] ASC),
    CONSTRAINT [cm_FK_Responsibility_ConfigurationItems] FOREIGN KEY ([ItemId]) REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_Responsibility_Item]
    ON [dbo].[cm_Responsibility]([ItemId] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_Responsibility_Token]
    ON [dbo].[cm_Responsibility]([ResponsibleToken] ASC);

