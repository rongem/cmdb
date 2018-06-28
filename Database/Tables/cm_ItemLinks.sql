CREATE TABLE [dbo].[cm_ItemLinks] (
    [LinkId]          UNIQUEIDENTIFIER CONSTRAINT [DF_ItemLinks_LinkId] DEFAULT (newid()) NOT NULL,
    [ItemId]          UNIQUEIDENTIFIER NOT NULL,
    [LinkURI]         NVARCHAR (500)   NOT NULL,
    [LinkDescription] NVARCHAR (500)   NOT NULL,
    CONSTRAINT [cm_PK_ItemLinks] PRIMARY KEY NONCLUSTERED ([LinkId] ASC),
    CONSTRAINT [cm_FK_ItemLinks_ConfigurationItems] FOREIGN KEY ([ItemId]) REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ItemLinks_Item]
    ON [dbo].[cm_ItemLinks]([ItemId] ASC);

