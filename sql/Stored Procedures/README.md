# Stored Procedures for the current MSSQL schema

This directory contains CRUD procedures aligned to the current SQL schema in [mssql-2022-schema.sql](../mssql-2022-schema.sql).

The naming follows the legacy pattern from [sql/Database/Stored Procedures](../Database/Stored Procedures), but the procedure signatures reflect the newer relational model and bigint identity keys.

## Included entity procedures

- AttributeGroups
- AttributeTypes
- ItemTypes
- ConnectionTypes
- ConnectionRules
- ConfigurationItems
- Connections
- Users
