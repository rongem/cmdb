CREATE TABLE [dbo].[cm_Roles] (
    [Token]   NVARCHAR (50) NOT NULL,
    [IsGroup] BIT           CONSTRAINT [DF_cm_Roles_Group] DEFAULT ((0)) NOT NULL,
    [Role]    INT           NOT NULL,
    CONSTRAINT [cm_PK_Roles] PRIMARY KEY CLUSTERED ([Token] ASC)
);


GO
CREATE NONCLUSTERED INDEX [cm_IX_Roles_Role]
    ON [dbo].[cm_Roles]([Role] ASC);


GO
CREATE NONCLUSTERED INDEX [cm_IX_Roles_IsGroup]
    ON [dbo].[cm_Roles]([IsGroup] ASC);


GO
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_Roles_Token]
    ON [dbo].[cm_Roles]([Token] ASC);

