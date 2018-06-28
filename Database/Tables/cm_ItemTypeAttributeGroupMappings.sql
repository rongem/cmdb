CREATE TABLE [dbo].[cm_ItemTypeAttributeGroupMappings] (
    [GroupId]    UNIQUEIDENTIFIER NOT NULL,
    [ItemTypeId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [cm_PK_ItemTypeAttributeGroupMappings] PRIMARY KEY CLUSTERED ([GroupId] ASC, [ItemTypeId] ASC),
    CONSTRAINT [cm_FK_ItemTypeAttributeGroupMappings_AttributeGroups] FOREIGN KEY ([GroupId]) REFERENCES [dbo].[cm_AttributeGroups] ([GroupId]),
    CONSTRAINT [cm_FK_ItemTypeAttributeGroupMappings_ConfigurationItems] FOREIGN KEY ([ItemTypeId]) REFERENCES [dbo].[cm_ItemTypes] ([TypeId])
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ItemTypeAttributeGroupMappings_Group]
    ON [dbo].[cm_ItemTypeAttributeGroupMappings]([GroupId] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_ItemTypeAttributeGroupMappings_ItemType]
    ON [dbo].[cm_ItemTypeAttributeGroupMappings]([ItemTypeId] ASC);

