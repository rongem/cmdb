USE [master]
GO
/****** Object:  Database [RZ-CMDB]    Script Date: 30.06.2017 11:54:12 ******/
CREATE DATABASE [RZ-CMDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'RZ-CMDB', FILENAME = N'E:\MSSQL12.DEV4\MSSQL\DATA\RZ-CMDB.mdf' , SIZE = 14336KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'RZ-CMDB_log', FILENAME = N'E:\MSSQL12.DEV4\MSSQL\DATA\RZ-CMDB_log.ldf' , SIZE = 2048KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [RZ-CMDB] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [RZ-CMDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [RZ-CMDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [RZ-CMDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [RZ-CMDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [RZ-CMDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [RZ-CMDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [RZ-CMDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [RZ-CMDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [RZ-CMDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [RZ-CMDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [RZ-CMDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [RZ-CMDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [RZ-CMDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [RZ-CMDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [RZ-CMDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [RZ-CMDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [RZ-CMDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [RZ-CMDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [RZ-CMDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [RZ-CMDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [RZ-CMDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [RZ-CMDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [RZ-CMDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [RZ-CMDB] SET RECOVERY FULL 
GO
ALTER DATABASE [RZ-CMDB] SET  MULTI_USER 
GO
ALTER DATABASE [RZ-CMDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [RZ-CMDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [RZ-CMDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [RZ-CMDB] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [RZ-CMDB] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'RZ-CMDB', N'ON'
GO
USE [RZ-CMDB]
GO
/****** Object:  User [MAP\SQL-RZ-CMDB-RL-Dev-Execute]    Script Date: 30.06.2017 11:54:12 ******/
CREATE USER [MAP\SQL-RZ-CMDB-RL-Dev-Execute] FOR LOGIN [MAP\SQL-RZ-CMDB-RL-Dev-Execute] WITH DEFAULT_SCHEMA=[MAP\SQL-RZ-CMDB-RL-Dev-Execute]
GO
/****** Object:  User [MAP\SQL-RZ-CMDB-RL-Dev-db_owner]    Script Date: 30.06.2017 11:54:12 ******/
CREATE USER [MAP\SQL-RZ-CMDB-RL-Dev-db_owner] FOR LOGIN [MAP\SQL-RZ-CMDB-RL-Dev-db_owner]
GO
/****** Object:  User [MAP\SQL-RZ-CMDB-RL-Dev-db_datawriter]    Script Date: 30.06.2017 11:54:12 ******/
CREATE USER [MAP\SQL-RZ-CMDB-RL-Dev-db_datawriter] FOR LOGIN [MAP\SQL-RZ-CMDB-RL-Dev-db_datawriter]
GO
/****** Object:  User [MAP\SQL-RZ-CMDB-RL-Dev-db_datareader]    Script Date: 30.06.2017 11:54:12 ******/
CREATE USER [MAP\SQL-RZ-CMDB-RL-Dev-db_datareader] FOR LOGIN [MAP\SQL-RZ-CMDB-RL-Dev-db_datareader]
GO
/****** Object:  User [MAP\24330335]    Script Date: 30.06.2017 11:54:12 ******/
CREATE USER [MAP\24330335] FOR LOGIN [MAP\24330335] WITH DEFAULT_SCHEMA=[MAP\24330335]
GO
ALTER ROLE [db_owner] ADD MEMBER [MAP\SQL-RZ-CMDB-RL-Dev-db_owner]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [MAP\SQL-RZ-CMDB-RL-Dev-db_datawriter]
GO
ALTER ROLE [db_datareader] ADD MEMBER [MAP\SQL-RZ-CMDB-RL-Dev-db_datareader]
GO
GRANT CONNECT TO [MAP\SQL-RZ-CMDB-RL-Dev-db_datareader] AS [dbo]
GO
GRANT CONNECT TO [MAP\SQL-RZ-CMDB-RL-Dev-db_datawriter] AS [dbo]
GO
GRANT CONNECT TO [MAP\SQL-RZ-CMDB-RL-Dev-db_owner] AS [dbo]
GO
GRANT EXECUTE TO [MAP\SQL-RZ-CMDB-RL-Dev-Execute] AS [dbo]
GO
/****** Object:  Schema [MAP\24330335]    Script Date: 30.06.2017 11:54:12 ******/
CREATE SCHEMA [MAP\24330335]
GO
/****** Object:  Schema [MAP\SQL-RZ-CMDB-RL-Dev-Execute]    Script Date: 30.06.2017 11:54:12 ******/
CREATE SCHEMA [MAP\SQL-RZ-CMDB-RL-Dev-Execute]
GO
/****** Object:  Table [dbo].[cm_AttributeGroups]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_AttributeGroups](
	[GroupId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_cm_AttributeGroups_GroupId]  DEFAULT (newid()),
	[GroupName] [nvarchar](50) NOT NULL,
 CONSTRAINT [cm_PK_AttributeGroups] PRIMARY KEY CLUSTERED 
(
	[GroupId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_AttributeTypes]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_AttributeTypes](
	[AttributeTypeId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_AttributeTypes_AttributeTypeId]  DEFAULT (newid()),
	[AttributeTypeName] [nvarchar](50) NOT NULL,
 CONSTRAINT [cm_PK_AttributeTypes] PRIMARY KEY CLUSTERED 
(
	[AttributeTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ConfigurationItems]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ConfigurationItems](
	[ItemId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_Table1_ObjId]  DEFAULT (newid()),
	[ItemType] [uniqueidentifier] NOT NULL,
	[ItemName] [nvarchar](50) NOT NULL,
	[ItemCreated] [datetime] NOT NULL CONSTRAINT [DF_cm_ConfigurationItems_ItemCreated]  DEFAULT (getdate()),
	[ItemLastChange] [datetime] NOT NULL CONSTRAINT [DF_cm_ConfigurationItems_ItemLastChange]  DEFAULT (getdate()),
	[ItemVersion] [int] NOT NULL CONSTRAINT [DF_cm_ConfigurationItems_ItemVersion]  DEFAULT ((0)),
 CONSTRAINT [cm_PK_ConfigurationItems] PRIMARY KEY CLUSTERED 
(
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ConfigurationItemsHistory]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ConfigurationItemsHistory](
	[ItemId] [uniqueidentifier] NOT NULL,
	[ItemType] [uniqueidentifier] NOT NULL,
	[ItemTypeName] [nvarchar](50) NOT NULL,
	[ItemOldName] [nvarchar](50) NOT NULL,
	[ItemNewName] [nvarchar](50) NOT NULL,
	[ItemChange] [datetime] NOT NULL,
	[ChangedByToken] [nvarchar](50) NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ConnectionRules]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ConnectionRules](
	[RuleId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_ConnectionRules_RuleId]  DEFAULT (newid()),
	[ItemUpperType] [uniqueidentifier] NOT NULL,
	[ItemLowerType] [uniqueidentifier] NOT NULL,
	[ConnType] [uniqueidentifier] NOT NULL,
	[MaxConnectionsToUpper] [int] NOT NULL CONSTRAINT [DF_ConnectionRules_Mininum]  DEFAULT ((1)),
	[MaxConnectionsToLower] [int] NOT NULL CONSTRAINT [DF_ConnectionRules_Maximum]  DEFAULT ((1)),
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
/****** Object:  Table [dbo].[cm_Connections]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_Connections](
	[ConnId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_Connections_ConnId]  DEFAULT (newid()),
	[ConnUpperItem] [uniqueidentifier] NOT NULL,
	[ConnLowerItem] [uniqueidentifier] NOT NULL,
	[ConnectionRuleId] [uniqueidentifier] NOT NULL,
	[ConnCreated] [datetime] NOT NULL,
 CONSTRAINT [cm_PK_Connections] PRIMARY KEY CLUSTERED 
(
	[ConnId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ConnectionsHistory]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ConnectionsHistory](
	[ConnId] [uniqueidentifier] NOT NULL,
	[ConnType] [uniqueidentifier] NOT NULL,
	[ConnTypeName] [nvarchar](50) NOT NULL,
	[ConnUpperItem] [uniqueidentifier] NOT NULL,
	[ConnLowerItem] [uniqueidentifier] NOT NULL,
	[ConnectionRuleId] [uniqueidentifier] NOT NULL,
	[ConnChange] [datetime] NOT NULL,
	[ConnReason] [nvarchar](50) NOT NULL,
	[ChangedByToken] [nvarchar](50) NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ConnectionTypes]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ConnectionTypes](
	[ConnTypeId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_Table4_TypeId]  DEFAULT (newid()),
	[ConnTypeName] [nvarchar](50) NOT NULL CONSTRAINT [DF_cm_ConnectionTypes_ConnTypeName]  DEFAULT (''),
	[ConnTypeReverseName] [nvarchar](50) NOT NULL CONSTRAINT [DF_cm_ConnectionTypes_ConnTypeReverseNamee]  DEFAULT (''),
 CONSTRAINT [cm_PK_ConnectionTypes] PRIMARY KEY CLUSTERED 
(
	[ConnTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_GroupAttributeTypeMappings]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_GroupAttributeTypeMappings](
	[GroupId] [uniqueidentifier] NOT NULL,
	[AttributeTypeId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [cm_PK_GroupAttributeTypeMappings] PRIMARY KEY CLUSTERED 
(
	[AttributeTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ItemAttributes]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ItemAttributes](
	[AttributeId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_Table7_AttributeId]  DEFAULT (newid()),
	[AttributeTypeId] [uniqueidentifier] NOT NULL,
	[AttributeValue] [nvarchar](100) NOT NULL,
	[AttributeCreated] [datetime] NOT NULL,
	[AttributeLastChange] [datetime] NOT NULL,
	[AttributeVersion] [int] NOT NULL,
 CONSTRAINT [cm_PK_ItemAttributes] PRIMARY KEY CLUSTERED 
(
	[AttributeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [cm_IX_ItemAttributes_ItemAndAttributeType] UNIQUE NONCLUSTERED 
(
	[AttributeTypeId] ASC,
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ItemAttributesHistory]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ItemAttributesHistory](
	[AttributeId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[AttributeTypeId] [uniqueidentifier] NOT NULL,
	[AttributeTypeName] [nvarchar](50) NOT NULL,
	[AttributeOldValue] [nvarchar](100) NOT NULL,
	[AttributeNewValue] [nvarchar](100) NOT NULL,
	[AttributeChange] [datetime] NOT NULL,
	[ChangedByToken] [nvarchar](50) NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ItemLinks]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ItemLinks](
	[LinkId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_ItemLinks_LinkId]  DEFAULT (newid()),
	[ItemId] [uniqueidentifier] NOT NULL,
	[LinkURI] [nvarchar](500) NOT NULL,
	[LinkDescription] [nvarchar](500) NOT NULL,
 CONSTRAINT [cm_PK_ItemLinks] PRIMARY KEY NONCLUSTERED 
(
	[LinkId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ItemTypeAttributeGroupMappings]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ItemTypeAttributeGroupMappings](
	[GroupId] [uniqueidentifier] NOT NULL,
	[ItemTypeId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [cm_PK_ItemTypeAttributeGroupMappings] PRIMARY KEY CLUSTERED 
(
	[GroupId] ASC,
	[ItemTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_ItemTypes]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_ItemTypes](
	[TypeId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_ItemTypes_TypeId]  DEFAULT (newid()),
	[TypeName] [nvarchar](50) NOT NULL,
	[TypeBackColor] [nchar](7) NOT NULL,
 CONSTRAINT [cm_PK_ItemTypes] PRIMARY KEY CLUSTERED 
(
	[TypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[cm_Responsibility]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  Table [dbo].[cm_Roles]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cm_Roles](
	[Token] [nvarchar](50) NOT NULL,
	[IsGroup] [bit] NOT NULL CONSTRAINT [DF_cm_Roles_Group]  DEFAULT ((0)),
	[Role] [int] NOT NULL,
 CONSTRAINT [cm_PK_Roles] PRIMARY KEY CLUSTERED 
(
	[Token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_AttributeGroups_Name]    Script Date: 30.06.2017 11:54:12 ******/
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_AttributeGroups_Name] ON [dbo].[cm_AttributeGroups]
(
	[GroupName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_AttributeTypes_Name]    Script Date: 30.06.2017 11:54:12 ******/
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_AttributeTypes_Name] ON [dbo].[cm_AttributeTypes]
(
	[AttributeTypeName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ConfigurationItems_ItemType]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConfigurationItems_ItemType] ON [dbo].[cm_ConfigurationItems]
(
	[ItemType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_ConfigurationItems_Name]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConfigurationItems_Name] ON [dbo].[cm_ConfigurationItems]
(
	[ItemName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_ConfigurationItems_NameAndTypeUnique]    Script Date: 30.06.2017 11:54:12 ******/
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_ConfigurationItems_NameAndTypeUnique] ON [dbo].[cm_ConfigurationItems]
(
	[ItemType] ASC,
	[ItemName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ConnectionRules_ConnType]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_ConnType] ON [dbo].[cm_ConnectionRules]
(
	[ConnType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ConnectionRules_LowerType]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_LowerType] ON [dbo].[cm_ConnectionRules]
(
	[ItemLowerType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ConnectionRules_LowerTypeAndConnection]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_LowerTypeAndConnection] ON [dbo].[cm_ConnectionRules]
(
	[ItemLowerType] ASC,
	[ConnType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ConnectionRules_UpperType]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_UpperType] ON [dbo].[cm_ConnectionRules]
(
	[ItemUpperType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ConnectionRules_UpperTypeAndConnection]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionRules_UpperTypeAndConnection] ON [dbo].[cm_ConnectionRules]
(
	[ItemUpperType] ASC,
	[ConnType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_Connections_LowerItem]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_Connections_LowerItem] ON [dbo].[cm_Connections]
(
	[ConnLowerItem] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_Connections_RuleId]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_Connections_RuleId] ON [dbo].[cm_Connections]
(
	[ConnectionRuleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_Connections_UpperItem]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_Connections_UpperItem] ON [dbo].[cm_Connections]
(
	[ConnUpperItem] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_ConnectionTypes_Name]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionTypes_Name] ON [dbo].[cm_ConnectionTypes]
(
	[ConnTypeName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_ConnectionTypes_ReverseName]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ConnectionTypes_ReverseName] ON [dbo].[cm_ConnectionTypes]
(
	[ConnTypeReverseName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_GroupAttributeTypeMappings_Group]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_GroupAttributeTypeMappings_Group] ON [dbo].[cm_GroupAttributeTypeMappings]
(
	[GroupId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ItemAttributes_Item]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ItemAttributes_Item] ON [dbo].[cm_ItemAttributes]
(
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ItemAttributes_Type]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ItemAttributes_Type] ON [dbo].[cm_ItemAttributes]
(
	[AttributeTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_ItemAttributes_Value]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ItemAttributes_Value] ON [dbo].[cm_ItemAttributes]
(
	[AttributeValue] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ItemLinks_Item]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ItemLinks_Item] ON [dbo].[cm_ItemLinks]
(
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ItemTypeAttributeGroupMappings_Group]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ItemTypeAttributeGroupMappings_Group] ON [dbo].[cm_ItemTypeAttributeGroupMappings]
(
	[GroupId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_ItemTypeAttributeGroupMappings_ItemType]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_ItemTypeAttributeGroupMappings_ItemType] ON [dbo].[cm_ItemTypeAttributeGroupMappings]
(
	[ItemTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_ItemTypes_Name]    Script Date: 30.06.2017 11:54:12 ******/
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_ItemTypes_Name] ON [dbo].[cm_ItemTypes]
(
	[TypeName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_Responsibility_Item]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_Responsibility_Item] ON [dbo].[cm_Responsibility]
(
	[ItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_Responsibility_Token]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_Responsibility_Token] ON [dbo].[cm_Responsibility]
(
	[ResponsibleToken] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_Roles_IsGroup]    Script Date: 30.06.2017 11:54:12 ******/
CREATE NONCLUSTERED INDEX [cm_IX_Roles_IsGroup] ON [dbo].[cm_Roles]
(
	[IsGroup] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [cm_IX_Roles_Role]    Script Date: 30.06.2017 11:54:12 ******/
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_Roles_Role] ON [dbo].[cm_Roles]
(
	[Role] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [cm_IX_Roles_Token]    Script Date: 30.06.2017 11:54:12 ******/
CREATE UNIQUE NONCLUSTERED INDEX [cm_IX_Roles_Token] ON [dbo].[cm_Roles]
(
	[Token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[cm_ConfigurationItems]  WITH CHECK ADD  CONSTRAINT [cm_FK_ConfigurationItems_ItemTypes] FOREIGN KEY([ItemType])
REFERENCES [dbo].[cm_ItemTypes] ([TypeId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[cm_ConfigurationItems] CHECK CONSTRAINT [cm_FK_ConfigurationItems_ItemTypes]
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
ALTER TABLE [dbo].[cm_GroupAttributeTypeMappings]  WITH CHECK ADD  CONSTRAINT [cm_FK_ClassAttributes_AttributeClasses] FOREIGN KEY([GroupId])
REFERENCES [dbo].[cm_AttributeGroups] ([GroupId])
GO
ALTER TABLE [dbo].[cm_GroupAttributeTypeMappings] CHECK CONSTRAINT [cm_FK_ClassAttributes_AttributeClasses]
GO
ALTER TABLE [dbo].[cm_GroupAttributeTypeMappings]  WITH CHECK ADD  CONSTRAINT [cm_FK_ClassAttributes_AttributeTypes] FOREIGN KEY([AttributeTypeId])
REFERENCES [dbo].[cm_AttributeTypes] ([AttributeTypeId])
GO
ALTER TABLE [dbo].[cm_GroupAttributeTypeMappings] CHECK CONSTRAINT [cm_FK_ClassAttributes_AttributeTypes]
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
ALTER TABLE [dbo].[cm_ItemLinks]  WITH CHECK ADD  CONSTRAINT [cm_FK_ItemLinks_ConfigurationItems] FOREIGN KEY([ItemId])
REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
GO
ALTER TABLE [dbo].[cm_ItemLinks] CHECK CONSTRAINT [cm_FK_ItemLinks_ConfigurationItems]
GO
ALTER TABLE [dbo].[cm_ItemTypeAttributeGroupMappings]  WITH CHECK ADD  CONSTRAINT [cm_FK_ItemTypeAttributeGroupMappings_AttributeGroups] FOREIGN KEY([GroupId])
REFERENCES [dbo].[cm_AttributeGroups] ([GroupId])
GO
ALTER TABLE [dbo].[cm_ItemTypeAttributeGroupMappings] CHECK CONSTRAINT [cm_FK_ItemTypeAttributeGroupMappings_AttributeGroups]
GO
ALTER TABLE [dbo].[cm_ItemTypeAttributeGroupMappings]  WITH CHECK ADD  CONSTRAINT [cm_FK_ItemTypeAttributeGroupMappings_ConfigurationItems] FOREIGN KEY([ItemTypeId])
REFERENCES [dbo].[cm_ItemTypes] ([TypeId])
GO
ALTER TABLE [dbo].[cm_ItemTypeAttributeGroupMappings] CHECK CONSTRAINT [cm_FK_ItemTypeAttributeGroupMappings_ConfigurationItems]
GO
ALTER TABLE [dbo].[cm_Responsibility]  WITH CHECK ADD  CONSTRAINT [cm_FK_Responsibility_ConfigurationItems] FOREIGN KEY([ItemId])
REFERENCES [dbo].[cm_ConfigurationItems] ([ItemId])
GO
ALTER TABLE [dbo].[cm_Responsibility] CHECK CONSTRAINT [cm_FK_Responsibility_ConfigurationItems]
GO
ALTER TABLE [dbo].[cm_ConnectionRules]  WITH CHECK ADD  CONSTRAINT [cm_ConnectionRules_ConnectionsGreaterZero] CHECK  (([MaxConnectionsToUpper]>(0) AND [MaxConnectionsToLower]>(0)))
GO
ALTER TABLE [dbo].[cm_ConnectionRules] CHECK CONSTRAINT [cm_ConnectionRules_ConnectionsGreaterZero]
GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeGroups_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_AttributeGroups_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	
GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeGroups_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, GroupName
FROM         cm_AttributeGroups
ORDER BY GroupName ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeGroups_SelectAssignedToItem]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectAssignedToItem]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     *
	FROM    cm_AttributeGroups
	WHERE	GroupId IN (SELECT GroupId FROM cm_ItemTypeAttributeGroupMappings WHERE ItemTypeId = @ItemTypeId)
	ORDER BY GroupName ASC;

GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeGroups_SelectByName]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectByName]
(
	@GroupName nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, GroupName
FROM         cm_AttributeGroups
WHERE GroupName = @GroupName



GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeGroups_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectOne]
(
	@GroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, GroupName
FROM         cm_AttributeGroups
WHERE GroupId = @GroupId


GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeGroups_SelectUnassignedToItem]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_AttributeGroups_SelectUnassignedToItem]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     *
	FROM    cm_AttributeGroups
	WHERE	GroupId NOT IN (SELECT GroupId FROM cm_ItemTypeAttributeGroupMappings WHERE ItemTypeId = @ItemTypeId)
	ORDER BY GroupName ASC;


GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeGroups_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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

GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	
GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     AttributeTypeId, AttributeTypeName
FROM         cm_AttributeTypes
ORDER BY AttributeTypeName ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_SelectByCorrespondingAttributeValuesForType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectByCorrespondingAttributeValuesForType] 
(
	@AttributeTypeId uniqueidentifier
)
AS
BEGIN
    -- Liefert zu einem Attributtyp diejenigen Attributtypen zurück, für die bei allen Configuration Items der Wert identisch ist zum jeweiligen Wert des angegebenen Attributs
	SET NOCOUNT ON;

	DECLARE @AttributeValue nvarchar(50);
	-- Hilfstabellen
	DECLARE @TempTable TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @TempTable1 TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @TempTable2 TABLE (AttributeTypeId uniqueidentifier)
	DECLARE @FlagFirstRun bit;

	-- Der erste Lauf muss anders behandelt werden
	SELECT @FlagFirstRun = 1;

	-- Cursor für den Attributwert
	DECLARE itemAttributesCursor CURSOR FOR
		SELECT    DISTINCT AttributeValue FROM cm_ItemAttributes WHERE AttributeTypeId = @AttributeTypeId
		FOR READ ONLY;

	OPEN itemAttributesCursor;

	FETCH NEXT FROM itemAttributesCursor
		INTO @AttributeValue

	WHILE @@FETCH_STATUS = 0
	BEGIN
		-- Liest alle Attributtypen aus, die zu dem aktuellen Wert genau einen Wert über alle Attribute besitzen
		INSERT INTO @TempTable1 
			SELECT  AttributeTypeId FROM cm_ItemAttributes 
				WHERE ItemId IN (SELECT ItemId FROM cm_ItemAttributes  WHERE AttributeTypeId = @AttributeTypeId AND AttributeValue = @AttributeValue) 
				AND AttributeValue <> @AttributeValue
				GROUP BY AttributeTypeId
				HAVING COUNT(DISTINCT AttributeValue) = 1;

		-- Mit den Hilfstabellen wird dafür gesorgt, dass Wert für Wert immer nur die Attributtypen übrig bleiben, bei denen für alle Werte die Gleichheit besteht
		IF @FlagFirstRun = 1
			BEGIN
				SELECT @FlagFirstRun = 0;
				INSERT INTO @TempTable
					SELECT AttributeTypeId FROM @TempTable1;
			END
		ELSE
			BEGIN
				-- Lagert zuerst TempTable nach TempTable2 um, um dann TempTable aus der Schnittmenge zwischen TempTable1 und TempTable2 neu zu bilden
				INSERT INTO @TempTable2
					SELECT AttributeTypeId FROM @TempTable;
				DELETE FROM @TempTable;
				INSERT INTO @TempTable
					SELECT AttributeTypeId FROM @TempTable1
						INTERSECT SELECT AttributeTypeId FROM @TempTable2;
				DELETE FROM @TempTable2
			END
		DELETE FROM @TempTable1;
		FETCH NEXT FROM itemAttributesCursor
			INTO @AttributeValue;
	END
		
	CLOSE itemAttributesCursor;
	DEALLOCATE itemAttributesCursor;

	-- Gibt alle übriggebliebenen Attributwerte zurück
	SELECT     AttributeTypeId, AttributeTypeName
		FROM         cm_AttributeTypes
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM @TempTable)
		ORDER BY AttributeTypeName ASC;
END




GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_SelectByName]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectByName] 
(
	@AttributeTypeName nvarchar(50)
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeName = @AttributeTypeName
END




GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_SelectForItemType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectForItemType] 
(
	@ItemTypeId uniqueidentifier
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT dbo.cm_AttributeTypes.AttributeTypeId, dbo.cm_AttributeTypes.AttributeTypeName
		FROM dbo.cm_AttributeTypes INNER JOIN
             dbo.cm_GroupAttributeTypeMappings ON dbo.cm_AttributeTypes.AttributeTypeId = dbo.cm_GroupAttributeTypeMappings.AttributeTypeId INNER JOIN
             dbo.cm_ItemTypeAttributeGroupMappings ON dbo.cm_GroupAttributeTypeMappings.GroupId = dbo.cm_ItemTypeAttributeGroupMappings.GroupId
		WHERE (dbo.cm_ItemTypeAttributeGroupMappings.ItemTypeId = @ItemTypeId)
		ORDER BY AttributeTypeName;
END

GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_SelectGroupedByGroup]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectGroupedByGroup] 
(
	@GroupId uniqueidentifier
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings WHERE GroupId = @GroupId)
		ORDER BY AttributeTypeName ASC;
END


GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectOne] 
(
	@AttributeTypeId uniqueidentifier
)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeId = @AttributeTypeId
END



GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_SelectUngrouped]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_AttributeTypes_SelectUngrouped] 

AS
BEGIN
	SET NOCOUNT ON;

	SELECT * FROM cm_AttributeTypes 
		WHERE AttributeTypeId NOT IN (SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings)
		ORDER BY AttributeTypeName ASC;
END


GO
/****** Object:  StoredProcedure [dbo].[cm_AttributeTypes_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	

GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
			SELECT ItemId, ItemType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType), ItemName, '<deleted>', CURRENT_TIMESTAMP, @ChangedByToken 
				FROM [dbo].[cm_ConfigurationItems]
				WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange) AND ([ItemVersion] = @Original_ItemVersion));

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
			@ConnUpperItem uniqueidentifier, 
			@ConnLowerItem uniqueidentifier, 
			@ConnRuleId uniqueidentifier,
			@ConnCreated datetime;

		DECLARE connectionsCursor CURSOR FOR
			SELECT     ConnId, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated
				FROM       cm_Connections
				WHERE ConnUpperItem = @Original_ItemId OR ConnLowerItem = @Original_ItemId
			FOR READ ONLY;

		OPEN connectionsCursor;

		FETCH NEXT FROM connectionsCursor
			INTO @ConnId, @ConnUpperItem, @ConnLowerItem, @ConnRuleId, @ConnCreated;

		WHILE @@FETCH_STATUS = 0
		BEGIN
			EXEC cm_Connections_Delete @ConnId, @ConnUpperItem, @ConnLowerItem, @ConnRuleId, @ConnCreated, @ChangedByToken;
			FETCH NEXT FROM connectionsCursor
				INTO @ConnId, @ConnUpperItem, @ConnLowerItem, @ConnRuleId, @ConnCreated;
		END

		CLOSE connectionsCursor;
		DEALLOCATE connectionsCursor;

		-- Links löschen
		DELETE FROM [cm_ItemLinks]
			WHERE ItemId = @Original_ItemId;

		-- Verantwortlichkeiten löschen
		DELETE [cm_Responsibility] 
			WHERE ItemId = @Original_ItemId;

		-- ItemLastChange wurde durch das Löschen der Attribute verändert
		SELECT @Original_ItemLastChange = [ItemLastChange] FROM cm_ConfigurationItems WHERE [ItemId] = @Original_ItemId AND [ItemName] = @Original_ItemName AND ItemVersion = @Original_ItemVersion;

		-- Item löschen
		DELETE FROM [cm_ConfigurationItems] 
			WHERE (([ItemId] = @Original_ItemId) AND ([ItemType] = @Original_ItemType) AND ([ItemName] = @Original_ItemName) 
			AND ([ItemCreated] = @Original_ItemCreated) AND ([ItemLastChange] = @Original_ItemLastChange) 
			AND ([ItemVersion] = @Original_ItemVersion));

	COMMIT TRANSACTION;

GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_GetCountForConnectedItems]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[cm_ConfigurationItems_GetCountForConnectedItems]
	@ItemId uniqueidentifier,
	@ConnType uniqueidentifier, 
	@TargetItemTypeId uniqueidentifier
AS	 
BEGIN
	SET NOCOUNT ON;
	SELECT Count (ItemId) FROM cm_ConfigurationItems WHERE ItemType = @TargetItemTypeId AND (ItemId IN (
		SELECT ConnLowerItem FROM cm_Connections WHERE ConnUpperItem = @ItemId AND ConnType = @ConnType));
END

GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_GetCountForItemType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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

-- History füllen
	INSERT INTO [dbo].[cm_ConfigurationItemsHistory] VALUES (@ItemId, @ItemType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = @ItemType), '<created>', @ItemName, CURRENT_TIMESTAMP, @ChangedByToken)

	INSERT INTO [cm_ConfigurationItems] ([ItemId], [ItemType], [ItemName], [ItemCreated], [ItemLastChange], [ItemVersion]) 
		VALUES (@ItemId, @ItemType, @ItemName, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

	INSERT INTO cm_Responsibility (ItemId, ResponsibleToken)
		VALUES (@ItemId, @ChangedByToken);
	

GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConfigurationItems_Select]
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
ORDER BY ItemName ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_SelectByItemType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_SelectByItemTypeAndName]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectByItemTypeAndName]
(
	@ItemType uniqueidentifier,
	@ItemName nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
	FROM         cm_ConfigurationItems
	WHERE ItemType = @ItemType AND ItemName = @ItemName



GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_SelectItemsByItemAndConnectionRule]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConfigurationItems_SelectOne]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemName, ItemCreated, ItemLastChange, ItemVersion, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName
FROM         cm_ConfigurationItems
WHERE ItemId = @ItemId



GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItems_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
-- History füllen
INSERT INTO [dbo].[cm_ConfigurationItemsHistory] 
	SELECT ItemId, ItemType, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType), ItemName, @ItemName, CURRENT_TIMESTAMP, @ChangedByToken 
		FROM [dbo].[cm_ConfigurationItems]
		WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange) AND ([ItemVersion] = @Original_ItemVersion));

UPDATE [cm_ConfigurationItems] SET [ItemType] = @ItemType, [ItemName] = @ItemName, [ItemLastChange] = CURRENT_TIMESTAMP, [ItemVersion] = @Original_ItemVersion + 1
	WHERE (([ItemId] = @Original_ItemId) AND ([ItemLastChange] = @Original_ItemLastChange) AND ([ItemVersion] = @Original_ItemVersion));
	

GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItemsHistory_SelectDeleted]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConfigurationItemsHistory_SelectDeleted]
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemTypeName, ItemOldName, ItemNewName, ItemChange, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName, ChangedByToken
	FROM         cm_ConfigurationItemsHistory
	WHERE ItemNewName = '<deleted>' OR ItemId NOT IN (SELECT ItemId FROM cm_ConfigurationItems)
	ORDER BY ItemOldName ASC


GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItemsHistory_SelectItemById]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConfigurationItemsHistory_SelectItemById]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ItemType, ItemTypeName, ItemOldName, ItemNewName, ItemChange, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName, ChangedByToken
	FROM         cm_ConfigurationItemsHistory
	WHERE ItemId = @ItemId
	ORDER BY ItemChange DESC


GO
/****** Object:  StoredProcedure [dbo].[cm_ConfigurationItemsHistory_SelectItemByName]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConfigurationItemsHistory_SelectItemByName]
(
	@Name nvarchar(50)
)
AS
	SET NOCOUNT ON;

SELECT @Name = '%' + @Name + '%';
SELECT     ItemId, ItemType, ItemTypeName, ItemOldName, ItemNewName, ItemChange, (SELECT TypeName FROM cm_ItemTypes WHERE TypeId = ItemType) AS TypeName, ChangedByToken
	FROM         cm_ConfigurationItemsHistory
	WHERE ItemOldName LIKE @Name OR ItemNewName LIKE @Name OR ItemTypeName LIKE @Name
	ORDER BY ItemChange DESC


GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_Delete]
(
	@Original_RuleId uniqueidentifier,
	@Original_ItemUpperType uniqueidentifier,
	@Original_ItemLowerType uniqueidentifier,
	@Original_ConnType uniqueidentifier,
	@Original_MaxConnectionsToUpper int,
	@Original_MaxConnectionsToLower int
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ConnectionRules] WHERE (([RuleId] = @Original_RuleId) AND ([ItemUpperType] = @Original_ItemUpperType) AND ([ItemLowerType] = @Original_ItemLowerType) AND ([ConnType] = @Original_ConnType) AND ([MaxConnectionsToUpper] = @Original_MaxConnectionsToUpper) AND ([MaxConnectionsToLower] = @Original_MaxConnectionsToLower))

GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_Insert]
(
	@RuleId uniqueidentifier,
	@ItemUpperType uniqueidentifier,
	@ItemLowerType uniqueidentifier,
	@ConnType uniqueidentifier,
	@MaxConnectionsToUpper int,
	@MaxConnectionsToLower int
)
AS
	SET NOCOUNT OFF;
IF @RuleId IS NULL
	SELECT @RuleId = NEWID();

INSERT INTO [cm_ConnectionRules] ([RuleId], [ItemUpperType], [ItemLowerType], [ConnType], [MaxConnectionsToUpper], [MaxConnectionsToLower]) VALUES (@RuleId, @ItemUpperType, @ItemLowerType, @ConnType, @MaxConnectionsToUpper, @MaxConnectionsToLower);

GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_Select]
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower
FROM         cm_ConnectionRules
ORDER BY ItemUpperType ASC, ItemLowerType ASC, ConnType ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_SelectByItemLowerType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectByItemLowerType]
(
	@ItemLowerTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower
FROM         cm_ConnectionRules
WHERE ItemLowerType = @ItemLowerTypeId
ORDER BY ConnType ASC, ItemUpperType ASC


GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_SelectByItemTypes]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectByItemTypes]
(
	@ItemUpperType uniqueidentifier,
	@ItemLowerType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower
FROM         cm_ConnectionRules
	WHERE ItemUpperType = @ItemUpperType
		AND ItemLowerType = @ItemLowerType;




GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_SelectByItemUpperType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectByItemUpperType]
(
	@ItemUpperTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower
FROM         cm_ConnectionRules
WHERE ItemUpperType = @ItemUpperTypeId
ORDER BY ConnType ASC, ItemLowerType ASC


GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectOne]
(
	@RuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower
FROM         cm_ConnectionRules
WHERE RuleId = @RuleId



GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_SelectOneByContent]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConnectionRules_SelectOneByContent]
(
	@ItemUpperType uniqueidentifier,
	@ItemLowerType uniqueidentifier,
	@ConnType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     RuleId, ItemUpperType, ItemLowerType, ConnType, MaxConnectionsToUpper, MaxConnectionsToLower
FROM         cm_ConnectionRules
	WHERE ItemUpperType = @ItemUpperType
		AND ItemLowerType = @ItemLowerType
		AND ConnType = @ConnType;



GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionRules_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConnectionRules_Update]
(
	@MaxConnectionsToUpper int,
	@MaxConnectionsToLower int,
	@Original_RuleId uniqueidentifier,
	@Original_ItemUpperType uniqueidentifier,
	@Original_ItemLowerType uniqueidentifier,
	@Original_ConnType uniqueidentifier,
	@Original_MaxConnectionsToUpper int,
	@Original_MaxConnectionsToLower int
)
AS
	SET NOCOUNT OFF;
UPDATE [cm_ConnectionRules] SET [MaxConnectionsToUpper] = @MaxConnectionsToUpper, [MaxConnectionsToLower] = @MaxConnectionsToLower WHERE (([RuleId] = @Original_RuleId) AND ([ItemUpperType] = @Original_ItemUpperType) AND ([ItemLowerType] = @Original_ItemLowerType) AND ([ConnType] = @Original_ConnType) AND ([MaxConnectionsToUpper] = @Original_MaxConnectionsToUpper) AND ([MaxConnectionsToLower] = @Original_MaxConnectionsToLower));
	

GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Connections_Delete]
(
	@Original_ConnId uniqueidentifier,
	@Original_ConnUpperItem uniqueidentifier,
	@Original_ConnLowerItem uniqueidentifier,
	@Original_ConnectionRuleId uniqueidentifier,
	@Original_ConnCreated datetime,
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;

DECLARE 	@Original_ConnType uniqueidentifier;

SELECT @Original_ConnType = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = @Original_ConnectionRuleId);


--History füllen
INSERT INTO cm_ConnectionsHistory
	SELECT ConnId, @Original_ConnType, (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE 
		ConnTypeId = @Original_ConnType), ConnUpperItem, ConnLowerItem, ConnectionRuleId, CURRENT_TIMESTAMP, '<deleted>', @ChangedByToken FROM cm_Connections 
			WHERE ([ConnId] = @Original_ConnId) AND ([ConnUpperItem] = @Original_ConnUpperItem) AND ([ConnLowerItem] = @Original_ConnLowerItem) AND ([ConnectionRuleId] = @Original_ConnectionRuleId) 
			AND ([ConnCreated] = @Original_ConnCreated);


DELETE FROM [cm_Connections] WHERE ([ConnId] = @Original_ConnId) AND ([ConnUpperItem] = @Original_ConnUpperItem) AND ([ConnLowerItem] = @Original_ConnLowerItem) AND ([ConnectionRuleId] = @Original_ConnectionRuleId)
	 AND ([ConnCreated] = @Original_ConnCreated);
	

GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_GetCountForConnectionType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_Connections_GetCountForRule]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Connections_GetCountForRule]
(
	@RuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;

SELECT COUNT([ConnId])
  FROM [dbo].[cm_Connections]
	WHERE ConnectionRuleID = @RuleId;



GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Connections_Insert]
(
	@ConnId uniqueidentifier,
	@ConnUpperItem uniqueidentifier,
	@ConnLowerItem uniqueidentifier,
	@ConnectionRuleId uniqueidentifier,
	@ChangedByToken [nvarchar](50)
)
AS
	SET NOCOUNT OFF;

IF @ConnId IS NULL
	SELECT @ConnId = NEWID();

DECLARE 	@ConnType uniqueidentifier;

SELECT @ConnType = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = @ConnectionRuleId);

-- History füllen
INSERT INTO cm_ConnectionsHistory 
	VALUES (@ConnId, @ConnType, (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = @ConnType), @ConnUpperItem, @ConnLowerItem, @ConnectionRuleId, CURRENT_TIMESTAMP, '<created>', @ChangedByToken)

INSERT INTO [cm_Connections] ([ConnId], [ConnUpperItem], [ConnLowerItem], [ConnectionRuleId], [ConnCreated]) 
	VALUES (@ConnId, @ConnUpperItem, @ConnLowerItem, @ConnectionRuleId, CURRENT_TIMESTAMP);
	

GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Connections_Select]
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated
FROM         cm_Connections
ORDER BY ConnType ASC, ConnUpperItem ASC, ConnLowerItem ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_SelectConnectionsToLowerForItemId]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Connections_SelectConnectionsToLowerForItemId]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated
FROM         cm_Connections
WHERE ConnUpperItem = @ItemId
ORDER BY (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId)) + ' - ' +  
		(SELECT TypeName FROM cm_ItemTypes WHERE TypeId = (SELECT ItemType From cm_ConfigurationItems WHERE ItemId = ConnLowerItem)) + ': ' +
		(SELECT ItemName From cm_ConfigurationItems WHERE ItemId = ConnLowerItem) ASC


GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_SelectConnectionsToUpperForItemId]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Connections_SelectConnectionsToUpperForItemId]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated
FROM         cm_Connections
WHERE ConnLowerItem = @ItemId
ORDER BY (SELECT ConnTypeReverseName FROM cm_ConnectionTypes WHERE ConnTypeId = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId)) + ' - ' +  
		(SELECT TypeName FROM cm_ItemTypes WHERE TypeId = (SELECT ItemType From cm_ConfigurationItems WHERE ItemId = ConnUpperItem)) + ': ' +
		(SELECT ItemName From cm_ConfigurationItems WHERE ItemId = ConnUpperItem) ASC


GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_SelectForLowerItemAndRule]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_Connections_SelectForLowerItemAndRule]
(
	@LowerItemId uniqueidentifier,
	@RuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated
FROM         cm_Connections
WHERE ConnLowerItem = @LowerItemId AND ConnectionRuleId = @RuleId
ORDER BY (SELECT ConnTypeReverseName FROM cm_ConnectionTypes WHERE ConnTypeId = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId)) + ' - ' +  
		(SELECT TypeName FROM cm_ItemTypes WHERE TypeId = (SELECT ItemType From cm_ConfigurationItems WHERE ItemId = ConnUpperItem)) + ': ' +
		(SELECT ItemName From cm_ConfigurationItems WHERE ItemId = ConnUpperItem) ASC



GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_SelectForUpperItemAndRule]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_Connections_SelectForUpperItemAndRule]
(
	@UpperItemId uniqueidentifier,
	@RuleId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated
FROM         cm_Connections
WHERE ConnUpperItem = @UpperItemId AND ConnectionRuleId = @RuleId
ORDER BY (SELECT ConnTypeName FROM cm_ConnectionTypes WHERE ConnTypeId = (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId)) + ' - ' +  
		(SELECT TypeName FROM cm_ItemTypes WHERE TypeId = (SELECT ItemType From cm_ConfigurationItems WHERE ItemId = ConnLowerItem)) + ': ' +
		(SELECT ItemName From cm_ConfigurationItems WHERE ItemId = ConnLowerItem) ASC



GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_Connections_SelectOne]
(
	@ConnId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated
FROM         cm_Connections
WHERE ConnId = @ConnId



GO
/****** Object:  StoredProcedure [dbo].[cm_Connections_SelectOneByContent]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_Connections_SelectOneByContent]
(
	@UpperItemId uniqueidentifier,
	@LowerItemId uniqueidentifier,
	@ConnType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnId, (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) AS ConnType, ConnUpperItem, ConnLowerItem, ConnectionRuleId, ConnCreated
FROM         cm_Connections
WHERE ConnUpperItem = @UpperItemId AND (SELECT ConnType FROM cm_ConnectionRules WHERE RuleId = ConnectionRuleId) = @ConnType AND ConnLowerItem = @LowerItemId


GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
ORDER BY ConnTypeName ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_SelectAllowedDownwardByItem]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_SelectAllowedUpwardByItem]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
ORDER BY ConnTypeReverseName ASC


GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_SelectDownwardByItemType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectDownwardByItemType]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
	WHERE	(ConnTypeId IN (SELECT ConnType FROM cm_ConnectionRules 
		WHERE ItemUpperType = @ItemTypeId))
ORDER BY ConnTypeName ASC



GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectOne]
(
	@ConnTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
WHERE ConnTypeId = @ConnTypeId;


GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_SelectUpwardByItemType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ConnectionTypes_SelectUpwardByItemType]
(
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ConnTypeId, ConnTypeName, ConnTypeReverseName
FROM         cm_ConnectionTypes
	WHERE	(ConnTypeId IN (SELECT ConnType FROM cm_ConnectionRules 
		WHERE ItemLowerType = @ItemTypeId))
ORDER BY ConnTypeReverseName ASC



GO
/****** Object:  StoredProcedure [dbo].[cm_ConnectionTypes_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	

GO
/****** Object:  StoredProcedure [dbo].[cm_GroupAttributeTypeMappings_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_Delete]
(
	@Original_GroupId uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_GroupAttributeTypeMappings] WHERE (([GroupId] = @Original_GroupId) AND ([AttributeTypeId] = @Original_AttributeTypeId))

GO
/****** Object:  StoredProcedure [dbo].[cm_GroupAttributeTypeMappings_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_Insert]
(
	@GroupId uniqueidentifier,
	@AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
IF @GroupId IS NULL
	SELECT @GroupId = NEWID();

INSERT INTO [cm_GroupAttributeTypeMappings] ([GroupId], [AttributeTypeId]) VALUES (@GroupId, @AttributeTypeId);
	

GO
/****** Object:  StoredProcedure [dbo].[cm_GroupAttributeTypeMappings_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, AttributeTypeId
FROM         [cm_GroupAttributeTypeMappings]
ORDER BY GroupId ASC, AttributeTypeId ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_GroupAttributeTypeMappings_SelectByAttributeType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_SelectByAttributeType]
(
	@AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, AttributeTypeId
	FROM         [cm_GroupAttributeTypeMappings]
	WHERE AttributeTypeId = @AttributeTypeId


GO
/****** Object:  StoredProcedure [dbo].[cm_GroupAttributeTypeMappings_SelectByGroup]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_SelectByGroup]
(
	@GroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, AttributeTypeId
	FROM         [cm_GroupAttributeTypeMappings]
	WHERE GroupId = @GroupId


GO
/****** Object:  StoredProcedure [dbo].[cm_GroupAttributeTypeMappings_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_GroupAttributeTypeMappings_Update]
(
	@GroupId uniqueidentifier,
	@Original_GroupId uniqueidentifier,
	@Original_AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;

-- Fügt zuerst die Mappings hinzu, die ggf. noch benötigt werden, um die Attribute zu transferieren
INSERT INTO cm_ItemTypeAttributeGroupMappings (ItemTypeId, GroupId)
	SELECT ItemTypeId, @GroupId FROM cm_ItemTypeAttributeGroupMappings
		WHERE GroupId = @Original_GroupId AND ItemTypeId NOT IN 
			(SELECT ItemTypeId FROM cm_ItemTypeAttributeGroupMappings WHERE GroupId = @GroupId);

UPDATE [cm_GroupAttributeTypeMappings] SET [GroupId] = @GroupId WHERE (([GroupId] = @Original_GroupId) AND ([AttributeTypeId] = @Original_AttributeTypeId))


GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
			AttributeValue, '<deleted>', CURRENT_TIMESTAMP, @ChangedByToken FROM cm_ItemAttributes
		WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange) AND ([AttributeVersion] = @Original_AttributeVersion));

-- Configuration Item aktualisieren
UPDATE [cm_ConfigurationItems] SET [ItemLastChange] = CURRENT_TIMESTAMP WHERE [ItemId] = @Original_ItemId;

DELETE FROM [cm_ItemAttributes] WHERE (([AttributeId] = @Original_AttributeId) AND ([ItemId] = @Original_ItemId) AND ([AttributeTypeId] = @Original_AttributeTypeId) 
	AND ([AttributeValue] = @Original_AttributeValue) AND ([AttributeCreated] = @Original_AttributeCreated) AND ([AttributeLastChange] = @Original_AttributeLastChange) 
	AND ([AttributeVersion] = @Original_AttributeVersion))

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_DeleteByAttributeGroupAndItemType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
			SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings
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
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_GetCountForAttributeGroup]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_GetCountForAttributeGroup]
(
	@AttributeGroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(AttributeId)
FROM         cm_ItemAttributes
WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings WHERE GroupId = @AttributeGroupId);


GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_GetCountForAttributeGroupAndItemType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
		WHERE AttributeTypeId IN (SELECT AttributeTypeId FROM cm_GroupAttributeTypeMappings WHERE GroupId = @AttributeGroupId)
		AND ItemId IN (SELECT ItemId FROM cm_ConfigurationItems WHERE ItemType = @ItemTypeId);



GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_GetCountForAttributeType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[cm_ItemAttributes_GetCountForAttributeType]
(
	@AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(AttributeId)
	FROM         cm_ItemAttributes
	WHERE AttributeTypeId = @AttributeTypeId;





GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_Insert]
(
	@AttributeId uniqueidentifier,
	@ItemId uniqueidentifier,
	@AttributeTypeId uniqueidentifier,
	@AttributeValue nvarchar(100),
	@ChangedByToken nvarchar(50)
)
AS
	SET NOCOUNT OFF;
	DECLARE @AttributeCreated datetime;
	DECLARE @AttributeLastChange datetime;
	DECLARE @AttributeVersion int;
	IF @AttributeId IS NULL
		SELECT @AttributeId = NEWID();

	SELECT @AttributeCreated = CURRENT_TIMESTAMP, @AttributeLastChange = CURRENT_TIMESTAMP, @AttributeVersion = 0;

-- History füllen
	INSERT INTO cm_ItemAttributesHistory
		VALUES (@AttributeId, @ItemId, @AttributeTypeId, (SELECT [AttributeTypeName] FROM cm_AttributeTypes WHERE AttributeTypeId = @AttributeTypeId), 
			'<created>', @AttributeValue, CURRENT_TIMESTAMP, @ChangedByToken)

	INSERT INTO [cm_ItemAttributes] ([AttributeId], [ItemId], [AttributeTypeId], [AttributeValue], [AttributeCreated], [AttributeLastChange], [AttributeVersion]) VALUES (@AttributeId, @ItemId, @AttributeTypeId, @AttributeValue, @AttributeCreated, @AttributeLastChange, @AttributeVersion);
	
-- Timestamp des Configuration Item füllen
	UPDATE [cm_ConfigurationItems] SET [ItemLastChange] = CURRENT_TIMESTAMP WHERE [ItemId] = @ItemId;
	

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_Select]
AS
	SET NOCOUNT ON;
SELECT     cm_ItemAttributes.AttributeId, cm_ItemAttributes.ItemId, cm_ItemAttributes.AttributeTypeId, cm_ItemAttributes.AttributeValue, cm_ItemAttributes.AttributeCreated, cm_ItemAttributes.AttributeLastChange, cm_ItemAttributes.AttributeVersion, cm_AttributeTypes.AttributeTypeName
FROM         cm_ItemAttributes INNER JOIN cm_AttributeTypes ON cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId

ORDER BY cm_ItemAttributes.ItemId ASC, cm_AttributeTypes.AttributeTypeName ASC, cm_ItemAttributes.AttributeValue ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_SelectByAttributeType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_ItemAttributes_SelectByAttributeType]
(
	@AttributeTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     cm_ItemAttributes.AttributeId, cm_ItemAttributes.ItemId, cm_ItemAttributes.AttributeTypeId, cm_ItemAttributes.AttributeValue, cm_ItemAttributes.AttributeCreated, cm_ItemAttributes.AttributeLastChange, cm_ItemAttributes.AttributeVersion, cm_AttributeTypes.AttributeTypeName
FROM         cm_ItemAttributes INNER JOIN cm_AttributeTypes ON cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId
WHERE cm_ItemAttributes.AttributeTypeId = @AttributeTypeId
ORDER BY AttributeTypeName ASC, AttributeValue ASC




GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_SelectByItem]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_SelectByItemAndType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemAttributes_SelectOne]
(
	@AttributeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     cm_ItemAttributes.AttributeId, cm_ItemAttributes.ItemId, cm_ItemAttributes.AttributeTypeId, cm_ItemAttributes.AttributeValue, cm_ItemAttributes.AttributeCreated, cm_ItemAttributes.AttributeLastChange, cm_ItemAttributes.AttributeVersion, cm_AttributeTypes.AttributeTypeName
FROM         cm_ItemAttributes INNER JOIN cm_AttributeTypes ON cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId
WHERE AttributeId = @AttributeId
ORDER BY AttributeTypeName ASC, AttributeValue ASC


GO
/****** Object:  StoredProcedure [dbo].[cm_ItemAttributes_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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

-- History füllen
INSERT INTO cm_ItemAttributesHistory
	SELECT AttributeId, ItemId, AttributeTypeId, (SELECT [AttributeTypeName] FROM cm_AttributeTypes WHERE cm_AttributeTypes.AttributeTypeId = cm_ItemAttributes.AttributeTypeId), 
			AttributeValue, @AttributeValue, CURRENT_TIMESTAMP, @ChangedByToken FROM cm_ItemAttributes
		WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange) AND ([AttributeVersion] = @Original_AttributeVersion));


UPDATE [cm_ItemAttributes] SET [AttributeValue] = @AttributeValue, [AttributeLastChange] = CURRENT_TIMESTAMP, [AttributeVersion] = [AttributeVersion] + 1 
	WHERE (([AttributeId] = @Original_AttributeId) AND ([AttributeLastChange] = @Original_AttributeLastChange) AND ([AttributeVersion] = @Original_AttributeVersion));

UPDATE [cm_ConfigurationItems] SET [ItemLastChange] = CURRENT_TIMESTAMP WHERE [ItemId] = (SELECT [ItemId] FROM [cm_ItemAttributes] WHERE [AttributeId] = @Original_AttributeId);
	

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemLinks_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ItemLinks_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemLinks_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemLinks_Select]
AS
	SET NOCOUNT ON;
SELECT     LinkId, ItemId, LinkURI, LinkDescription
FROM         cm_ItemLinks


GO
/****** Object:  StoredProcedure [dbo].[cm_ItemLinks_SelectByItem]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ItemLinks_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ItemLinks_SelectOne]
(
	@LinkId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     LinkId, ItemId, LinkURI, LinkDescription
FROM         cm_ItemLinks
WHERE	LinkId = @LinkId;



GO
/****** Object:  StoredProcedure [dbo].[cm_ItemLinks_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypeAttributeGroupMappings_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_Delete]
(
	@Original_GroupId uniqueidentifier,
	@Original_ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
DELETE FROM [cm_ItemTypeAttributeGroupMappings] WHERE (([GroupId] = @Original_GroupId) AND ([ItemTypeId] = @Original_ItemTypeId))

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypeAttributeGroupMappings_GetCountForGroup]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_GetCountForGroup]
(
	@GroupId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(*)
FROM         cm_ItemTypeAttributeGroupMappings
WHERE GroupId = @GroupId



GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypeAttributeGroupMappings_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_Insert]
(
	@GroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT OFF;
INSERT INTO [cm_ItemTypeAttributeGroupMappings] ([GroupId], [ItemTypeId]) VALUES (@GroupId, @ItemTypeId);

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypeAttributeGroupMappings_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_Select]
AS
	SET NOCOUNT ON;
SELECT     GroupId, ItemTypeId
FROM         cm_ItemTypeAttributeGroupMappings
ORDER BY GroupId ASC, ItemTypeId ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypeAttributeGroupMappings_SelectByContent]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ItemTypeAttributeGroupMappings_SelectByContent]
(
	@GroupId uniqueidentifier,
	@ItemTypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     GroupId, ItemTypeId
FROM         cm_ItemTypeAttributeGroupMappings
WHERE GroupId = @GroupId AND ItemTypeId = @ItemTypeId


GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_ItemTypes_Select]
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	ORDER BY TypeName ASC

GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_SelectByAllowedAttributeType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByAllowedAttributeType]
(
	@AttributeType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId IN (SELECT ItemTypeId FROM cm_ItemTypeAttributeGroupMappings
		WHERE GroupId IN (SELECT GroupId FROM cm_GroupAttributeTypeMappings WHERE AttributeTypeId = @AttributeType))
	ORDER BY TypeName ASC;




GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_SelectByConnectionRuleForLowerTypeAndConnType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByConnectionRuleForLowerTypeAndConnType]
(
	@ItemLowerType uniqueidentifier,
	@ConnType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId IN (SELECT ItemUpperType FROM cm_ConnectionRules
		WHERE ItemLowerType = @ItemLowerType AND ConnType = @ConnType)
	ORDER BY TypeName ASC;



GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_SelectByConnectionRuleForUpperTypeAndConnType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByConnectionRuleForUpperTypeAndConnType]
(
	@ItemUpperType uniqueidentifier,
	@ConnType uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId IN (SELECT ItemLowerType FROM cm_ConnectionRules
		WHERE ItemUpperType = @ItemUpperType AND ConnType = @ConnType)
	ORDER BY TypeName ASC;



GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_SelectByName]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectByName]
(
	@TypeName nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeName = @TypeName


GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_SelectOne]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_ItemTypes_SelectOne]
(
	@TypeId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     TypeId, TypeName, TypeBackColor
	FROM         cm_ItemTypes
	WHERE TypeId = @TypeId


GO
/****** Object:  StoredProcedure [dbo].[cm_ItemTypes_Update]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
	

GO
/****** Object:  StoredProcedure [dbo].[cm_Responsibility_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_Responsibility_GetResponsibility]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_Responsibility_GetResponsibility]
(
	@ItemId uniqueidentifier,
	@ResponsibleToken nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT     COUNT(*)
FROM         cm_Responsibility
WHERE ItemId = @ItemId AND ResponsibleToken = @ResponsibleToken


GO
/****** Object:  StoredProcedure [dbo].[cm_Responsibility_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
/****** Object:  StoredProcedure [dbo].[cm_Responsibility_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Responsibility_Select]
AS
	SET NOCOUNT ON;
SELECT     ItemId, ResponsibleToken
FROM         cm_Responsibility

GO
/****** Object:  StoredProcedure [dbo].[cm_Responsibility_SelectForItem]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_Responsibility_SelectForItem]
(
	@ItemId uniqueidentifier
)
AS
	SET NOCOUNT ON;
SELECT     ItemId, ResponsibleToken
FROM         cm_Responsibility
WHERE ItemId = @ItemId


GO
/****** Object:  StoredProcedure [dbo].[cm_Roles_Delete]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Roles_Delete]
(
	@Original_Token nvarchar(50),
	@Original_IsGroup bit,
	@Original_Role int
)
AS
	SET NOCOUNT OFF;
DELETE FROM [dbo].[cm_Roles] WHERE (([Token] = @Original_Token) AND ([IsGroup] = @Original_IsGroup) AND ([Role] = @Original_Role))

GO
/****** Object:  StoredProcedure [dbo].[cm_Roles_GetRoleForToken]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[cm_Roles_GetRoleForToken]
(
	@Token nvarchar(50),
	@IsGroup bit
)
AS
	SET NOCOUNT ON;
SELECT        [Role]
FROM            dbo.cm_Roles
WHERE [Token] = @Token AND IsGroup = @IsGroup;

GO
/****** Object:  StoredProcedure [dbo].[cm_Roles_Insert]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Roles_Insert]
(
	@Token nvarchar(50),
	@IsGroup bit,
	@Role int
)
AS
	SET NOCOUNT OFF;
INSERT INTO [dbo].[cm_Roles] ([Token], [IsGroup], [Role]) VALUES (@Token, @IsGroup, @Role);
	

GO
/****** Object:  StoredProcedure [dbo].[cm_Roles_Select]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[cm_Roles_Select]
AS
	SET NOCOUNT ON;
SELECT        Token, IsGroup, [Role]
FROM            dbo.cm_Roles

GO
/****** Object:  StoredProcedure [dbo].[cm_Roles_SelectByRole]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_Roles_SelectByRole]
(
	@Role int
)
AS
	SET NOCOUNT ON;
SELECT        Token, IsGroup, [Role]
FROM            dbo.cm_Roles
WHERE IsGroup = 1 AND [Role] >= @Role;


GO
/****** Object:  StoredProcedure [dbo].[cm_Roles_SelectByToken]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[cm_Roles_SelectByToken]
(
	@Token nvarchar(50)
)
AS
	SET NOCOUNT ON;
SELECT        Token, IsGroup, [Role]
FROM            dbo.cm_Roles
WHERE Token >= @Token;



GO
/****** Object:  StoredProcedure [dbo].[cm_Roles_SelectByTokenType]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[cm_Roles_SelectByTokenType]
(
	@IsGroup bit
)
AS
	SET NOCOUNT ON;
SELECT        Token, IsGroup, [Role]
FROM            dbo.cm_Roles
WHERE IsGroup = @IsGroup;


GO
/****** Object:  StoredProcedure [dbo].[cm_View_GetMostDependedItems]    Script Date: 30.06.2017 11:54:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
USE [master]
GO
ALTER DATABASE [RZ-CMDB] SET  READ_WRITE 
GO
