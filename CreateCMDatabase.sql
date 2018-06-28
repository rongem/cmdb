USE [master]
GO

/****** Object:  Database [CMDB]    Script Date: 28.02.2014 10:35:06 ******/
CREATE DATABASE [CMDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CMDB', FILENAME = N'C:\TMP\CMDB.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'CMDB_log', FILENAME = N'C:\TMP\CMDB_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO

ALTER DATABASE [CMDB] SET COMPATIBILITY_LEVEL = 110
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CMDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [CMDB] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [CMDB] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [CMDB] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [CMDB] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [CMDB] SET ARITHABORT OFF 
GO

ALTER DATABASE [CMDB] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [CMDB] SET AUTO_CREATE_STATISTICS ON 
GO

ALTER DATABASE [CMDB] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [CMDB] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [CMDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [CMDB] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [CMDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [CMDB] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [CMDB] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [CMDB] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [CMDB] SET  DISABLE_BROKER 
GO

ALTER DATABASE [CMDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [CMDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [CMDB] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [CMDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [CMDB] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [CMDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [CMDB] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [CMDB] SET RECOVERY SIMPLE 
GO

ALTER DATABASE [CMDB] SET  MULTI_USER 
GO

ALTER DATABASE [CMDB] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [CMDB] SET DB_CHAINING OFF 
GO

ALTER DATABASE [CMDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [CMDB] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO

ALTER DATABASE [CMDB] SET  READ_WRITE 
GO

USE [CMDB]
GO

CREATE TABLE [dbo].[cm_AttributeTypes](
	[AttributeTypeId] [uniqueidentifier] NOT NULL,
	[AttributeTypeName] [nvarchar](50) NOT NULL,
 CONSTRAINT [cm_PK_AttributeTypes] PRIMARY KEY CLUSTERED 
(
	[AttributeTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_AttributeTypes] ADD  CONSTRAINT [DF_AttributeTypes_AttributeTypeId]  DEFAULT (newid()) FOR [AttributeTypeId]
GO

CREATE TABLE [dbo].[cm_ConnectionTypes](
	[ConnTypeId] [uniqueidentifier] NOT NULL,
	[ConnTypeName] [nvarchar](50) NOT NULL,
	[ConnTypeReverseName] [nvarchar](50) NOT NULL,
 CONSTRAINT [cm_PK_ConnectionTypes] PRIMARY KEY CLUSTERED 
(
	[ConnTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_ConnectionTypes] ADD  CONSTRAINT [DF_Table4_TypeId]  DEFAULT (newid()) FOR [ConnTypeId]
GO

ALTER TABLE [dbo].[cm_ConnectionTypes] ADD  CONSTRAINT [DF_cm_ConnectionTypes_ConnTypeName]  DEFAULT ('') FOR [ConnTypeName]
GO

ALTER TABLE [dbo].[cm_ConnectionTypes] ADD  CONSTRAINT [DF_cm_ConnectionTypes_ConnTypeReverseNamee]  DEFAULT ('') FOR [ConnTypeReverseName]
GO

CREATE TABLE [dbo].[cm_ItemTypes](
	[TypeId] [uniqueidentifier] NOT NULL,
	[TypeName] [nvarchar](50) NOT NULL,
	[TypeBackColor] [nchar](7) NOT NULL,
 CONSTRAINT [cm_PK_ItemTypes] PRIMARY KEY CLUSTERED 
(
	[TypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_ItemTypes] ADD  CONSTRAINT [DF_ItemTypes_TypeId]  DEFAULT (newid()) FOR [TypeId]
GO

CREATE TABLE [dbo].[cm_AttributeGroups](
	[GroupId] [uniqueidentifier] NOT NULL,
	[GroupName] [nvarchar](50) NOT NULL,
 CONSTRAINT [cm_PK_AttributeClasses] PRIMARY KEY CLUSTERED 
(
	[GroupId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_AttributeGroups] ADD  CONSTRAINT [DF_cm_AttributeGroups_GroupId]  DEFAULT (newid()) FOR [GroupId]
GO

CREATE TABLE [dbo].[cm_ConfigurationItems](
	[ItemId] [uniqueidentifier] NOT NULL,
	[ItemType] [uniqueidentifier] NOT NULL,
	[ItemName] [nvarchar](50) NOT NULL,
	[ItemCreated] [datetime] NOT NULL,
	[ItemLastChange] [datetime] NOT NULL,
	[ItemVersion] [int] NOT NULL,
 CONSTRAINT [cm_PK_ConfigurationItems] PRIMARY KEY CLUSTERED 
(
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_ConfigurationItems] ADD  CONSTRAINT [DF_Table1_ObjId]  DEFAULT (newid()) FOR [ItemId]
GO

ALTER TABLE [dbo].[cm_ConfigurationItems] ADD  CONSTRAINT [DF_cm_ConfigurationItems_ItemCreated]  DEFAULT (getdate()) FOR [ItemCreated]
GO

ALTER TABLE [dbo].[cm_ConfigurationItems] ADD  CONSTRAINT [DF_cm_ConfigurationItems_ItemLastChange]  DEFAULT (getdate()) FOR [ItemLastChange]
GO

ALTER TABLE [dbo].[cm_ConfigurationItems] ADD  CONSTRAINT [DF_cm_ConfigurationItems_ItemVersion]  DEFAULT ((0)) FOR [ItemVersion]
GO

ALTER TABLE [dbo].[cm_ConfigurationItems]  WITH CHECK ADD  CONSTRAINT [cm_FK_ConfigurationItems_ItemTypes] FOREIGN KEY([ItemType])
REFERENCES [dbo].[cm_ItemTypes] ([TypeId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[cm_ConfigurationItems] CHECK CONSTRAINT [cm_FK_ConfigurationItems_ItemTypes]
GO

CREATE TABLE [dbo].[cm_ConfigurationItemsHistory](
	[ItemId] [uniqueidentifier] NOT NULL,
	[ItemType] [uniqueidentifier] NOT NULL,
	[ItemTypeName] [nvarchar](50) NOT NULL,
	[ItemName] [nvarchar](50) NOT NULL,
	[ItemCreated] [datetime] NOT NULL,
	[ItemLastChange] [datetime] NOT NULL,
	[ItemVersion] [int] NOT NULL,
	[ChangedByToken] [nvarchar](50) NOT NULL
) ON [PRIMARY]

GO

CREATE TABLE [dbo].[cm_ConnectionRules](
	[RuleId] [uniqueidentifier] NOT NULL,
	[ItemUpperType] [uniqueidentifier] NOT NULL,
	[ItemLowerType] [uniqueidentifier] NOT NULL,
	[ConnType] [uniqueidentifier] NOT NULL,
	[MinimumConnections] [int] NOT NULL,
	[MaximumConnections] [int] NOT NULL,
 CONSTRAINT [cm_PK_ConnectionRules] PRIMARY KEY CLUSTERED 
(
	[RuleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [cm_IX_ConnectionRules_Unique] UNIQUE NONCLUSTERED 
(
	[ConnType] ASC,
	[ItemLowerType] ASC,
	[ItemUpperType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_ConnectionRules] ADD  CONSTRAINT [DF_ConnectionRules_RuleId]  DEFAULT (newid()) FOR [RuleId]
GO

ALTER TABLE [dbo].[cm_ConnectionRules] ADD  CONSTRAINT [DF_ConnectionRules_Mininum]  DEFAULT ((1)) FOR [MinimumConnections]
GO

ALTER TABLE [dbo].[cm_ConnectionRules] ADD  CONSTRAINT [DF_ConnectionRules_Maximum]  DEFAULT ((1)) FOR [MaximumConnections]
GO

ALTER TABLE [dbo].[cm_ConnectionRules]  WITH CHECK ADD  CONSTRAINT [cm_FK_ConnectionRules_ConnectionTypes] FOREIGN KEY([ConnType])
REFERENCES [dbo].[cm_ConnectionTypes] ([ConnTypeId])
GO

ALTER TABLE [dbo].[cm_ConnectionRules] CHECK CONSTRAINT [cm_FK_ConnectionRules_ConnectionTypes]
GO

ALTER TABLE [dbo].[cm_ConnectionRules]  WITH CHECK ADD  CONSTRAINT [cm_FK_ConnectionRules_ItemTypesLower] FOREIGN KEY([ItemLowerType])
REFERENCES [dbo].[cm_ItemTypes] ([TypeId])
GO

ALTER TABLE [dbo].[cm_ConnectionRules] CHECK CONSTRAINT [cm_FK_ConnectionRules_ItemTypesLower]
GO

ALTER TABLE [dbo].[cm_ConnectionRules]  WITH CHECK ADD  CONSTRAINT [cm_FK_ConnectionRules_ItemTypesUpper] FOREIGN KEY([ItemUpperType])
REFERENCES [dbo].[cm_ItemTypes] ([TypeId])
GO

ALTER TABLE [dbo].[cm_ConnectionRules] CHECK CONSTRAINT [cm_FK_ConnectionRules_ItemTypesUpper]
GO

ALTER TABLE [dbo].[cm_ConnectionRules]  WITH CHECK ADD  CONSTRAINT [cm_ConnectionRules_MinimumGreaterMaximum] CHECK  (([MinimumConnections]<=[MaximumConnections]))
GO

ALTER TABLE [dbo].[cm_ConnectionRules] CHECK CONSTRAINT [cm_ConnectionRules_MinimumGreaterMaximum]
GO

ALTER TABLE [dbo].[cm_ConnectionRules]  WITH CHECK ADD  CONSTRAINT [cm_ConnectionRules_MinimumGreaterZero] CHECK  (([MinimumConnections]>=(0)))
GO

ALTER TABLE [dbo].[cm_ConnectionRules] CHECK CONSTRAINT [cm_ConnectionRules_MinimumGreaterZero]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Eindeutigkeit von Upper, Lower und Connectiontype erzwingen' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'cm_ConnectionRules', @level2type=N'CONSTRAINT',@level2name=N'cm_IX_ConnectionRules_Unique'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Prüft, ob Minimum nicht größer als Maximum ist' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'cm_ConnectionRules', @level2type=N'CONSTRAINT',@level2name=N'cm_ConnectionRules_MinimumGreaterMaximum'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Prüft, ob Minimum größer als 0 ist' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'cm_ConnectionRules', @level2type=N'CONSTRAINT',@level2name=N'cm_ConnectionRules_MinimumGreaterZero'
GO

CREATE TABLE [dbo].[cm_Connections](
	[ConnId] [uniqueidentifier] NOT NULL,
	[ConnType] [uniqueidentifier] NOT NULL,
	[ConnUpperItem] [uniqueidentifier] NOT NULL,
	[ConnLowerItem] [uniqueidentifier] NOT NULL,
	[ConnCreated] [datetime] NOT NULL,
	[ConnLastChange] [datetime] NOT NULL,
	[ConnVersion] [int] NOT NULL,
 CONSTRAINT [cm_PK_Connections] PRIMARY KEY CLUSTERED 
(
	[ConnId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_Connections] ADD  CONSTRAINT [DF_Connections_ConnId]  DEFAULT (newid()) FOR [ConnId]
GO

ALTER TABLE [dbo].[cm_Connections]  WITH CHECK ADD  CONSTRAINT [cm_FK_Connections_ConfigurationItemsLower] FOREIGN KEY([ConnLowerItem])
REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
GO

ALTER TABLE [dbo].[cm_Connections] CHECK CONSTRAINT [cm_FK_Connections_ConfigurationItemsLower]
GO

ALTER TABLE [dbo].[cm_Connections]  WITH CHECK ADD  CONSTRAINT [cm_FK_Connections_ConfigurationItemsUpper] FOREIGN KEY([ConnUpperItem])
REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
GO

ALTER TABLE [dbo].[cm_Connections] CHECK CONSTRAINT [cm_FK_Connections_ConfigurationItemsUpper]
GO

ALTER TABLE [dbo].[cm_Connections]  WITH CHECK ADD  CONSTRAINT [cm_FK_Connections_ConnectionTypes] FOREIGN KEY([ConnType])
REFERENCES [dbo].[cm_ConnectionTypes] ([ConnTypeId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[cm_Connections] CHECK CONSTRAINT [cm_FK_Connections_ConnectionTypes]
GO

CREATE TABLE [dbo].[cm_ConnectionsHistory](
	[ConnId] [uniqueidentifier] NOT NULL,
	[ConnType] [uniqueidentifier] NOT NULL,
	[ConnTypeName] [nvarchar](50) NOT NULL,
	[ConnUpperItem] [uniqueidentifier] NOT NULL,
	[ConnLowerItem] [uniqueidentifier] NOT NULL,
	[ConnCreated] [datetime] NOT NULL,
	[ConnLastChange] [datetime] NOT NULL,
	[ConnVersion] [int] NOT NULL,
	[ChangedByToken] [nvarchar](50) NOT NULL
) ON [PRIMARY]

GO

CREATE TABLE [dbo].[cm_GroupAttributes](
	[GroupId] [uniqueidentifier] NOT NULL,
	[AttributeTypeId] [uniqueidentifier] NOT NULL,
	[MinimumAttributes] [int] NOT NULL,
	[MaximumAttributes] [int] NOT NULL,
 CONSTRAINT [cm_PK_GroupAttributes] PRIMARY KEY CLUSTERED 
(
	[GroupId] ASC,
	[AttributeTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_GroupAttributes]  WITH CHECK ADD  CONSTRAINT [cm_FK_ClassAttributes_AttributeClasses] FOREIGN KEY([GroupId])
REFERENCES [dbo].[cm_AttributeGroups] ([GroupId])
GO

ALTER TABLE [dbo].[cm_GroupAttributes] CHECK CONSTRAINT [cm_FK_ClassAttributes_AttributeClasses]
GO

ALTER TABLE [dbo].[cm_GroupAttributes]  WITH CHECK ADD  CONSTRAINT [cm_FK_ClassAttributes_AttributeTypes] FOREIGN KEY([AttributeTypeId])
REFERENCES [dbo].[cm_AttributeTypes] ([AttributeTypeId])
GO

ALTER TABLE [dbo].[cm_GroupAttributes] CHECK CONSTRAINT [cm_FK_ClassAttributes_AttributeTypes]
GO

ALTER TABLE [dbo].[cm_GroupAttributes]  WITH CHECK ADD  CONSTRAINT [cm_GroupAttributes_MinimumGreaterMaximum] CHECK  (([MinimumAttributes]<=[MaximumAttributes]))
GO

ALTER TABLE [dbo].[cm_GroupAttributes] CHECK CONSTRAINT [cm_GroupAttributes_MinimumGreaterMaximum]
GO

ALTER TABLE [dbo].[cm_GroupAttributes]  WITH CHECK ADD  CONSTRAINT [cm_GroupAttributes_MinimumSmallerZero] CHECK  (([MinimumAttributes]>=(0)))
GO

ALTER TABLE [dbo].[cm_GroupAttributes] CHECK CONSTRAINT [cm_GroupAttributes_MinimumSmallerZero]
GO

CREATE TABLE [dbo].[cm_ItemAttributeGroups](
	[GroupId] [uniqueidentifier] NOT NULL,
	[ItemTypeId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [cm_PK_ItemAttributeGroups] PRIMARY KEY CLUSTERED 
(
	[GroupId] ASC,
	[ItemTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_ItemAttributeGroups]  WITH CHECK ADD  CONSTRAINT [cm_FK_ItemAttribute_AttributeGroups] FOREIGN KEY([GroupId])
REFERENCES [dbo].[cm_AttributeGroups] ([GroupId])
GO

ALTER TABLE [dbo].[cm_ItemAttributeGroups] CHECK CONSTRAINT [cm_FK_ItemAttribute_AttributeGroups]
GO

ALTER TABLE [dbo].[cm_ItemAttributeGroups]  WITH CHECK ADD  CONSTRAINT [cm_FK_ItemAttributeGroups_ConfigurationItems] FOREIGN KEY([ItemTypeId])
REFERENCES [dbo].[cm_ItemTypes] ([TypeId])
GO

ALTER TABLE [dbo].[cm_ItemAttributeGroups] CHECK CONSTRAINT [cm_FK_ItemAttributeGroups_ConfigurationItems]
GO

CREATE TABLE [dbo].[cm_ItemAttributes](
	[AttributeId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[AttributeTypeId] [uniqueidentifier] NOT NULL,
	[AttributeValue] [nvarchar](100) NOT NULL,
	[AttributeCreated] [datetime] NOT NULL,
	[AttributeLastChange] [datetime] NOT NULL,
	[AttributeVersion] [int] NOT NULL,
 CONSTRAINT [cm_PK_ItemAttributes] PRIMARY KEY CLUSTERED 
(
	[AttributeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_ItemAttributes] ADD  CONSTRAINT [DF_Table7_AttributeId]  DEFAULT (newid()) FOR [ItemId]
GO

ALTER TABLE [dbo].[cm_ItemAttributes]  WITH CHECK ADD  CONSTRAINT [cm_FK_ItemAttributes_AttributeTypes] FOREIGN KEY([AttributeTypeId])
REFERENCES [dbo].[cm_AttributeTypes] ([AttributeTypeId])
GO

ALTER TABLE [dbo].[cm_ItemAttributes] CHECK CONSTRAINT [cm_FK_ItemAttributes_AttributeTypes]
GO

ALTER TABLE [dbo].[cm_ItemAttributes]  WITH CHECK ADD  CONSTRAINT [cm_FK_ItemAttributes_ConfigurationItems] FOREIGN KEY([ItemId])
REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
GO

ALTER TABLE [dbo].[cm_ItemAttributes] CHECK CONSTRAINT [cm_FK_ItemAttributes_ConfigurationItems]
GO

CREATE TABLE [dbo].[cm_ItemAttributesHistory](
	[AttributeId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[AttributeTypeId] [uniqueidentifier] NOT NULL,
	[AttributeTypeName] [nvarchar](50) NOT NULL,
	[AttributeValue] [nvarchar](100) NOT NULL,
	[AttributeCreated] [datetime] NOT NULL,
	[AttributeLastChange] [datetime] NOT NULL,
	[AttributeVersion] [int] NOT NULL,
	[ChangedByToken] [nvarchar](50) NOT NULL
) ON [PRIMARY]

GO

CREATE TABLE [dbo].[cm_ItemLinks](
	[LinkId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[LinkURI] [nvarchar](500) NOT NULL,
	[LinkDescription] [nvarchar](500) NOT NULL,
 CONSTRAINT [cm_PK_ItemLinks] PRIMARY KEY NONCLUSTERED 
(
	[LinkId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_ItemLinks] ADD  CONSTRAINT [DF_ItemLinks_LinkId]  DEFAULT (newid()) FOR [LinkId]
GO

ALTER TABLE [dbo].[cm_ItemLinks]  WITH CHECK ADD  CONSTRAINT [cm_FK_ItemLinks_ConfigurationItems] FOREIGN KEY([ItemId])
REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
GO

ALTER TABLE [dbo].[cm_ItemLinks] CHECK CONSTRAINT [cm_FK_ItemLinks_ConfigurationItems]
GO

CREATE TABLE [dbo].[cm_Responsibility](
	[ItemId] [uniqueidentifier] NOT NULL,
	[ResponsibleToken] [nvarchar](50) NOT NULL,
 CONSTRAINT [cm_PK_Responsibility] PRIMARY KEY CLUSTERED 
(
	[ItemId] ASC,
	[ResponsibleToken] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[cm_Responsibility]  WITH CHECK ADD  CONSTRAINT [cm_FK_Responsibility_ConfigurationItems] FOREIGN KEY([ItemId])
REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
GO

ALTER TABLE [dbo].[cm_Responsibility] CHECK CONSTRAINT [cm_FK_Responsibility_ConfigurationItems]
GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_Delete]
(
	@Original_AttributeTypeId uniqueidentifier,
	@Original_AttributeTypeName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_AttributeTypes] WHERE (([AttributeTypeId] = @Original_AttributeTypeId) AND ([AttributeTypeName] = @Original_AttributeTypeName))
GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_Insert]
(
	@AttributeTypeId uniqueidentifier,
	@AttributeTypeName nvarchar(50)
)
AS
	SET NOCOUNT OFF;

	IF (@AttributeTypeId IS NULL)
		SELECT @AttributeTypeId = NEWID();

INSERT INTO [cm_AttributeTypes] ([AttributeTypeId], [AttributeTypeName]) VALUES (@AttributeTypeId, @AttributeTypeName);
	
SELECT AttributeTypeId, AttributeTypeName FROM cm_AttributeTypes WHERE (AttributeTypeId = @AttributeTypeId)
GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     AttributeTypeId, AttributeTypeName
FROM         cm_AttributeTypes
ORDER BY AttributeTypeName ASC
GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectGroupedByGroup] 
(
	@GroupId uniqueidentifier
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_GroupAttributes WHERE GroupId = @GroupId)
		ORDER BY AttributeTypeName ASC;
END

GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectUngrouped] 

AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeId NOT IN (SELECT AttributeTypeId FROM cm_GroupAttributes)
		ORDER BY AttributeTypeName ASC;
END

GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_Update]
(
	@AttributeTypeName nvarchar(50),
	@Original_AttributeTypeId uniqueidentifier,
	@Original_AttributeTypeName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_AttributeTypes] SET [AttributeTypeName] = @AttributeTypeName WHERE (([AttributeTypeId] = @Original_AttributeTypeId) AND ([AttributeTypeName] = @Original_AttributeTypeName));
	
SELECT AttributeTypeId, AttributeTypeName FROM cm_AttributeTypes WHERE (AttributeTypeId = @Original_AttributeTypeId)
GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_Delete]
(
	@Original_GroupId uniqueidentifier,
	@Original_GroupName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_AttributeGroups] WHERE ([GroupId] = @Original_GroupId) AND ([GroupName] = @Original_GroupName)
GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_Insert]
(
	@GroupId uniqueidentifier,
	@GroupName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
IF (@GroupId IS NULL)
	SELECT @GroupId = NEWID();

INSERT INTO [cm_AttributeGroups] ([GroupId], [GroupName]) VALUES (@GroupId, @GroupName);
	
SELECT GroupId, GroupName FROM cm_AttributeGroups WHERE (GroupId = @GroupId)
GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, GroupName
FROM         cm_AttributeGroups
ORDER BY GroupName ASC
GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectAssignedToItem]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     *
	FROM    cm_AttributeGroups
	WHERE	GroupId IN (SELECT GroupId FROM cm_ItemAttributeGroups WHERE ItemTypeId = @ItemTypeId)
	ORDER BY GroupName ASC;
GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectUnassignedToItem]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     *
	FROM    cm_AttributeGroups
	WHERE	GroupId NOT IN (SELECT GroupId FROM cm_ItemAttributeGroups WHERE ItemTypeId = @ItemTypeId)
	ORDER BY GroupName ASC;

GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_Update]
(
	@GroupName nvarchar(50),
	@Original_GroupId uniqueidentifier,
	@Original_GroupName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_AttributeGroups] SET [GroupName] = @GroupName WHERE (([GroupId] = @Original_GroupId) AND ([GroupName] = @Original_GroupName) );
	
SELECT GroupId, GroupName FROM cm_AttributeGroups WHERE (GroupId = @Original_GroupId)
GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_GetCountForItemType]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(ItemId)
FROM         cm_ConfigurationItems
WHERE ItemType = @ItemTypeId

GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Insert]
(
	@ItemId uniqueidentifier,
	@ItemType uniqueidentifier,
	@ItemName nvarchar(50),
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;

	IF (@ItemId IS NULL)
		SELECT @ItemId = NEWID();


	INSERT INTO [cm_ConfigurationItems] ([ItemId], [ItemType], [ItemName], [ItemCreated], [ItemLastChange], [ItemVersion]) 
		VALUES (@ItemId, @ItemType, @ItemName, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

	INSERT INTO cm_Responsibility (ItemId, ResponsibleToken)
		VALUES (@ItemId, @ChangedByToken);
	
	SELECT ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion FROM cm_ConfigurationItems WHERE (ItemId = @ItemId)
GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Select]
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
ORDER BY ItemName ASC
GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectAvailableItemsByItemAndConnectionRule]
(
	@ItemId uniqueidentifier,
	@ConnectionRuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;

	DECLARE @UpperItemType uniqueidentifier,
		@LowerItemType uniqueidentifier,
		@ConnType uniqueidentifier,
		@CurrentItemType uniqueidentifier,
		@ConnMaximum int;

	SELECT @UpperItemType = ItemUpperType, @LowerItemType = ItemLowerType, @ConnType = ConnType, @ConnMaximum = MaximumConnections 
		FROM cm_ConnectionRules 
		WHERE RuleId = @ConnectionRuleId;
	SELECT @CurrentItemType = ItemType 
		FROM cm_ConfigurationItems 
		WHERE ItemId = @ItemId;

	IF @CurrentItemType = @UpperItemType
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE ItemType = @LowerItemType 
			AND ItemId NOT IN (SELECT ConnLowerItem FROM cm_Connections 
				WHERE ConnUpperItem = @ItemId AND ConnType = @ConnType)
			AND ((SELECT COUNT(ConnLowerItem) FROM cm_Connections 
				WHERE ConnUpperItem = @ItemId AND ConnType = @ConnType) < @ConnMaximum)
			ORDER BY ItemName ASC;
	ELSE IF @CurrentItemType = @LowerItemType
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE ItemType = @UpperItemType 
			AND ItemId NOT IN (SELECT ConnUpperItem FROM cm_Connections 
				WHERE ConnLowerItem = @ItemId AND ConnType = @ConnType)
			AND ((SELECT COUNT(ConnUpperItem) FROM cm_Connections 
				WHERE ConnLowerItem = @ItemId AND ConnType = @ConnType) < @ConnMaximum)
			ORDER BY ItemName ASC;
	ELSE
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE 1 = 0;


GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectByItemType]
(
	@ItemType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
WHERE ItemType = @ItemType
ORDER BY ItemName ASC

GO

USE [CMDB]
GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectByItemTypeAndNameOrAttribute]
(
	@ItemType uniqueidentifier,
	@TextToSearch nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
WHERE (ItemType = @ItemType) 
	AND ((ItemName LIKE '%' + @TextToSearch + '%')
	OR ItemId IN (SELECT ItemId FROM cm_ItemAttributes WHERE AttributeValue LIKE '%' + @TextToSearch + '%'))
ORDER BY ItemName ASC

GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectByNameOrAttribute]
(
	@TextToSearch nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
WHERE (ItemName LIKE '%' + @TextToSearch + '%')
	OR ItemId IN (SELECT ItemId FROM cm_ItemAttributes WHERE AttributeValue LIKE '%' + @TextToSearch + '%')
ORDER BY ItemName ASC

GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectItemsByItemAndConnectionRule]
(
	@ItemId uniqueidentifier,
	@ConnectionRuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;

	DECLARE @UpperItemType uniqueidentifier,
		@LowerItemType uniqueidentifier,
		@ConnType uniqueidentifier,
		@CurrentItemType uniqueidentifier;

	SELECT @UpperItemType = ItemUpperType, @LowerItemType = ItemLowerType, @ConnType = ConnType FROM cm_ConnectionRules WHERE RuleId = @ConnectionRuleId;
	SELECT @CurrentItemType = ItemType FROM cm_ConfigurationItems WHERE ItemId = @ItemId;

	IF @CurrentItemType = @UpperItemType
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE ItemType = @LowerItemType AND ItemId IN (SELECT ConnLowerItem FROM cm_Connections 
				WHERE ConnUpperItem = @ItemId AND ConnType = @ConnType)
			ORDER BY ItemName ASC;
	ELSE IF @CurrentItemType = @LowerItemType
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE ItemType = @UpperItemType AND ItemId IN (SELECT ConnUpperItem FROM cm_Connections 
				WHERE ConnLowerItem = @ItemId AND ConnType = @ConnType)
			ORDER BY ItemName ASC;
	ELSE
		SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
			FROM         cm_ConfigurationItems
			WHERE 1 = 0;

GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Update]
(
	@Original_ItemId uniqueidentifier,
	@ItemType uniqueidentifier,
	@ItemName nvarchar(50),
	@Original_ItemCreated datetime,
	@Original_ItemLastChange datetime,
	@Original_ItemVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
INSERT INTO [dbo].[cm_ConfigurationItemsHistory] 
	SELECT ItemId, ItemType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType), ItemName, ItemCreated, ItemLastChange, ItemVersion, @ChangedByToken 
		FROM [dbo].[cm_ConfigurationItems]
		WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange));

SELECT @Original_ItemVersion = Itemversion + 1 FROM [dbo].[cm_ConfigurationItems]
	WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange));

UPDATE [cm_ConfigurationItems] SET [ItemType] = @ItemType, [ItemName] = @ItemName, [ItemLastChange] = CURRENT_TIMESTAMP, [ItemVersion] = @Original_ItemVersion 
	WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange));
	
SELECT ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion FROM cm_ConfigurationItems WHERE (ItemId = @Original_ItemId)
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_Delete]
(
	@Original_RuleId uniqueidentifier,
	@Original_ItemUpperType uniqueidentifier,
	@Original_ItemLowerType uniqueidentifier,
	@Original_ConnType uniqueidentifier,
	@Original_MinimumConnections int,
	@Original_MaximumConnections int
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ConnectionRules] WHERE (([RuleId] = @Original_RuleId) AND ([ItemUpperType] = @Original_ItemUpperType) AND ([ItemLowerType] = @Original_ItemLowerType) AND ([ConnType] = @Original_ConnType) AND ([MinimumConnections] = @Original_MinimumConnections) AND ([MaximumConnections] = @Original_MaximumConnections))
GO

USE [CMDB]
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_Insert]
(
	@RuleId uniqueidentifier,
	@ItemUpperType uniqueidentifier,
	@ItemLowerType uniqueidentifier,
	@ConnType uniqueidentifier,
	@MinimumConnections int,
	@MaximumConnections int
)
AS
	SET NOCOUNT OFF;
IF @RuleId IS NULL
	SELECT @RuleId = NEWID();

INSERT INTO [cm_ConnectionRules] ([RuleId], [ItemUpperType], [ItemLowerType], [ConnType], [MinimumConnections], [MaximumConnections]) VALUES (@RuleId, @ItemUpperType, @ItemLowerType, @ConnType, @MinimumConnections, @MaximumConnections);
	
SELECT RuleId, ItemUpperType, ItemLowerType, ConnType, MinimumConnections, MaximumConnections FROM cm_ConnectionRules WHERE (RuleId = @RuleId)
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_Select]
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MinimumConnections, MaximumConnections
FROM         cm_ConnectionRules
ORDER BY ItemUpperType ASC, ItemLowerType ASC, ConnType ASC
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectByItemLowerType]
(
	@ItemLowerTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MinimumConnections, MaximumConnections
FROM         cm_ConnectionRules
WHERE ItemLowerType = @ItemLowerTypeId
ORDER BY ConnType ASC, ItemUpperType ASC

GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectByItemUpperType]
(
	@ItemUpperTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MinimumConnections, MaximumConnections
FROM         cm_ConnectionRules
WHERE ItemUpperType = @ItemUpperTypeId
ORDER BY ConnType ASC, ItemLowerType ASC

GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_Update]
(
	@ItemUpperType uniqueidentifier,
	@ItemLowerType uniqueidentifier,
	@ConnType uniqueidentifier,
	@MinimumConnections int,
	@MaximumConnections int,
	@Original_RuleId uniqueidentifier,
	@Original_ItemUpperType uniqueidentifier,
	@Original_ItemLowerType uniqueidentifier,
	@Original_ConnType uniqueidentifier,
	@Original_MinimumConnections int,
	@Original_MaximumConnections int
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ConnectionRules] SET [ItemUpperType] = @ItemUpperType, [ItemLowerType] = @ItemLowerType, [ConnType] = @ConnType, [MinimumConnections] = @MinimumConnections, [MaximumConnections] = @MaximumConnections WHERE (([RuleId] = @Original_RuleId) AND ([ItemUpperType] = @Original_ItemUpperType) AND ([ItemLowerType] = @Original_ItemLowerType) AND ([ConnType] = @Original_ConnType) AND ([MinimumConnections] = @Original_MinimumConnections) AND ([MaximumConnections] = @Original_MaximumConnections));
	
SELECT RuleId, ItemUpperType, ItemLowerType, ConnType, MinimumConnections, MaximumConnections FROM cm_ConnectionRules WHERE (RuleId = @Original_RuleId)
GO

CREATE PROCEDURE [dbo].[cm_Connections_Delete]
(
	@Original_ConnId uniqueidentifier,
	@Original_ConnType uniqueidentifier,
	@Original_ConnUpperItem uniqueidentifier,
	@Original_ConnLowerItem uniqueidentifier,
	@Original_ConnCreated datetime,
	@Original_ConnLastChange datetime,
	@Original_ConnVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
INSERT INTO cm_ConnectionsHistory
	SELECT ConnId, ConnType, (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = ConnType), ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion, @ChangedByToken FROM cm_Connections 
		WHERE (([ConnId] = @Original_ConnId) AND ([ConnType] = @Original_ConnType) AND ([ConnUpperItem] = @Original_ConnUpperItem) 
		AND ([ConnLowerItem] = @Original_ConnLowerItem) AND ([ConnCreated] = @Original_ConnCreated) AND ([ConnLastChange] = @Original_ConnLastChange) 
		AND ([ConnVersion] = @Original_ConnVersion));


DELETE FROM [cm_Connections] WHERE (([ConnId] = @Original_ConnId) AND ([ConnType] = @Original_ConnType) AND ([ConnUpperItem] = @Original_ConnUpperItem) 
	AND ([ConnLowerItem] = @Original_ConnLowerItem) AND ([ConnCreated] = @Original_ConnCreated) AND ([ConnLastChange] = @Original_ConnLastChange) 
	AND ([ConnVersion] = @Original_ConnVersion))
GO

CREATE PROCEDURE [dbo].[cm_Connections_GetCountForConnectionType]
(
	@ConnTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(ConnId)
FROM         cm_Connections
WHERE ConnType = @ConnTypeId

GO

CREATE PROCEDURE [dbo].[cm_Connections_GetCountForRule]
(
	@RuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;
DECLARE @RuleUpper uniqueidentifier,
		@RuleLower uniqueidentifier,
		@RuleConnType uniqueidentifier;

SELECT @RuleUpper = ItemUpperType, @RuleConnType = ConnType, @RuleLower = ItemLowerType FROM cm_ConnectionRules WHERE RuleId = @RuleID;

SELECT COUNT([ConnId])
  FROM [dbo].[cm_Connections]

WHERE @RuleUpper = (SELECT ItemType FROM cm_ConfigurationItems WHERE ItemId = ConnUpperItem)
AND @RuleLower = (SELECT ItemType FROM cm_ConfigurationItems WHERE ItemId = ConnLowerItem)
AND @RuleConnType = ConnType;


GO

CREATE PROCEDURE [dbo].[cm_Connections_Insert]
(
	@ConnId uniqueidentifier,
	@ConnType uniqueidentifier,
	@ConnUpperItem uniqueidentifier,
	@ConnLowerItem uniqueidentifier
)
AS
	SET NOCOUNT OFF;

IF @ConnId IS NULL
	SELECT @ConnId = NEWID();

INSERT INTO [cm_Connections] ([ConnId], [ConnType], [ConnUpperItem], [ConnLowerItem], [ConnCreated], [ConnLastChange], [ConnVersion]) 
	VALUES (@ConnId, @ConnType, @ConnUpperItem, @ConnLowerItem, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);
	
SELECT ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion FROM cm_Connections WHERE (ConnId = @ConnId)
GO

CREATE PROCEDURE [dbo].[cm_Connections_Select]
AS
	SET NOCOUNT ON;
SELECT     ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion
FROM         cm_Connections
ORDER BY ConnType ASC, ConnUpperItem ASC, ConnLowerItem ASC
GO

CREATE PROCEDURE [dbo].[cm_Connections_SelectByItemAndConnectionRule]
(
	@ItemId uniqueidentifier,
	@ConnectionRuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;

	DECLARE @UpperItemType uniqueidentifier,
		@LowerItemType uniqueidentifier,
		@ConnType uniqueidentifier,
		@CurrentItemType uniqueidentifier;

	SELECT @UpperItemType = ItemUpperType, @LowerItemType = ItemLowerType, @ConnType = ConnType FROM cm_ConnectionRules WHERE RuleId = @ConnectionRuleId;
	SELECT @CurrentItemType = ItemType FROM cm_ConfigurationItems WHERE ItemId = @ItemId;

	IF @CurrentItemType = @UpperItemType
		SELECT      ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion
			FROM         cm_Connections
			WHERE ConnUpperItem = @ItemId 
			AND ConnType = @ConnType
			AND ConnLowerItem IN (SELECT ItemId FROM cm_ConfigurationItems WHERE ItemType = @LowerItemType);
	ELSE IF @CurrentItemType = @LowerItemType
		SELECT      ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion
			FROM         cm_Connections
			WHERE ConnLowerItem = @ItemId 
			AND ConnType = @ConnType
			AND ConnUpperItem IN (SELECT ItemId FROM cm_ConfigurationItems WHERE ItemType = @LowerItemType);
	ELSE
		SELECT      ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion
			FROM         cm_Connections
			WHERE 1 = 0;

GO

CREATE PROCEDURE [dbo].[cm_Connections_SelectLowerItemsForItemId]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion
FROM         cm_Connections
WHERE ConnUpperItem = @ItemId
ORDER BY ConnType ASC, ConnLowerItem ASC

GO

CREATE PROCEDURE [dbo].[cm_Connections_SelectUpperItemsForItemId]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion
FROM         cm_Connections
WHERE ConnLowerItem = @ItemId
ORDER BY ConnType ASC, ConnUpperItem ASC

GO

CREATE PROCEDURE [dbo].[cm_Connections_Update]
(
	@ConnType uniqueidentifier,
	@ConnUpperItem uniqueidentifier,
	@ConnLowerItem uniqueidentifier,
	@Original_ConnId uniqueidentifier,
	@Original_ConnLastChange datetime,
	@Original_ConnVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
INSERT INTO cm_ConnectionsHistory
	SELECT ConnId, ConnType, (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = ConnType), ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion, @ChangedByToken FROM cm_Connections 
		WHERE (([ConnId] = @Original_ConnId) AND ([ConnLastChange] = @Original_ConnLastChange) AND ([ConnVersion] = @Original_ConnVersion));

SELECT @Original_ConnVersion = ConnVersion + 1 FROM cm_Connections WHERE (([ConnId] = @Original_ConnId) AND ([ConnLastChange] = @Original_ConnLastChange) AND ([ConnVersion] = @Original_ConnVersion));

UPDATE [cm_Connections] SET [ConnType] = @ConnType, [ConnUpperItem] = @ConnUpperItem, [ConnLowerItem] = @ConnLowerItem, [ConnLastChange] = CURRENT_TIMESTAMP, [ConnVersion] = @Original_ConnVersion 
	WHERE (([ConnId] = @Original_ConnId) AND ([ConnLastChange] = @Original_ConnLastChange));
	
SELECT ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion, (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = ConnType) AS ConnTypeName FROM cm_Connections 
	WHERE (ConnId = @Original_ConnId)
GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Delete]
(
	@Original_ConnTypeId uniqueidentifier,
	@Original_ConnTypeName nvarchar(50),
	@Original_ConnTypeReverseName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ConnectionTypes] WHERE (([ConnTypeId] = @Original_ConnTypeId) AND ([ConnTypeName] = @Original_ConnTypeName) AND ([ConnTypeReverseName] = @Original_ConnTypeReverseName))
GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Insert]
(
	@ConnTypeId uniqueidentifier,
	@ConnTypeName nvarchar(50),
	@ConnTypeReverseName nvarchar(50)
)
AS
	SET NOCOUNT OFF;

IF (@ConnTypeId IS NULL)
	SELECT @ConnTypeId = NEWID();

INSERT INTO [cm_ConnectionTypes] ([ConnTypeId], [ConnTypeName], [ConnTypeReverseName]) VALUES (@ConnTypeId, @ConnTypeName, @ConnTypeReverseName);
	
SELECT ConnTypeId, ConnTypeName, ConnTypeReverseName FROM cm_ConnectionTypes WHERE (ConnTypeId = @ConnTypeId)
GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
ORDER BY ConnTypeName ASC
GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectAllowedDownwardByItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
	WHERE	(ConnTypeId IN (SELECT ConnType FROM cm_ConnectionRules 
		WHERE ItemUpperType = (SELECT ItemType FROM cm_ConfigurationItems 
			WHERE ItemId = @ItemId)))
ORDER BY ConnTypeName ASC

GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectAllowedUpwardByItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
	WHERE	(ConnTypeId IN (SELECT ConnType FROM cm_ConnectionRules 
		WHERE ItemLowerType = (SELECT ItemType FROM cm_ConfigurationItems 
			WHERE ItemId = @ItemId)))
ORDER BY ConnTypeName ASC

GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectSingleType]
(
	@ConnTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
WHERE ConnTypeId = @ConnTypeId;

GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Update]
(
	@ConnTypeName nvarchar(50),
	@ConnTypeReverseName nvarchar(50),
	@Original_ConnTypeId uniqueidentifier,
	@Original_ConnTypeName nvarchar(50),
	@Original_ConnTypeReverseName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ConnectionTypes] SET [ConnTypeName] = @ConnTypeName, [ConnTypeReverseName] = @ConnTypeReverseName WHERE (([ConnTypeId] = @Original_ConnTypeId) AND ([ConnTypeName] = @Original_ConnTypeName) AND ([ConnTypeReverseName] = @Original_ConnTypeReverseName));
	
SELECT ConnTypeId, ConnTypeName, ConnTypeReverseName FROM cm_ConnectionTypes WHERE (ConnTypeId = @Original_ConnTypeId)
GO

CREATE PROCEDURE [dbo].[cm_GroupAttributes_Delete]
(
	@Original_GroupId uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier,
	@Original_MinimumAttributes int,
	@Original_MaximumAttributes int
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_GroupAttributes] WHERE (([GroupId] = @Original_GroupId) AND ([AttributeTypeId] = @Original_AttributeTypeId) AND (MinimumAttributes = @Original_MinimumAttributes) AND (MaximumAttributes = @Original_MaximumAttributes))
GO

CREATE PROCEDURE [dbo].[cm_GroupAttributes_Insert]
(
	@GroupId uniqueidentifier,
	@AttributeTypeId uniqueidentifier,
	@MinimumAttributes int,
	@MaximumAttributes int
)
AS
	SET NOCOUNT OFF;
IF @GroupId IS NULL
	SELECT @GroupId = NEWID();

INSERT INTO [cm_GroupAttributes] ([GroupId], [AttributeTypeId], [MinimumAttributes], [MaximumAttributes]) VALUES (@GroupId, @AttributeTypeId, @MinimumAttributes, @MaximumAttributes);
	
SELECT GroupId, AttributeTypeId, MinimumAttributes, MaximumAttributes FROM cm_GroupAttributes WHERE (AttributeTypeId = @AttributeTypeId) AND (GroupId = @GroupId)
GO

CREATE PROCEDURE [dbo].[cm_GroupAttributes_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, AttributeTypeId, MinimumAttributes, MaximumAttributes
FROM         cm_GroupAttributes
ORDER BY GroupId ASC, AttributeTypeId ASC
GO

CREATE PROCEDURE [dbo].[cm_GroupAttributes_Update]
(
	@MinimumAttributes int,
	@MaximumAttributes int,
	@Original_GroupId uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier,
	@Original_MinimumAttributes int,
	@Original_MaximumAttributes int
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_GroupAttributes] SET [MinimumAttributes] = @MinimumAttributes, [MaximumAttributes] = @MaximumAttributes WHERE (([GroupId] = @Original_GroupId) AND ([AttributeTypeId] = @Original_AttributeTypeId) AND ([MinimumAttributes] = @Original_MinimumAttributes) AND ([MaximumAttributes] = @Original_MaximumAttributes));
	
SELECT GroupId, AttributeTypeId FROM cm_GroupAttributes WHERE (AttributeTypeId = @Original_AttributeTypeId) AND (GroupId = @Original_GroupId)
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributeGroups_Delete]
(
	@Original_GroupId uniqueidentifier,
	@Original_ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ItemAttributeGroups] WHERE (([GroupId] = @Original_GroupId) AND ([ItemTypeId] = @Original_ItemTypeId))
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributeGroups_Insert]
(
	@GroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
INSERT INTO [cm_ItemAttributeGroups] ([GroupId], [ItemTypeId]) VALUES (@GroupId, @ItemTypeId);
	
SELECT GroupId, ItemTypeId FROM cm_ItemAttributeGroups WHERE (GroupId = @GroupId) AND (ItemTypeId = @ItemTypeId)
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributeGroups_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, ItemTypeId
FROM         cm_ItemAttributeGroups
ORDER BY GroupId ASC, ItemTypeId ASC
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributeGroups_Update]
(
	@GroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier,
	@Original_GroupId uniqueidentifier,
	@Original_ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ItemAttributeGroups] SET [GroupId] = @GroupId, [ItemTypeId] = @ItemTypeId WHERE (([GroupId] = @Original_GroupId) AND ([ItemTypeId] = @Original_ItemTypeId));
	
SELECT GroupId, ItemTypeId FROM cm_ItemAttributeGroups WHERE (GroupId = @GroupId) AND (ItemTypeId = @ItemTypeId)
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_Delete]
(
	@Original_AttributeId uniqueidentifier,
	@Original_ItemId uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier,
	@Original_AttributeValue nvarchar(100),
	@Original_AttributeCreated datetime,
	@Original_AttributeLastChange datetime,
	@Original_AttributeVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
INSERT INTO cm_ItemAttributesHistory
	SELECT AttributeId, ItemId, AttributeTypeId, (SELECT [AttributeTypeName] FROM cm_AttributeTypes WHERE cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId), 
			AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion, @ChangedByToken FROM cm_ItemAttributes
		WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange) AND ([AttributeVersion] = @Original_AttributeVersion));



DELETE FROM [cm_ItemAttributes] WHERE (([AttributeId] = @Original_AttributeId) AND ([ItemId] = @Original_ItemId) AND ([AttributeTypeId] = @Original_AttributeTypeId) 
	AND ([AttributeValue] = @Original_AttributeValue) AND ([AttributeCreated] = @Original_AttributeCreated) AND ([AttributeLastChange] = @Original_AttributeLastChange) 
	AND ([AttributeVersion] = @Original_AttributeVersion))
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_DeleteByAttributeGroupAndItemType]
(
	@AttributeGroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier,
	@ChangedByToken nvarchar(50)
)

AS
	SET NOCOUNT OFF;

	BEGIN TRANSACTION;

		DECLARE @Original_AttributeId uniqueidentifier;
		DECLARE @Original_ItemId uniqueidentifier;
		DECLARE @Original_AttributeTypeId uniqueidentifier;
		DECLARE @Original_AttributeValue nvarchar(100);
		DECLARE @Original_AttributeCreated datetime;
		DECLARE @Original_AttributeLastChange datetime;
		DECLARE @Original_AttributeVersion int;

		DECLARE @AttributeTypeId uniqueidentifier;
		DECLARE @ItemId uniqueidentifier;

		DECLARE groupAttributesCursor CURSOR FOR
			SELECT AttributeTypeId FROM cm_GroupAttributes
				WHERE GroupId = @AttributeGroupId
			FOR READ ONLY;

		OPEN groupAttributesCursor;

		FETCH NEXT FROM groupAttributesCursor
			INTO @AttributeTypeId;

		WHILE @@FETCH_STATUS = 0
		BEGIN
		
			DECLARE itemAttributeCursor CURSOR FOR
				SELECT		AttributeId, ItemId, AttributeTypeId, AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion
					FROM	cm_ItemAttributes
					WHERE	AttributeTypeId = @AttributeTypeId 
					AND ItemId IN (SELECT ItemId FROM cm_ConfigurationItems WHERE ItemType = @ItemTypeId);

			OPEN itemAttributeCursor;

			FETCH NEXT FROM itemAttributeCursor
				INTO @Original_AttributeId, @Original_ItemId, @Original_AttributeTypeId, @Original_AttributeValue, @Original_AttributeCreated, 
					@Original_AttributeLastChange, @Original_AttributeVersion;
			
			WHILE @@FETCH_STATUS = 0
			BEGIN
				EXEC cm_ItemAttributes_Delete @Original_AttributeId, @Original_ItemId, @Original_AttributeTypeId, @Original_AttributeValue,
					@Original_AttributeCreated, @Original_AttributeLastChange, @Original_AttributeVersion, @ChangedByToken
				FETCH NEXT FROM itemAttributeCursor
					INTO @Original_AttributeId, @Original_ItemId, @Original_AttributeTypeId, @Original_AttributeValue, @Original_AttributeCreated, 
						@Original_AttributeLastChange, @Original_AttributeVersion;
			END

			CLOSE itemAttributeCursor;
			DEALLOCATE itemAttributeCursor;

			FETCH NEXT FROM groupAttributesCursor
				INTO @AttributeTypeId;

		END 
		CLOSE groupAttributesCursor;

		DEALLOCATE groupAttributesCursor;

	COMMIT TRANSACTION;

GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_GetCountForAttributeGroup]
(
	@AttributeGroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(AttributeId)
FROM         cm_ItemAttributes
WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_GroupAttributes WHERE GroupId = @AttributeGroupId);

GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_GetCountForAttributeGroupAndItemType]
(
	@AttributeGroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
	SELECT     COUNT(AttributeId)
		FROM         cm_ItemAttributes
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_GroupAttributes WHERE GroupId = @AttributeGroupId)
		AND ItemId IN (SELECT ItemId FROM cm_ConfigurationItems WHERE ItemType = @ItemTypeId);


GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_GetCountForType]
(
	@AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(AttributeId) FROM cm_ItemAttributes WHERE AttributeTypeId = @AttributeTypeId

GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_Insert]
(
	@AttributeId uniqueidentifier,
	@ItemId uniqueidentifier,
	@AttributeTypeId uniqueidentifier,
	@AttributeValue nvarchar(100)
)
AS
	SET NOCOUNT OFF;
	DECLARE @AttributeCreated datetime;
	DECLARE @AttributeLastChange datetime;
	DECLARE @AttributeVersion int;
	IF @AttributeId IS NULL
		SELECT @AttributeId = NEWID();

	SELECT @AttributeCreated = CURRENT_TIMESTAMP, @AttributeLastChange = CURRENT_TIMESTAMP, @AttributeVersion = 0;

	INSERT INTO [cm_ItemAttributes] ([AttributeId], [ItemId], [AttributeTypeId], [AttributeValue], [AttributeCreated], [AttributeLastChange], [AttributeVersion]) VALUES (@AttributeId, @ItemId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion);
	
	SELECT AttributeId, ItemId, AttributeTypeId, AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion FROM cm_ItemAttributes WHERE (AttributeId = @AttributeId)
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_Select]
AS
	SET NOCOUNT ON;
SELECT     cm_ItemAttributes.AttributeId, cm_ItemAttributes.ItemId, cm_ItemAttributes.AttributeTypeId, cm_ItemAttributes.AttributeValue, cm_ItemAttributes.AttributeCreated, cm_ItemAttributes.AttributeLastChange, cm_ItemAttributes.AttributeVersion, cm_AttributeTypes.AttributeTypeName
FROM         cm_ItemAttributes INNER JOIN cm_AttributeTypes ON cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId

ORDER BY cm_ItemAttributes.ItemId ASC, cm_AttributeTypes.AttributeTypeName ASC, cm_ItemAttributes.AttributeValue ASC
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_SelectByItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     cm_ItemAttributes.AttributeId, cm_ItemAttributes.ItemId, cm_ItemAttributes.AttributeTypeId, cm_ItemAttributes.AttributeValue, cm_ItemAttributes.AttributeCreated, cm_ItemAttributes.AttributeLastChange, cm_ItemAttributes.AttributeVersion, cm_AttributeTypes.AttributeTypeName
FROM         cm_ItemAttributes INNER JOIN cm_AttributeTypes ON cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId
WHERE ItemId = @ItemId
ORDER BY AttributeTypeName ASC, AttributeValue ASC

GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_SelectByItemAndType]
(
	@ItemId uniqueidentifier,
	@AttributeType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     cm_ItemAttributes.AttributeId, cm_ItemAttributes.ItemId, cm_ItemAttributes.AttributeTypeId, cm_ItemAttributes.AttributeValue, cm_ItemAttributes.AttributeCreated, cm_ItemAttributes.AttributeLastChange, cm_ItemAttributes.AttributeVersion, cm_AttributeTypes.AttributeTypeName
FROM         cm_ItemAttributes INNER JOIN cm_AttributeTypes ON cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId
WHERE ItemId = @ItemId AND cm_ItemAttributes.AttributeTypeId = @AttributeType
ORDER BY AttributeTypeName ASC, AttributeValue ASC

GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_Update]
(
	@AttributeValue nvarchar(100),
	@Original_AttributeId uniqueidentifier,
	@Original_AttributeLastChange datetime,
	@Original_AttributeVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
INSERT INTO cm_ItemAttributesHistory
	SELECT AttributeId, ItemId, AttributeTypeId, (SELECT [AttributeTypeName] FROM cm_AttributeTypes WHERE cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId), 
			AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion, @ChangedByToken FROM cm_ItemAttributes
		WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange) AND ([AttributeVersion] = @Original_AttributeVersion));


UPDATE [cm_ItemAttributes] SET [AttributeValue] = @AttributeValue, [AttributeLastChange] = CURRENT_TIMESTAMP, [AttributeVersion] = [AttributeVersion] + 1 
	WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange));
	
SELECT AttributeId, ItemId, AttributeTypeId, AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion FROM cm_ItemAttributes WHERE (AttributeId = @Original_AttributeId)
GO

CREATE PROCEDURE [dbo].[cm_ItemLinks_Delete]
(
	@Original_LinkId uniqueidentifier,
	@Original_ItemId uniqueidentifier,
	@Original_LinkURI nvarchar(500),
	@Original_LinkDescription nvarchar(500)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ItemLinks] WHERE (([LinkId] = @Original_LinkId) AND ([ItemId] = @Original_ItemId) AND ([LinkURI] = @Original_LinkURI) AND ([LinkDescription] = @Original_LinkDescription))
GO

CREATE PROCEDURE [dbo].[cm_ItemLinks_Insert]
(
	@LinkId uniqueidentifier,
	@ItemId uniqueidentifier,
	@LinkURI nvarchar(500),
	@LinkDescription nvarchar(500)
)
AS
	SET NOCOUNT OFF;

IF @LinkId IS NULL
	SELECT @LinkId = NEWID();

INSERT INTO [cm_ItemLinks] ([LinkId], [ItemId], [LinkURI], [LinkDescription]) VALUES (@LinkId, @ItemId, @LinkURI, @LinkDescription);
	
SELECT LinkId, ItemId, LinkURI, LinkDescription FROM cm_ItemLinks WHERE (LinkId = @LinkId)
GO

CREATE PROCEDURE [dbo].[cm_ItemLinks_Select]
AS
	SET NOCOUNT ON;
SELECT     LinkId, ItemId, LinkURI, LinkDescription
FROM         cm_ItemLinks

GO

CREATE PROCEDURE [dbo].[cm_ItemLinks_SelectByItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     LinkId, ItemId, LinkURI, LinkDescription
FROM         cm_ItemLinks
WHERE	ItemId = @ItemId;

GO

USE [CMDB]
GO

CREATE PROCEDURE [dbo].[cm_ItemLinks_Update]
(
	@LinkURI nvarchar(500),
	@LinkDescription nvarchar(500),
	@Original_LinkId uniqueidentifier,
	@Original_ItemId uniqueidentifier,
	@Original_LinkURI nvarchar(500),
	@Original_LinkDescription nvarchar(500)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ItemLinks] SET [LinkURI] = @LinkURI, [LinkDescription] = @LinkDescription WHERE (([LinkId] = @Original_LinkId) AND ([ItemId] = @Original_ItemId) AND ([LinkURI] = @Original_LinkURI) AND ([LinkDescription] = @Original_LinkDescription));
	
SELECT LinkId, ItemId, LinkURI, LinkDescription FROM cm_ItemLinks WHERE (LinkId = @Original_LinkId)
GO

CREATE PROCEDURE [dbo].[cm_ItemTypes_Delete]
(
	@Original_TypeId uniqueidentifier,
	@Original_TypeName nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ItemTypes] WHERE (([TypeId] = @Original_TypeId) AND ([TypeName] = @Original_TypeName))
GO

CREATE PROCEDURE [dbo].[cm_ItemTypes_Insert]
(
	@TypeId uniqueidentifier,
	@TypeName nvarchar(50),
	@TypeBackColor nchar(7)
)
AS
	SET NOCOUNT OFF;

IF (@TypeId IS NULL)
	SELECT @TypeId = NEWID();

INSERT INTO [cm_ItemTypes] ([TypeId], [TypeName], [TypeBackColor]) VALUES (@TypeId, @TypeName, @TypeBackColor);
	
SELECT TypeId, TypeName, TypeBackColor FROM cm_ItemTypes WHERE (TypeId = @TypeId)
GO

CREATE PROCEDURE [dbo].[cm_ItemTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
FROM         cm_ItemTypes
ORDER BY TypeName ASC
GO

CREATE PROCEDURE [dbo].[cm_ItemTypes_Update]
(
	@TypeName nvarchar(50),
	@TypeBackColor nchar(7),
	@Original_TypeId uniqueidentifier,
	@Original_TypeName nvarchar(50),
	@Original_TypeBackColor nchar(7)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ItemTypes] SET [TypeName] = @TypeName, [TypeBackColor] = @TypeBackColor 
	WHERE (([TypeId] = @Original_TypeId) AND ([TypeName] = @Original_TypeName) AND ([TypeBackColor] = @Original_TypeBackColor));
	
SELECT TypeId, TypeName, TypeBackColor FROM cm_ItemTypes WHERE (TypeId = @Original_TypeId)
GO

CREATE PROCEDURE [dbo].[cm_Responsibility_Delete]
(
	@Original_ItemId uniqueidentifier,
	@Original_ResponsibleToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_Responsibility] WHERE (([ItemId] = @Original_ItemId) AND ([ResponsibleToken] = @Original_ResponsibleToken))
GO

CREATE PROCEDURE [dbo].[cm_Responsibility_Insert]
(
	@ItemId uniqueidentifier,
	@ResponsibleToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
INSERT INTO [cm_Responsibility] ([ItemId], [ResponsibleToken]) VALUES (@ItemId, @ResponsibleToken);
	
SELECT ItemId, ResponsibleToken FROM cm_Responsibility WHERE (ItemId = @ItemId) AND (ResponsibleToken = @ResponsibleToken)
GO

CREATE PROCEDURE [dbo].[cm_Responsibility_Select]
AS
	SET NOCOUNT ON;
SELECT     ItemId, ResponsibleToken
FROM         cm_Responsibility
GO

CREATE PROCEDURE [dbo].[cm_Responsibility_Update]
(
	@ItemId uniqueidentifier,
	@ResponsibleToken nvarchar(50),
	@Original_ItemId uniqueidentifier,
	@Original_ResponsibleToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_Responsibility] SET [ItemId] = @ItemId, [ResponsibleToken] = @ResponsibleToken WHERE (([ItemId] = @Original_ItemId) AND ([ResponsibleToken] = @Original_ResponsibleToken));
	
SELECT ItemId, ResponsibleToken FROM cm_Responsibility WHERE (ItemId = @ItemId) AND (ResponsibleToken = @ResponsibleToken)
GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Delete]
(
	@Original_ItemId uniqueidentifier,
	@Original_ItemType uniqueidentifier,
	@Original_ItemName nvarchar(50),
	@Original_ItemCreated datetime,
	@Original_ItemLastChange datetime,
	@Original_ItemVersion int,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
	BEGIN TRANSACTION;

		-- History füllen
		INSERT INTO [dbo].[cm_ConfigurationItemsHistory] 
			SELECT ItemId, ItemType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType), ItemName, ItemCreated, ItemLastChange, ItemVersion, @ChangedByToken 
				FROM [dbo].[cm_ConfigurationItems]
				WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange));

		-- Attribute löschen
		DECLARE @AttributeId uniqueidentifier,
			@AttributeTypeId uniqueidentifier,
			@AttributeValue nvarchar(100),
			@AttributeCreated datetime,
			@AttributeLastChange datetime,
			@AttributeVersion int;

		DECLARE itemAttributesCursor CURSOR FOR
			SELECT     AttributeId, AttributeTypeId, AttributeValue, AttributeCreated, AttributeLastChange, AttributeVersion
				FROM       cm_ItemAttributes
				WHERE	   ItemId = @Original_ItemId
			FOR READ ONLY;

		OPEN itemAttributesCursor;

		FETCH NEXT FROM itemAttributesCursor
			INTO @AttributeId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion;

		WHILE @@FETCH_STATUS = 0
		BEGIN
			EXEC cm_ItemAttributes_Delete @AttributeId, @Original_ItemId, @AttributeTypeId, @AttributeValue,
					@AttributeCreated, @AttributeLastChange, @AttributeVersion, @ChangedByToken;
			FETCH NEXT FROM itemAttributesCursor
				INTO @AttributeId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion;
		END
		
		CLOSE itemAttributesCursor;
		DEALLOCATE itemAttributesCursor;

		-- Connections löschen
		DECLARE @ConnId uniqueidentifier, 
			@ConnType uniqueidentifier, 
			@ConnUpperItem uniqueidentifier, 
			@ConnLowerItem uniqueidentifier, 
			@ConnCreated datetime, 
			@ConnLastChange datetime, 
			@ConnVersion int;

		DECLARE connectionsCursor CURSOR FOR
			SELECT     ConnId, ConnType, ConnUpperItem, ConnLowerItem, ConnCreated, ConnLastChange, ConnVersion
				FROM       cm_Connections
				WHERE ConnUpperItem = @Original_ItemId OR ConnLowerItem = @Original_ItemId
			FOR READ ONLY;

		OPEN connectionsCursor;

		FETCH NEXT FROM connectionsCursor
			INTO @ConnId, @ConnType, @ConnUpperItem, @ConnLowerItem, @ConnCreated, @ConnLastChange, @ConnVersion;

		WHILE @@FETCH_STATUS = 0
		BEGIN
			EXEC cm_Connections_Delete @ConnId, @ConnType, @ConnUpperItem, @ConnLowerItem, @ConnCreated, @ConnLastChange, @ConnVersion, @ChangedByToken;
			FETCH NEXT FROM connectionsCursor
				INTO @ConnId, @ConnType, @ConnUpperItem, @ConnLowerItem, @ConnCreated, @ConnLastChange, @ConnVersion;
		END

		CLOSE connectionsCursor;
		DEALLOCATE connectionsCursor;

		-- Links löschen
		DELETE FROM [cm_ItemLinks]
			WHERE ItemId = @Original_ItemId;

		-- Verantwortlichkeiten löschen
		DELETE [cm_Responsibility] 
			WHERE ItemId = @Original_ItemId;

		-- Item löschen
		DELETE FROM [cm_ConfigurationItems] 
			WHERE (([ItemId] = @Original_ItemId) AND ([ItemType] = @Original_ItemType) AND ([ItemName] = @Original_ItemName) 
			AND ([ItemCreated] = @Original_ItemCreated) AND ([ItemLastChange] = @Original_ItemLastChange) 
			AND ([ItemVersion] = @Original_ItemVersion));

	COMMIT TRANSACTION;
GO

CREATE PROCEDURE [dbo].[cm_View_GetMostDependedItems]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT        dbo.cm_ItemTypes.TypeName, dbo.cm_ConfigurationItems.ItemName, COUNT(dbo.cm_Connections.ConnUpperItem) AS DependingItems
		FROM            dbo.cm_ConfigurationItems INNER JOIN
						 dbo.cm_ItemTypes ON dbo.cm_ConfigurationItems.ItemType = dbo.cm_ItemTypes.TypeId INNER JOIN
						 dbo.cm_Connections ON dbo.cm_ConfigurationItems.ItemId = dbo.cm_Connections.ConnLowerItem
		GROUP BY dbo.cm_ItemTypes.TypeName, dbo.cm_ConfigurationItems.ItemName
		ORDER BY DependingItems DESC
END

GO


