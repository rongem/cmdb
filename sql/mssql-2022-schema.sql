/*
  MSSQL 2022 schema for the DcCmdb domain model
  Derived from the Mongoose models in njs-backend/src/models/mongoose

  Design notes:
  - Relational tables are normalized to represent the current Mongoose references.
  - Redundant columns like ConfigurationItems.TypeName / TypeColor are kept because
    the current model stores those values directly and they are used frequently.
  - History tables keep the old snapshot model as separate versions instead of raw JSON.
*/

SET NOCOUNT ON;
GO

DROP TABLE IF EXISTS dbo.HistoricConnectionDescriptions;
DROP TABLE IF EXISTS dbo.HistoricConnections;
DROP TABLE IF EXISTS dbo.HistoricConfigurationItemVersionResponsibleUsers;
DROP TABLE IF EXISTS dbo.HistoricConfigurationItemVersionLinks;
DROP TABLE IF EXISTS dbo.HistoricConfigurationItemVersionAttributes;
DROP TABLE IF EXISTS dbo.HistoricConfigurationItemVersions;
DROP TABLE IF EXISTS dbo.HistoricConfigurationItems;
DROP TABLE IF EXISTS dbo.Connections;
DROP TABLE IF EXISTS dbo.ConfigurationItemResponsibleUsers;
DROP TABLE IF EXISTS dbo.ConfigurationItemLinks;
DROP TABLE IF EXISTS dbo.ConfigurationItemAttributes;
DROP TABLE IF EXISTS dbo.ConfigurationItems;
DROP TABLE IF EXISTS dbo.ConnectionRules;
DROP TABLE IF EXISTS dbo.ConnectionTypes;
DROP TABLE IF EXISTS dbo.ItemTypeAttributeGroups;
DROP TABLE IF EXISTS dbo.ItemTypes;
DROP TABLE IF EXISTS dbo.AttributeEnumValues;
DROP TABLE IF EXISTS dbo.AttributeEnumGroups;
DROP TABLE IF EXISTS dbo.AttributeTypes;
DROP TABLE IF EXISTS dbo.AttributeGroups;
DROP TABLE IF EXISTS dbo.Users;
GO

CREATE TABLE dbo.Users (
    UserId bigint IDENTITY(1,1) NOT NULL,
    Name nvarchar(128) NOT NULL,
    Role tinyint NOT NULL,
    LastVisit datetime2(3) NOT NULL,
    Passphrase nvarchar(max) NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Users PRIMARY KEY (UserId),
    CONSTRAINT CK_Users_Role CHECK (Role IN (0, 1, 2)),
    CONSTRAINT UQ_Users_Name UNIQUE (Name)
);
GO

CREATE TABLE dbo.AttributeGroups (
    AttributeGroupId bigint IDENTITY(1,1) NOT NULL,
    Name nvarchar(128) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_AttributeGroups_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_AttributeGroups_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AttributeGroups PRIMARY KEY (AttributeGroupId),
    CONSTRAINT UQ_AttributeGroups_Name UNIQUE (Name)
);
GO

CREATE TABLE dbo.AttributeEnumGroups (
    EnumGroupId bigint IDENTITY(1,1) NOT NULL,
    Name nvarchar(128) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_AttributeEnumGroups_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AttributeEnumGroups PRIMARY KEY (EnumGroupId),
    CONSTRAINT UQ_AttributeEnumGroups_Name UNIQUE (Name)
);
GO

CREATE TABLE dbo.AttributeEnumValues (
    EnumValueId bigint IDENTITY(1,1) NOT NULL,
    EnumGroupId bigint NOT NULL,
    Code nvarchar(100) NOT NULL,
    DisplayName nvarchar(200) NOT NULL,
    SortOrder int NOT NULL CONSTRAINT DF_AttributeEnumValues_SortOrder DEFAULT 0,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_AttributeEnumValues_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AttributeEnumValues PRIMARY KEY (EnumValueId),
    CONSTRAINT UQ_AttributeEnumValues_Group_Code UNIQUE (EnumGroupId, Code),
    CONSTRAINT FK_AttributeEnumValues_EnumGroups FOREIGN KEY (EnumGroupId)
        REFERENCES dbo.AttributeEnumGroups (EnumGroupId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.AttributeTypes (
    AttributeTypeId bigint IDENTITY(1,1) NOT NULL,
    Name nvarchar(128) NOT NULL,
    AttributeGroupId bigint NOT NULL,
    DataType varchar(20) NOT NULL,
    ValidationExpression nvarchar(max) NULL,
    MinValue nvarchar(200) NULL,
    MaxValue nvarchar(200) NULL,
    EnumGroupId bigint NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_AttributeTypes_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_AttributeTypes_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AttributeTypes PRIMARY KEY (AttributeTypeId),
    CONSTRAINT UQ_AttributeTypes_Name UNIQUE (Name),
    CONSTRAINT CK_AttributeTypes_DataType CHECK (DataType IN ('string', 'int', 'decimal', 'datetime', 'bool', 'enum')),
    CONSTRAINT FK_AttributeTypes_AttributeGroups FOREIGN KEY (AttributeGroupId)
        REFERENCES dbo.AttributeGroups (AttributeGroupId)
        ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT FK_AttributeTypes_EnumGroups FOREIGN KEY (EnumGroupId)
        REFERENCES dbo.AttributeEnumGroups (EnumGroupId)
        ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.ItemTypes (
    ItemTypeId bigint IDENTITY(1,1) NOT NULL,
    Name nvarchar(128) NOT NULL,
    Color nvarchar(32) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_ItemTypes_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_ItemTypes_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ItemTypes PRIMARY KEY (ItemTypeId),
    CONSTRAINT UQ_ItemTypes_Name UNIQUE (Name)
);
GO

CREATE TABLE dbo.ItemTypeAttributeGroups (
    ItemTypeId bigint NOT NULL,
    AttributeGroupId bigint NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_ItemTypeAttributeGroups_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ItemTypeAttributeGroups PRIMARY KEY (ItemTypeId, AttributeGroupId),
    CONSTRAINT FK_ItemTypeAttributeGroups_ItemTypes FOREIGN KEY (ItemTypeId)
        REFERENCES dbo.ItemTypes (ItemTypeId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_ItemTypeAttributeGroups_AttributeGroups FOREIGN KEY (AttributeGroupId)
        REFERENCES dbo.AttributeGroups (AttributeGroupId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.ConnectionTypes (
    ConnectionTypeId bigint IDENTITY(1,1) NOT NULL,
    Name nvarchar(128) NOT NULL,
    ReverseName nvarchar(128) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConnectionTypes_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConnectionTypes_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ConnectionTypes PRIMARY KEY (ConnectionTypeId),
    CONSTRAINT UQ_ConnectionTypes_NameReverse UNIQUE (Name, ReverseName)
);
GO

CREATE TABLE dbo.ConnectionRules (
    ConnectionRuleId bigint IDENTITY(1,1) NOT NULL,
    ConnectionTypeId bigint NOT NULL,
    UpperItemTypeId bigint NOT NULL,
    LowerItemTypeId bigint NOT NULL,
    MaxConnectionsToUpper int NOT NULL,
    MaxConnectionsToLower int NOT NULL,
    ValidationExpression nvarchar(max) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConnectionRules_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConnectionRules_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ConnectionRules PRIMARY KEY (ConnectionRuleId),
    CONSTRAINT UQ_ConnectionRules_Triple UNIQUE (ConnectionTypeId, UpperItemTypeId, LowerItemTypeId),
    CONSTRAINT CK_ConnectionRules_MaxConnectionsToUpper CHECK (MaxConnectionsToUpper >= 1),
    CONSTRAINT CK_ConnectionRules_MaxConnectionsToLower CHECK (MaxConnectionsToLower >= 1),
    CONSTRAINT FK_ConnectionRules_ConnectionTypes FOREIGN KEY (ConnectionTypeId)
        REFERENCES dbo.ConnectionTypes (ConnectionTypeId)
        ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT FK_ConnectionRules_UpperItemTypes FOREIGN KEY (UpperItemTypeId)
        REFERENCES dbo.ItemTypes (ItemTypeId)
        ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT FK_ConnectionRules_LowerItemTypes FOREIGN KEY (LowerItemTypeId)
        REFERENCES dbo.ItemTypes (ItemTypeId)
        ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.ConfigurationItems (
    ConfigurationItemId bigint IDENTITY(1,1) NOT NULL,
    Name nvarchar(255) NOT NULL,
    ItemTypeId bigint NOT NULL,
    TypeName nvarchar(128) NOT NULL,
    TypeColor nvarchar(32) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConfigurationItems_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConfigurationItems_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ConfigurationItems PRIMARY KEY (ConfigurationItemId),
    CONSTRAINT UQ_ConfigurationItems_NameAndType UNIQUE (Name, ItemTypeId),
    CONSTRAINT FK_ConfigurationItems_ItemTypes FOREIGN KEY (ItemTypeId)
        REFERENCES dbo.ItemTypes (ItemTypeId)
        ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.ConfigurationItemAttributes (
    ConfigurationItemId bigint NOT NULL,
    AttributeTypeId bigint NOT NULL,
    TypeName nvarchar(128) NOT NULL,
    ValueString nvarchar(max) NULL,
    ValueInt int NULL,
    ValueDecimal decimal(18,4) NULL,
    ValueDateTime datetime2(3) NULL,
    ValueBoolean bit NULL,
    ValueEnumId bigint NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConfigurationItemAttributes_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConfigurationItemAttributes_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ConfigurationItemAttributes PRIMARY KEY (ConfigurationItemId, AttributeTypeId),
    CONSTRAINT FK_ConfigurationItemAttributes_ConfigurationItems FOREIGN KEY (ConfigurationItemId)
        REFERENCES dbo.ConfigurationItems (ConfigurationItemId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_ConfigurationItemAttributes_AttributeTypes FOREIGN KEY (AttributeTypeId)
        REFERENCES dbo.AttributeTypes (AttributeTypeId)
        ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT FK_ConfigurationItemAttributes_EnumValues FOREIGN KEY (ValueEnumId)
        REFERENCES dbo.AttributeEnumValues (EnumValueId)
        ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT CK_ConfigurationItemAttributes_ExactlyOneValue CHECK (
        (
            ValueString IS NOT NULL AND ValueInt IS NULL AND ValueDecimal IS NULL AND ValueDateTime IS NULL AND ValueBoolean IS NULL AND ValueEnumId IS NULL
        )
        OR (
            ValueString IS NULL AND ValueInt IS NOT NULL AND ValueDecimal IS NULL AND ValueDateTime IS NULL AND ValueBoolean IS NULL AND ValueEnumId IS NULL
        )
        OR (
            ValueString IS NULL AND ValueInt IS NULL AND ValueDecimal IS NOT NULL AND ValueDateTime IS NULL AND ValueBoolean IS NULL AND ValueEnumId IS NULL
        )
        OR (
            ValueString IS NULL AND ValueInt IS NULL AND ValueDecimal IS NULL AND ValueDateTime IS NOT NULL AND ValueBoolean IS NULL AND ValueEnumId IS NULL
        )
        OR (
            ValueString IS NULL AND ValueInt IS NULL AND ValueDecimal IS NULL AND ValueDateTime IS NULL AND ValueBoolean IS NOT NULL AND ValueEnumId IS NULL
        )
        OR (
            ValueString IS NULL AND ValueInt IS NULL AND ValueDecimal IS NULL AND ValueDateTime IS NULL AND ValueBoolean IS NULL AND ValueEnumId IS NOT NULL
        )
    )
);
GO

CREATE TABLE dbo.ConfigurationItemLinks (
    ConfigurationItemLinkId bigint IDENTITY(1,1) NOT NULL,
    ConfigurationItemId bigint NOT NULL,
    Uri nvarchar(2048) NOT NULL,
    Description nvarchar(500) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConfigurationItemLinks_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ConfigurationItemLinks PRIMARY KEY (ConfigurationItemLinkId),
    CONSTRAINT FK_ConfigurationItemLinks_ConfigurationItems FOREIGN KEY (ConfigurationItemId)
        REFERENCES dbo.ConfigurationItems (ConfigurationItemId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.ConfigurationItemResponsibleUsers (
    ConfigurationItemId bigint NOT NULL,
    UserId bigint NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_ConfigurationItemResponsibleUsers_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ConfigurationItemResponsibleUsers PRIMARY KEY (ConfigurationItemId, UserId),
    CONSTRAINT FK_ConfigurationItemResponsibleUsers_ConfigurationItems FOREIGN KEY (ConfigurationItemId)
        REFERENCES dbo.ConfigurationItems (ConfigurationItemId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_ConfigurationItemResponsibleUsers_Users FOREIGN KEY (UserId)
        REFERENCES dbo.Users (UserId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.Connections (
    ConnectionId bigint IDENTITY(1,1) NOT NULL,
    ConnectionRuleId bigint NOT NULL,
    UpperItemId bigint NOT NULL,
    LowerItemId bigint NOT NULL,
    Description nvarchar(max) NOT NULL CONSTRAINT DF_Connections_Description DEFAULT '',
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_Connections_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_Connections_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Connections PRIMARY KEY (ConnectionId),
    CONSTRAINT UQ_Connections_RuleUpperLower UNIQUE (ConnectionRuleId, UpperItemId, LowerItemId),
    CONSTRAINT FK_Connections_ConnectionRules FOREIGN KEY (ConnectionRuleId)
        REFERENCES dbo.ConnectionRules (ConnectionRuleId)
        ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT FK_Connections_UpperItems FOREIGN KEY (UpperItemId)
        REFERENCES dbo.ConfigurationItems (ConfigurationItemId)
        ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT FK_Connections_LowerItems FOREIGN KEY (LowerItemId)
        REFERENCES dbo.ConfigurationItems (ConfigurationItemId)
        ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.HistoricConfigurationItems (
    HistoricConfigurationItemId bigint IDENTITY(1,1) NOT NULL,
    ConfigurationItemId bigint NULL,
    TypeId bigint NOT NULL,
    TypeName nvarchar(128) NOT NULL,
    Deleted bit NOT NULL CONSTRAINT DF_HistoricConfigurationItems_Deleted DEFAULT 0,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConfigurationItems_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConfigurationItems_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_HistoricConfigurationItems PRIMARY KEY (HistoricConfigurationItemId),
    CONSTRAINT FK_HistoricConfigurationItems_ConfigurationItems FOREIGN KEY (ConfigurationItemId)
        REFERENCES dbo.ConfigurationItems (ConfigurationItemId)
        ON DELETE SET NULL ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.HistoricConfigurationItemVersions (
    HistoricConfigurationItemVersionId bigint IDENTITY(1,1) NOT NULL,
    HistoricConfigurationItemId bigint NOT NULL,
    Name nvarchar(255) NOT NULL,
    TypeName nvarchar(128) NOT NULL,
    LastUpdate datetime2(3) NOT NULL,
    SavedBy nvarchar(128) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConfigurationItemVersions_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConfigurationItemVersions_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_HistoricConfigurationItemVersions PRIMARY KEY (HistoricConfigurationItemVersionId),
    CONSTRAINT FK_HistoricConfigurationItemVersions_HistoricConfigurationItems FOREIGN KEY (HistoricConfigurationItemId)
        REFERENCES dbo.HistoricConfigurationItems (HistoricConfigurationItemId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.HistoricConfigurationItemVersionAttributes (
    HistoricConfigurationItemVersionId bigint NOT NULL,
    TypeId bigint NOT NULL,
    TypeName nvarchar(128) NOT NULL,
    Value nvarchar(max) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConfigurationItemVersionAttributes_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_HistoricConfigurationItemVersionAttributes PRIMARY KEY (HistoricConfigurationItemVersionId, TypeId),
    CONSTRAINT FK_HistoricConfigurationItemVersionAttributes_Versions FOREIGN KEY (HistoricConfigurationItemVersionId)
        REFERENCES dbo.HistoricConfigurationItemVersions (HistoricConfigurationItemVersionId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.HistoricConfigurationItemVersionLinks (
    HistoricConfigurationItemVersionLinkId bigint IDENTITY(1,1) NOT NULL,
    HistoricConfigurationItemVersionId bigint NOT NULL,
    Uri nvarchar(2048) NOT NULL,
    Description nvarchar(500) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConfigurationItemVersionLinks_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_HistoricConfigurationItemVersionLinks PRIMARY KEY (HistoricConfigurationItemVersionLinkId),
    CONSTRAINT FK_HistoricConfigurationItemVersionLinks_Versions FOREIGN KEY (HistoricConfigurationItemVersionId)
        REFERENCES dbo.HistoricConfigurationItemVersions (HistoricConfigurationItemVersionId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.HistoricConfigurationItemVersionResponsibleUsers (
    HistoricConfigurationItemVersionId bigint NOT NULL,
    Name nvarchar(128) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConfigurationItemVersionResponsibleUsers_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_HistoricConfigurationItemVersionResponsibleUsers PRIMARY KEY (HistoricConfigurationItemVersionId, Name),
    CONSTRAINT FK_HistoricConfigurationItemVersionResponsibleUsers_Versions FOREIGN KEY (HistoricConfigurationItemVersionId)
        REFERENCES dbo.HistoricConfigurationItemVersions (HistoricConfigurationItemVersionId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.HistoricConnections (
    HistoricConnectionId bigint IDENTITY(1,1) NOT NULL,
    ConnectionRuleId bigint NOT NULL,
    ConnectionTypeId bigint NOT NULL,
    ConnectionTypeName nvarchar(128) NOT NULL,
    ConnectionTypeReverseName nvarchar(128) NOT NULL,
    UpperItemId bigint NOT NULL,
    LowerItemId bigint NOT NULL,
    Deleted bit NOT NULL CONSTRAINT DF_HistoricConnections_Deleted DEFAULT 0,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConnections_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConnections_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_HistoricConnections PRIMARY KEY (HistoricConnectionId),
    CONSTRAINT FK_HistoricConnections_ConnectionRules FOREIGN KEY (ConnectionRuleId)
        REFERENCES dbo.ConnectionRules (ConnectionRuleId)
        ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

CREATE TABLE dbo.HistoricConnectionDescriptions (
    HistoricConnectionDescriptionId bigint IDENTITY(1,1) NOT NULL,
    HistoricConnectionId bigint NOT NULL,
    DescriptionText nvarchar(max) NOT NULL,
    CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_HistoricConnectionDescriptions_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_HistoricConnectionDescriptions PRIMARY KEY (HistoricConnectionDescriptionId),
    CONSTRAINT FK_HistoricConnectionDescriptions_HistoricConnections FOREIGN KEY (HistoricConnectionId)
        REFERENCES dbo.HistoricConnections (HistoricConnectionId)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE TRIGGER dbo.trg_ConfigurationItemAttributes_ValidateValues
ON dbo.ConfigurationItemAttributes
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN dbo.AttributeTypes at ON at.AttributeTypeId = i.AttributeTypeId
        WHERE
            (
                at.DataType = 'string'
                AND (
                    i.ValueString IS NULL
                    OR i.ValueInt IS NOT NULL
                    OR i.ValueDecimal IS NOT NULL
                    OR i.ValueDateTime IS NOT NULL
                    OR i.ValueBoolean IS NOT NULL
                    OR i.ValueEnumId IS NOT NULL
                )
            )
            OR (
                at.DataType = 'int'
                AND (
                    i.ValueInt IS NULL
                    OR i.ValueString IS NOT NULL
                    OR i.ValueDecimal IS NOT NULL
                    OR i.ValueDateTime IS NOT NULL
                    OR i.ValueBoolean IS NOT NULL
                    OR i.ValueEnumId IS NOT NULL
                )
            )
            OR (
                at.DataType = 'decimal'
                AND (
                    i.ValueDecimal IS NULL
                    OR i.ValueString IS NOT NULL
                    OR i.ValueInt IS NOT NULL
                    OR i.ValueDateTime IS NOT NULL
                    OR i.ValueBoolean IS NOT NULL
                    OR i.ValueEnumId IS NOT NULL
                )
            )
            OR (
                at.DataType = 'datetime'
                AND (
                    i.ValueDateTime IS NULL
                    OR i.ValueString IS NOT NULL
                    OR i.ValueInt IS NOT NULL
                    OR i.ValueDecimal IS NOT NULL
                    OR i.ValueBoolean IS NOT NULL
                    OR i.ValueEnumId IS NOT NULL
                )
            )
            OR (
                at.DataType = 'bool'
                AND (
                    i.ValueBoolean IS NULL
                    OR i.ValueString IS NOT NULL
                    OR i.ValueInt IS NOT NULL
                    OR i.ValueDecimal IS NOT NULL
                    OR i.ValueDateTime IS NOT NULL
                    OR i.ValueEnumId IS NOT NULL
                )
            )
            OR (
                at.DataType = 'enum'
                AND (
                    i.ValueEnumId IS NULL
                    OR i.ValueString IS NOT NULL
                    OR i.ValueInt IS NOT NULL
                    OR i.ValueDecimal IS NOT NULL
                    OR i.ValueDateTime IS NOT NULL
                    OR i.ValueBoolean IS NOT NULL
                )
            )
    )
    BEGIN
        RAISERROR('The supplied value does not match the configured datatype for the attribute type.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

CREATE INDEX IX_AttributeTypes_AttributeGroupId ON dbo.AttributeTypes (AttributeGroupId);
CREATE INDEX IX_AttributeTypes_Name ON dbo.AttributeTypes (Name);
CREATE INDEX IX_AttributeEnumValues_EnumGroupId ON dbo.AttributeEnumValues (EnumGroupId);
CREATE INDEX IX_ItemTypeAttributeGroups_AttributeGroupId ON dbo.ItemTypeAttributeGroups (AttributeGroupId);
CREATE INDEX IX_ConfigurationItems_Name ON dbo.ConfigurationItems (Name);
CREATE INDEX IX_ConfigurationItems_ItemTypeId ON dbo.ConfigurationItems (ItemTypeId);
CREATE INDEX IX_ConfigurationItemAttributes_AttributeTypeId ON dbo.ConfigurationItemAttributes (AttributeTypeId);
CREATE INDEX IX_ConfigurationItemAttributes_ValueEnumId ON dbo.ConfigurationItemAttributes (ValueEnumId);
CREATE INDEX IX_ConfigurationItemLinks_ConfigurationItemId ON dbo.ConfigurationItemLinks (ConfigurationItemId);
CREATE INDEX IX_ConfigurationItemResponsibleUsers_UserId ON dbo.ConfigurationItemResponsibleUsers (UserId);
CREATE INDEX IX_Connections_ConnectionRuleId ON dbo.Connections (ConnectionRuleId);
CREATE INDEX IX_Connections_UpperItemId ON dbo.Connections (UpperItemId);
CREATE INDEX IX_Connections_LowerItemId ON dbo.Connections (LowerItemId);
CREATE INDEX IX_ConnectionRules_ConnectionTypeId ON dbo.ConnectionRules (ConnectionTypeId);
CREATE INDEX IX_ConnectionRules_UpperItemTypeId ON dbo.ConnectionRules (UpperItemTypeId);
CREATE INDEX IX_ConnectionRules_LowerItemTypeId ON dbo.ConnectionRules (LowerItemTypeId);
CREATE INDEX IX_HistoricConfigurationItems_ConfigurationItemId ON dbo.HistoricConfigurationItems (ConfigurationItemId);
CREATE INDEX IX_HistoricConfigurationItems_TypeId ON dbo.HistoricConfigurationItems (TypeId);
CREATE INDEX IX_HistoricConfigurationItemVersions_HistoricConfigurationItemId ON dbo.HistoricConfigurationItemVersions (HistoricConfigurationItemId);
CREATE INDEX IX_HistoricConfigurationItemVersionAttributes_TypeId ON dbo.HistoricConfigurationItemVersionAttributes (TypeId);
CREATE INDEX IX_HistoricConnections_ConnectionRuleId ON dbo.HistoricConnections (ConnectionRuleId);
CREATE INDEX IX_HistoricConnections_UpperItemId ON dbo.HistoricConnections (UpperItemId);
CREATE INDEX IX_HistoricConnections_LowerItemId ON dbo.HistoricConnections (LowerItemId);
CREATE INDEX IX_HistoricConnectionDescriptions_HistoricConnectionId ON dbo.HistoricConnectionDescriptions (HistoricConnectionId);
GO

PRINT 'MSSQL 2022 schema created successfully.';
GO
