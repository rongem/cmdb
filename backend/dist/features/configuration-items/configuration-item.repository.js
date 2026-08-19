"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurationItemRepository = void 0;
const mssql_1 = __importDefault(require("mssql"));
const sql_1 = require("../../db/sql");
const inMemoryItems = [
    {
        id: 'ci-1001',
        name: 'App-Server-01',
        type: 'server',
        status: 'active',
        description: 'Primary application server',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'ci-1002',
        name: 'DB-Cluster-01',
        type: 'database',
        status: 'active',
        description: 'Primary SQL cluster',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
const mapRowToConfigurationItem = (row) => ({
    id: String(row.ConfigurationItemId),
    name: row.Name,
    type: row.TypeName,
    status: 'active',
    description: undefined,
    createdAt: new Date(row.CreatedAt).toISOString(),
    updatedAt: new Date(row.UpdatedAt).toISOString(),
});
const mapInputToRow = (input) => ({
    Name: input.name,
    ItemTypeId: 1,
    TypeName: input.type,
    TypeColor: '#3b82f6',
});
exports.configurationItemRepository = {
    list: async () => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            return inMemoryItems;
        }
        try {
            const result = await pool.request().query(`
        SELECT
          ci.ConfigurationItemId,
          ci.Name,
          ci.ItemTypeId,
          ci.TypeName,
          ci.TypeColor,
          ci.CreatedAt,
          ci.UpdatedAt
        FROM dbo.ConfigurationItems ci
        ORDER BY ci.Name ASC;
      `);
            return result.recordset.map(mapRowToConfigurationItem);
        }
        catch {
            return inMemoryItems;
        }
    },
    getById: async (id) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            return inMemoryItems.find((item) => item.id === id);
        }
        try {
            const result = await pool.request()
                .input('ConfigurationItemId', mssql_1.default.BigInt, Number(id))
                .query(`
          SELECT
            ci.ConfigurationItemId,
            ci.Name,
            ci.ItemTypeId,
            ci.TypeName,
            ci.TypeColor,
            ci.CreatedAt,
            ci.UpdatedAt
          FROM dbo.ConfigurationItems ci
          WHERE ci.ConfigurationItemId = @ConfigurationItemId;
        `);
            return result.recordset[0] ? mapRowToConfigurationItem(result.recordset[0]) : undefined;
        }
        catch {
            return inMemoryItems.find((item) => item.id === id);
        }
    },
    create: async (input) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            const now = new Date().toISOString();
            const nextItem = {
                id: `ci-${Date.now()}`,
                name: input.name,
                type: input.type,
                status: input.status ?? 'draft',
                description: input.description,
                createdAt: now,
                updatedAt: now,
            };
            inMemoryItems.push(nextItem);
            return nextItem;
        }
        try {
            const row = mapInputToRow(input);
            const result = await pool.request()
                .input('Name', mssql_1.default.NVarChar(255), row.Name)
                .input('ItemTypeId', mssql_1.default.BigInt, row.ItemTypeId)
                .input('TypeName', mssql_1.default.NVarChar(128), row.TypeName)
                .input('TypeColor', mssql_1.default.NVarChar(32), row.TypeColor)
                .query(`
          INSERT INTO dbo.ConfigurationItems (Name, ItemTypeId, TypeName, TypeColor, CreatedAt, UpdatedAt)
          OUTPUT INSERTED.ConfigurationItemId, INSERTED.Name, INSERTED.ItemTypeId, INSERTED.TypeName, INSERTED.TypeColor, INSERTED.CreatedAt, INSERTED.UpdatedAt
          VALUES (@Name, @ItemTypeId, @TypeName, @TypeColor, SYSUTCDATETIME(), SYSUTCDATETIME());
        `);
            const created = result.recordset[0];
            return mapRowToConfigurationItem(created);
        }
        catch {
            const now = new Date().toISOString();
            const nextItem = {
                id: `ci-${Date.now()}`,
                name: input.name,
                type: input.type,
                status: input.status ?? 'draft',
                description: input.description,
                createdAt: now,
                updatedAt: now,
            };
            inMemoryItems.push(nextItem);
            return nextItem;
        }
    },
    update: async (input) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            const index = inMemoryItems.findIndex((item) => item.id === input.id);
            if (index === -1) {
                return undefined;
            }
            const current = inMemoryItems[index];
            const updated = {
                ...current,
                ...input,
                updatedAt: new Date().toISOString(),
            };
            inMemoryItems[index] = updated;
            return updated;
        }
        try {
            const row = mapInputToRow(input);
            const result = await pool.request()
                .input('ConfigurationItemId', mssql_1.default.BigInt, Number(input.id))
                .input('Name', mssql_1.default.NVarChar(255), row.Name)
                .input('ItemTypeId', mssql_1.default.BigInt, row.ItemTypeId)
                .input('TypeName', mssql_1.default.NVarChar(128), row.TypeName)
                .input('TypeColor', mssql_1.default.NVarChar(32), row.TypeColor)
                .query(`
          UPDATE dbo.ConfigurationItems
          SET Name = @Name,
              ItemTypeId = @ItemTypeId,
              TypeName = @TypeName,
              TypeColor = @TypeColor,
              UpdatedAt = SYSUTCDATETIME()
          OUTPUT INSERTED.ConfigurationItemId, INSERTED.Name, INSERTED.ItemTypeId, INSERTED.TypeName, INSERTED.TypeColor, INSERTED.CreatedAt, INSERTED.UpdatedAt
          WHERE ConfigurationItemId = @ConfigurationItemId;
        `);
            return result.recordset[0] ? mapRowToConfigurationItem(result.recordset[0]) : undefined;
        }
        catch {
            const index = inMemoryItems.findIndex((item) => item.id === input.id);
            if (index === -1) {
                return undefined;
            }
            const current = inMemoryItems[index];
            const updated = {
                ...current,
                ...input,
                updatedAt: new Date().toISOString(),
            };
            inMemoryItems[index] = updated;
            return updated;
        }
    },
    delete: async (id) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            const index = inMemoryItems.findIndex((item) => item.id === id);
            if (index === -1) {
                return false;
            }
            inMemoryItems.splice(index, 1);
            return true;
        }
        try {
            const result = await pool.request()
                .input('ConfigurationItemId', mssql_1.default.BigInt, Number(id))
                .query(`
          DELETE FROM dbo.ConfigurationItems
          WHERE ConfigurationItemId = @ConfigurationItemId;
        `);
            return result.rowsAffected[0] > 0;
        }
        catch {
            const index = inMemoryItems.findIndex((item) => item.id === id);
            if (index === -1) {
                return false;
            }
            inMemoryItems.splice(index, 1);
            return true;
        }
    },
};
