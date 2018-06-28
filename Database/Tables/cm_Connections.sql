CREATE TABLE [dbo].[cm_Connections] (
    [ConnId]           UNIQUEIDENTIFIER CONSTRAINT [DF_Connections_ConnId] DEFAULT (newid()) NOT NULL,
    [ConnUpperItem]    UNIQUEIDENTIFIER NOT NULL,
    [ConnLowerItem]    UNIQUEIDENTIFIER NOT NULL,
    [ConnectionRuleId] UNIQUEIDENTIFIER NOT NULL,
    [ConnCreated]      DATETIME         NOT NULL,
    [ConnDescription]  NVARCHAR(100) NOT NULL DEFAULT '', 
    CONSTRAINT [cm_PK_Connections] PRIMARY KEY CLUSTERED ([ConnId] ASC),
    CONSTRAINT [cm_FK_Connections_ConfigurationItemsLower] FOREIGN KEY ([ConnLowerItem]) REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId]),
    CONSTRAINT [cm_FK_Connections_ConfigurationItemsUpper] FOREIGN KEY ([ConnUpperItem]) REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_Connections_LowerItem]
    ON [dbo].[cm_Connections]([ConnLowerItem] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_Connections_UpperItem]
    ON [dbo].[cm_Connections]([ConnUpperItem] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_Connections_RuleId]
    ON [dbo].[cm_Connections]([ConnectionRuleId] ASC);

