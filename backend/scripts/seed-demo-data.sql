SET NOCOUNT ON;
GO

-- Clean demo data is optional; keep it easy to rerun
DELETE FROM dbo.HistoricConnectionDescriptions;
DELETE FROM dbo.HistoricConnections;
DELETE FROM dbo.HistoricConfigurationItemVersionResponsibleUsers;
DELETE FROM dbo.HistoricConfigurationItemVersionLinks;
DELETE FROM dbo.HistoricConfigurationItemVersionAttributes;
DELETE FROM dbo.HistoricConfigurationItemVersions;
DELETE FROM dbo.HistoricConfigurationItems;
DELETE FROM dbo.Connections;
DELETE FROM dbo.ConfigurationItemResponsibleUsers;
DELETE FROM dbo.ConfigurationItemLinks;
DELETE FROM dbo.ConfigurationItemAttributes;
DELETE FROM dbo.ConfigurationItems;
DELETE FROM dbo.ConnectionRules;
DELETE FROM dbo.ConnectionTypes;
DELETE FROM dbo.ItemTypeAttributeGroups;
DELETE FROM dbo.AttributeTypes;
DELETE FROM dbo.AttributeEnumValues;
DELETE FROM dbo.AttributeEnumGroups;
DELETE FROM dbo.AttributeGroups;
DELETE FROM dbo.ItemTypes;
DELETE FROM dbo.Users;
GO

SET IDENTITY_INSERT dbo.Users ON;
INSERT INTO dbo.Users (UserId, Name, Role, LastVisit, Passphrase, CreatedAt, UpdatedAt)
VALUES
    (1, N'admin', 2, SYSUTCDATETIME(), N'local-demo', SYSUTCDATETIME(), SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.Users OFF;
GO

SET IDENTITY_INSERT dbo.AttributeGroups ON;
INSERT INTO dbo.AttributeGroups (AttributeGroupId, Name, CreatedAt, UpdatedAt)
VALUES
    (1, N'Base Information', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, N'Technical', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (3, N'Ownership', SYSUTCDATETIME(), SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.AttributeGroups OFF;
GO

SET IDENTITY_INSERT dbo.AttributeEnumGroups ON;
INSERT INTO dbo.AttributeEnumGroups (EnumGroupId, Name, CreatedAt)
VALUES
    (1, N'Environment', SYSUTCDATETIME()),
    (2, N'Lifecycle', SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.AttributeEnumGroups OFF;
GO

SET IDENTITY_INSERT dbo.AttributeEnumValues ON;
INSERT INTO dbo.AttributeEnumValues (EnumValueId, EnumGroupId, Code, DisplayName, SortOrder, CreatedAt)
VALUES
    (1, 1, N'dev', N'Development', 10, SYSUTCDATETIME()),
    (2, 1, N'test', N'Test', 20, SYSUTCDATETIME()),
    (3, 1, N'prod', N'Production', 30, SYSUTCDATETIME()),
    (4, 2, N'planned', N'Planned', 10, SYSUTCDATETIME()),
    (5, 2, N'active', N'Active', 20, SYSUTCDATETIME()),
    (6, 2, N'retired', N'Retired', 30, SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.AttributeEnumValues OFF;
GO

SET IDENTITY_INSERT dbo.ItemTypes ON;
INSERT INTO dbo.ItemTypes (ItemTypeId, Name, Color, CreatedAt, UpdatedAt)
VALUES
    (1, N'Server', N'#2563eb', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, N'Database', N'#16a34a', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (3, N'Application', N'#7c3aed', SYSUTCDATETIME(), SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.ItemTypes OFF;
GO

SET IDENTITY_INSERT dbo.AttributeTypes ON;
INSERT INTO dbo.AttributeTypes (AttributeTypeId, Name, AttributeGroupId, DataType, ValidationExpression, MinValue, MaxValue, EnumGroupId, CreatedAt, UpdatedAt)
VALUES
    (1, N'Environment', 1, N'enum', NULL, NULL, NULL, 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, N'Owner', 3, N'string', NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (3, N'CPU Cores', 2, N'int', NULL, N'1', N'256', NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (4, N'Memory GB', 2, N'int', NULL, N'1', N'2048', NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (5, N'Last Maintenance', 2, N'datetime', NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (6, N'Is Virtual', 2, N'bool', NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (7, N'Lifecycle', 1, N'enum', NULL, NULL, NULL, 2, SYSUTCDATETIME(), SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.AttributeTypes OFF;
GO

INSERT INTO dbo.ItemTypeAttributeGroups (ItemTypeId, AttributeGroupId, CreatedAt)
VALUES
    (1, 1, SYSUTCDATETIME()),
    (1, 2, SYSUTCDATETIME()),
    (1, 3, SYSUTCDATETIME()),
    (2, 1, SYSUTCDATETIME()),
    (2, 2, SYSUTCDATETIME()),
    (2, 3, SYSUTCDATETIME());
GO

SET IDENTITY_INSERT dbo.ConnectionTypes ON;
INSERT INTO dbo.ConnectionTypes (ConnectionTypeId, Name, ReverseName, CreatedAt, UpdatedAt)
VALUES
    (1, N'Runs On', N'Provides Host To', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, N'Depends On', N'Is Required By', SYSUTCDATETIME(), SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.ConnectionTypes OFF;
GO

SET IDENTITY_INSERT dbo.ConnectionRules ON;
INSERT INTO dbo.ConnectionRules (ConnectionRuleId, ConnectionTypeId, UpperItemTypeId, LowerItemTypeId, MaxConnectionsToUpper, MaxConnectionsToLower, ValidationExpression, CreatedAt, UpdatedAt)
VALUES
    (1, 1, 1, 2, 1, 3, N'ALWAYS', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, 2, 3, 2, 10, 3, N'ALWAYS', SYSUTCDATETIME(), SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.ConnectionRules OFF;
GO

SET IDENTITY_INSERT dbo.ConfigurationItems ON;
INSERT INTO dbo.ConfigurationItems (ConfigurationItemId, Name, ItemTypeId, TypeName, TypeColor, CreatedAt, UpdatedAt)
VALUES
    (1, N'app-server-01', 1, N'Server', N'#2563eb', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, N'ms-sql-primary', 2, N'Database', N'#16a34a', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (3, N'cmdb-api', 3, N'Application', N'#7c3aed', SYSUTCDATETIME(), SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.ConfigurationItems OFF;
GO

INSERT INTO dbo.ConfigurationItemAttributes (ConfigurationItemId, AttributeTypeId, TypeName, ValueString, ValueInt, ValueDecimal, ValueDateTime, ValueBoolean, ValueEnumId, CreatedAt, UpdatedAt)
VALUES
    (1, 1, N'Environment', NULL, NULL, NULL, NULL, NULL, 3, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (1, 2, N'Owner', N'platform-team', NULL, NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (1, 3, N'CPU Cores', NULL, 16, NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (1, 4, N'Memory GB', NULL, 32, NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (1, 5, N'Last Maintenance', NULL, NULL, NULL, DATEADD(day, -14, SYSUTCDATETIME()), NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (1, 6, N'Is Virtual', NULL, NULL, NULL, NULL, 1, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, 1, N'Environment', NULL, NULL, NULL, NULL, NULL, 3, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, 2, N'Owner', N'data-team', NULL, NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, 3, N'CPU Cores', NULL, 8, NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, 4, N'Memory GB', NULL, 64, NULL, NULL, NULL, NULL, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, 7, N'Lifecycle', NULL, NULL, NULL, NULL, NULL, 5, SYSUTCDATETIME(), SYSUTCDATETIME());
GO

INSERT INTO dbo.ConfigurationItemLinks (ConfigurationItemId, Uri, Description, CreatedAt)
VALUES
    (1, N'https://docs.local/app-server-01', N'Internal runbook', SYSUTCDATETIME()),
    (2, N'https://docs.local/ms-sql-primary', N'Database documentation', SYSUTCDATETIME());
GO

INSERT INTO dbo.ConfigurationItemResponsibleUsers (ConfigurationItemId, UserId, CreatedAt)
VALUES
    (1, 1, SYSUTCDATETIME()),
    (2, 1, SYSUTCDATETIME());
GO

INSERT INTO dbo.Connections (ConnectionRuleId, UpperItemId, LowerItemId, Description, CreatedAt, UpdatedAt)
VALUES
    (1, 1, 2, N'Server hosts the primary SQL database', SYSUTCDATETIME(), SYSUTCDATETIME()),
    (2, 3, 2, N'CMDB API depends on backend database', SYSUTCDATETIME(), SYSUTCDATETIME());
GO

INSERT INTO dbo.HistoricConfigurationItems (HistoricConfigurationItemId, ConfigurationItemId, TypeId, TypeName, Deleted, CreatedAt, UpdatedAt)
VALUES
    (1, 1, 1, N'Server', 0, SYSUTCDATETIME(), SYSUTCDATETIME());
GO

INSERT INTO dbo.HistoricConfigurationItemVersions (HistoricConfigurationItemVersionId, HistoricConfigurationItemId, Name, TypeName, LastUpdate, SavedBy, CreatedAt, UpdatedAt)
VALUES
    (1, 1, N'app-server-01', N'Server', SYSUTCDATETIME(), N'admin', SYSUTCDATETIME(), SYSUTCDATETIME());
GO

INSERT INTO dbo.HistoricConfigurationItemVersionAttributes (HistoricConfigurationItemVersionId, TypeId, TypeName, Value, CreatedAt)
VALUES
    (1, 2, N'Owner', N'platform-team', SYSUTCDATETIME());
GO

INSERT INTO dbo.HistoricConnections (HistoricConnectionId, ConnectionRuleId, ConnectionTypeId, ConnectionTypeName, ConnectionTypeReverseName, UpperItemId, LowerItemId, Deleted, CreatedAt, UpdatedAt)
VALUES
    (1, 1, 1, N'Runs On', N'Provides Host To', 1, 2, 0, SYSUTCDATETIME(), SYSUTCDATETIME());
GO

INSERT INTO dbo.HistoricConnectionDescriptions (HistoricConnectionDescriptionId, HistoricConnectionId, DescriptionText, CreatedAt)
VALUES
    (1, 1, N'Original connection snapshot', SYSUTCDATETIME());
GO

PRINT 'Demo data for CMDB seed created successfully.';
GO
