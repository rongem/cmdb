CREATE TABLE [dbo].[cm_AttributeTypes] (
    [AttributeTypeId]   UNIQUEIDENTIFIER CONSTRAINT [DF_AttributeTypes_AttributeTypeId] DEFAULT (newid()) NOT NULL,
    [AttributeTypeName] NVARCHAR (50)    NOT NULL,
    CONSTRAINT [cm_PK_AttributeTypes] PRIMARY KEY CLUSTERED ([AttributeTypeId] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_AttributeTypes_Name]
    ON [dbo].[cm_AttributeTypes]([AttributeTypeName] ASC);

