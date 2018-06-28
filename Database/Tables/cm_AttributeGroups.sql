CREATE TABLE [dbo].[cm_AttributeGroups] (
    [GroupId]   UNIQUEIDENTIFIER CONSTRAINT [DF_cm_AttributeGroups_GroupId] DEFAULT (newid()) NOT NULL,
    [GroupName] NVARCHAR (50)    NOT NULL,
    CONSTRAINT [cm_PK_AttributeGroups] PRIMARY KEY CLUSTERED ([GroupId] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_AttributeGroups_Name]
    ON [dbo].[cm_AttributeGroups]([GroupName] ASC);

