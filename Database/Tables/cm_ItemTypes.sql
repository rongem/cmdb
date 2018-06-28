CREATE TABLE [dbo].[cm_ItemTypes] (
    [TypeId]        UNIQUEIDENTIFIER CONSTRAINT [DF_ItemTypes_TypeId] DEFAULT (newid()) NOT NULL,
    [TypeName]      NVARCHAR (50)    NOT NULL,
    [TypeBackColor] NCHAR (7)        NOT NULL,
    CONSTRAINT [cm_PK_ItemTypes] PRIMARY KEY CLUSTERED ([TypeId] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_ItemTypes_Name]
    ON [dbo].[cm_ItemTypes]([TypeName] ASC);

