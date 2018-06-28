CREATE TABLE [dbo].[cm_GroupAttributeTypeMappings] (
    [GroupId]         UNIQUEIDENTIFIER NOT NULL,
    [AttributeTypeId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [cm_PK_GroupAttributeTypeMappings] PRIMARY KEY CLUSTERED ([AttributeTypeId] ASC),
    CONSTRAINT [cm_FK_ClassAttributes_AttributeClasses] FOREIGN KEY ([GroupId]) REFERENCES [dbo].[cm_AttributeGroups] ([GroupId]),
    CONSTRAINT [cm_FK_ClassAttributes_AttributeTypes] FOREIGN KEY ([AttributeTypeId]) REFERENCES [dbo].[cm_AttributeTypes] ([AttributeTypeId])
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_GroupAttributeTypeMappings_Group]
    ON [dbo].[cm_GroupAttributeTypeMappings]([GroupId] ASC);

