CREATE TABLE [dbo].[cm_ConnectionRules] (
    [RuleId]                UNIQUEIDENTIFIER CONSTRAINT [DF_ConnectionRules_RuleId] DEFAULT (newid()) NOT NULL,
    [ItemUpperType]         UNIQUEIDENTIFIER NOT NULL,
    [ItemLowerType]         UNIQUEIDENTIFIER NOT NULL,
    [ConnType]              UNIQUEIDENTIFIER NOT NULL,
    [MaxConnectionsToUpper] INT              CONSTRAINT [DF_ConnectionRules_Mininum] DEFAULT ((1)) NOT NULL,
    [MaxConnectionsToLower] INT              CONSTRAINT [DF_ConnectionRules_Maximum] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [cm_PK_ConnectionRules] PRIMARY KEY CLUSTERED ([RuleId] ASC),
    CONSTRAINT [cm_ConnectionRules_ConnectionsGreaterZero] CHECK ([MaxConnectionsToUpper]>(0) AND [MaxConnectionsToLower]>(0)),
    CONSTRAINT [cm_FK_ConnectionRules_ConnectionTypes] FOREIGN KEY ([ConnType]) REFERENCES [dbo].[cm_ConnectionTypes] ([ConnTypeId]),
    CONSTRAINT [cm_FK_ConnectionRules_ItemTypesLower] FOREIGN KEY ([ItemLowerType]) REFERENCES [dbo].[cm_ItemTypes] ([TypeId]),
    CONSTRAINT [cm_FK_ConnectionRules_ItemTypesUpper] FOREIGN KEY ([ItemUpperType]) REFERENCES [dbo].[cm_ItemTypes] ([TypeId]),
    CONSTRAINT [cm_IX_ConnectionRules_Unique] UNIQUE NONCLUSTERED ([ConnType] ASC, [ItemLowerType] ASC, [ItemUpperType] ASC)
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_LowerTypeAndConnection]
    ON [dbo].[cm_ConnectionRules]([ItemLowerType] ASC, [ConnType] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_UpperTypeAndConnection]
    ON [dbo].[cm_ConnectionRules]([ItemUpperType] ASC, [ConnType] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_UpperType]
    ON [dbo].[cm_ConnectionRules]([ItemUpperType] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_LowerType]
    ON [dbo].[cm_ConnectionRules]([ItemLowerType] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_ConnType]
    ON [dbo].[cm_ConnectionRules]([ConnType] ASC);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Prüft, ob Connection-Anzahl jeweils größer als 0 ist', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'cm_ConnectionRules', @level2type = N'CONSTRAINT', @level2name = N'cm_ConnectionRules_ConnectionsGreaterZero';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Eindeutigkeit von Upper, Lower und Connectiontype erzwingen', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'cm_ConnectionRules', @level2type = N'CONSTRAINT', @level2name = N'cm_IX_ConnectionRules_Unique';

