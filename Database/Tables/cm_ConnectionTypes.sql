CREATE TABLE [dbo].[cm_ConnectionTypes] (
    [ConnTypeId]          UNIQUEIDENTIFIER CONSTRAINT [DF_Table4_TypeId] DEFAULT (newid()) NOT NULL,
    [ConnTypeName]        NVARCHAR (50)    CONSTRAINT [DF_cm_ConnectionTypes_ConnTypeName] DEFAULT ('') NOT NULL,
    [ConnTypeReverseName] NVARCHAR (50)    CONSTRAINT [DF_cm_ConnectionTypes_ConnTypeReverseNamee] DEFAULT ('') NOT NULL,
    CONSTRAINT [cm_PK_ConnectionTypes] PRIMARY KEY CLUSTERED ([ConnTypeId] ASC)
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionTypes_Name]
    ON [dbo].[cm_ConnectionTypes]([ConnTypeName] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionTypes_ReverseName]
    ON [dbo].[cm_ConnectionTypes]([ConnTypeReverseName] ASC);

