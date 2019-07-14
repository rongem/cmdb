CREATE TABLE [dbo].[cm_AttributeTypes] (
    [AttributeTypeId]   UNIQUEIDENTIFIER CONSTRAINT [DF_AttributeTypes_AttributeTypeId] DEFAULT (newid()) NOT NULL,
    [AttributeTypeName] NVARCHAR (50)    NOT NULL,
    [AttributeGroup] UNIQUEIDENTIFIER NOT NULL, 
    CONSTRAINT [cm_PK_AttributeTypes] PRIMARY KEY CLUSTERED ([AttributeTypeId] ASC), 
    CONSTRAINT [cm_FK_AttributeTypes_AttributeGroups] FOREIGN KEY ([AttributeGroup]) REFERENCES [cm_AttributeGroups]([GroupId])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_AttributeTypes_Name]
    ON [dbo].[cm_AttributeTypes]([AttributeTypeName] ASC);


GO

CREATE INDEX [cm_IX_AttributeTypes_Group] ON [dbo].[cm_AttributeTypes] ([AttributeGroup])
