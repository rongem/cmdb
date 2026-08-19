"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemAttributeRepository = void 0;
const mssql_1 = __importDefault(require("mssql"));
const sql_1 = require("../../db/sql");
const attributes = [
    {
        id: 'attr-1',
        itemId: 'ci-1001',
        key: 'environment',
        value: { type: 'string', value: 'prod' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'attr-2',
        itemId: 'ci-1001',
        key: 'owner',
        value: { type: 'string', value: 'platform-team' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
const mapRowToAttributeValue = (row) => {
    if (row.ValueString !== null && row.ValueString !== undefined) {
        return { type: 'string', value: row.ValueString };
    }
    if (row.ValueInt !== null && row.ValueInt !== undefined) {
        return { type: 'int', value: row.ValueInt };
    }
    if (row.ValueDecimal !== null && row.ValueDecimal !== undefined) {
        return { type: 'decimal', value: Number(row.ValueDecimal) };
    }
    if (row.ValueDateTime !== null && row.ValueDateTime !== undefined) {
        return { type: 'datetime', value: new Date(row.ValueDateTime).toISOString() };
    }
    if (row.ValueBoolean !== null && row.ValueBoolean !== undefined) {
        return { type: 'bool', value: row.ValueBoolean };
    }
    if (row.ValueEnumId !== null && row.ValueEnumId !== undefined) {
        return { type: 'enum', value: String(row.ValueEnumId), enumValueId: Number(row.ValueEnumId) };
    }
    return { type: 'string', value: '' };
};
const mapRowToItemAttribute = (row) => ({
    id: String(row.AttributeTypeId),
    itemId: String(row.ConfigurationItemId),
    key: row.TypeName,
    value: mapRowToAttributeValue(row),
    createdAt: new Date(row.CreatedAt).toISOString(),
    updatedAt: new Date(row.UpdatedAt).toISOString(),
});
const mapInputToRow = (input) => {
    const value = input.value;
    if (!value) {
        return {
            ConfigurationItemId: Number(input.itemId),
            AttributeTypeId: 1,
            TypeName: input.key,
            ValueString: '',
            ValueInt: null,
            ValueDecimal: null,
            ValueDateTime: null,
            ValueBoolean: null,
            ValueEnumId: null,
        };
    }
    const row = {
        ConfigurationItemId: Number(input.itemId),
        AttributeTypeId: 1,
        TypeName: input.key,
        ValueString: null,
        ValueInt: null,
        ValueDecimal: null,
        ValueDateTime: null,
        ValueBoolean: null,
        ValueEnumId: null,
    };
    switch (value.type) {
        case 'string': {
            row.ValueString = value.value;
            break;
        }
        case 'int': {
            row.ValueInt = value.value;
            break;
        }
        case 'decimal': {
            row.ValueDecimal = value.value;
            break;
        }
        case 'datetime': {
            row.ValueDateTime = value.value;
            break;
        }
        case 'bool': {
            row.ValueBoolean = value.value;
            break;
        }
        case 'enum': {
            row.ValueEnumId = value.enumValueId ?? null;
            row.ValueString = value.value;
            break;
        }
        default: {
            row.ValueString = '';
            break;
        }
    }
    return row;
};
exports.itemAttributeRepository = {
    listByItemId: async (itemId) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            return attributes.filter((attribute) => attribute.itemId === itemId);
        }
        try {
            const result = await pool.request()
                .input('ConfigurationItemId', mssql_1.default.BigInt, Number(itemId))
                .query(`
          SELECT
            cia.ConfigurationItemId,
            cia.AttributeTypeId,
            cia.TypeName,
            cia.ValueString,
            cia.ValueInt,
            cia.ValueDecimal,
            cia.ValueDateTime,
            cia.ValueBoolean,
            cia.ValueEnumId,
            cia.CreatedAt,
            cia.UpdatedAt
          FROM dbo.ConfigurationItemAttributes cia
          WHERE cia.ConfigurationItemId = @ConfigurationItemId;
        `);
            return result.recordset.map(mapRowToItemAttribute);
        }
        catch {
            return attributes.filter((attribute) => attribute.itemId === itemId);
        }
    },
    getById: async (id) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            return attributes.find((attribute) => attribute.id === id);
        }
        try {
            const result = await pool.request()
                .input('AttributeTypeId', mssql_1.default.BigInt, Number(id))
                .query(`
          SELECT
            cia.ConfigurationItemId,
            cia.AttributeTypeId,
            cia.TypeName,
            cia.ValueString,
            cia.ValueInt,
            cia.ValueDecimal,
            cia.ValueDateTime,
            cia.ValueBoolean,
            cia.ValueEnumId,
            cia.CreatedAt,
            cia.UpdatedAt
          FROM dbo.ConfigurationItemAttributes cia
          WHERE cia.AttributeTypeId = @AttributeTypeId;
        `);
            return result.recordset[0] ? mapRowToItemAttribute(result.recordset[0]) : undefined;
        }
        catch {
            return attributes.find((attribute) => attribute.id === id);
        }
    },
    create: async (input) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            const now = new Date().toISOString();
            const nextAttribute = {
                id: `attr-${Date.now()}`,
                itemId: input.itemId,
                key: input.key,
                value: input.value,
                createdAt: now,
                updatedAt: now,
            };
            attributes.push(nextAttribute);
            return nextAttribute;
        }
        try {
            const row = mapInputToRow(input);
            const result = await pool.request()
                .input('ConfigurationItemId', mssql_1.default.BigInt, Number(row.ConfigurationItemId))
                .input('AttributeTypeId', mssql_1.default.BigInt, Number(row.AttributeTypeId))
                .input('TypeName', mssql_1.default.NVarChar(128), row.TypeName)
                .input('ValueString', mssql_1.default.NVarChar(mssql_1.default.MAX), row.ValueString ?? null)
                .input('ValueInt', mssql_1.default.Int, row.ValueInt ?? null)
                .input('ValueDecimal', mssql_1.default.Decimal(18, 4), row.ValueDecimal ?? null)
                .input('ValueDateTime', mssql_1.default.DateTime2, row.ValueDateTime ?? null)
                .input('ValueBoolean', mssql_1.default.Bit, row.ValueBoolean ?? null)
                .input('ValueEnumId', mssql_1.default.BigInt, row.ValueEnumId ?? null)
                .query(`
          INSERT INTO dbo.ConfigurationItemAttributes (
            ConfigurationItemId,
            AttributeTypeId,
            TypeName,
            ValueString,
            ValueInt,
            ValueDecimal,
            ValueDateTime,
            ValueBoolean,
            ValueEnumId,
            CreatedAt,
            UpdatedAt
          )
          OUTPUT INSERTED.ConfigurationItemId, INSERTED.AttributeTypeId, INSERTED.TypeName, INSERTED.ValueString, INSERTED.ValueInt, INSERTED.ValueDecimal, INSERTED.ValueDateTime, INSERTED.ValueBoolean, INSERTED.ValueEnumId, INSERTED.CreatedAt, INSERTED.UpdatedAt
          VALUES (
            @ConfigurationItemId,
            @AttributeTypeId,
            @TypeName,
            @ValueString,
            @ValueInt,
            @ValueDecimal,
            @ValueDateTime,
            @ValueBoolean,
            @ValueEnumId,
            SYSUTCDATETIME(),
            SYSUTCDATETIME()
          );
        `);
            const created = result.recordset[0];
            return created ? mapRowToItemAttribute(created) : {
                id: `attr-${Date.now()}`,
                itemId: input.itemId,
                key: input.key,
                value: input.value,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }
        catch {
            const now = new Date().toISOString();
            const nextAttribute = {
                id: `attr-${Date.now()}`,
                itemId: input.itemId,
                key: input.key,
                value: input.value,
                createdAt: now,
                updatedAt: now,
            };
            attributes.push(nextAttribute);
            return nextAttribute;
        }
    },
    update: async (input) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            const index = attributes.findIndex((attribute) => attribute.id === input.id);
            if (index === -1) {
                return undefined;
            }
            const current = attributes[index];
            const updated = {
                ...current,
                ...input,
                updatedAt: new Date().toISOString(),
            };
            attributes[index] = updated;
            return updated;
        }
        try {
            const row = mapInputToRow(input);
            const result = await pool.request()
                .input('AttributeTypeId', mssql_1.default.BigInt, Number(input.id))
                .input('ConfigurationItemId', mssql_1.default.BigInt, Number(row.ConfigurationItemId))
                .input('TypeName', mssql_1.default.NVarChar(128), row.TypeName)
                .input('ValueString', mssql_1.default.NVarChar(mssql_1.default.MAX), row.ValueString ?? null)
                .input('ValueInt', mssql_1.default.Int, row.ValueInt ?? null)
                .input('ValueDecimal', mssql_1.default.Decimal(18, 4), row.ValueDecimal ?? null)
                .input('ValueDateTime', mssql_1.default.DateTime2, row.ValueDateTime ?? null)
                .input('ValueBoolean', mssql_1.default.Bit, row.ValueBoolean ?? null)
                .input('ValueEnumId', mssql_1.default.BigInt, row.ValueEnumId ?? null)
                .query(`
          UPDATE dbo.ConfigurationItemAttributes
          SET ConfigurationItemId = @ConfigurationItemId,
              TypeName = @TypeName,
              ValueString = @ValueString,
              ValueInt = @ValueInt,
              ValueDecimal = @ValueDecimal,
              ValueDateTime = @ValueDateTime,
              ValueBoolean = @ValueBoolean,
              ValueEnumId = @ValueEnumId,
              UpdatedAt = SYSUTCDATETIME()
          OUTPUT INSERTED.ConfigurationItemId, INSERTED.AttributeTypeId, INSERTED.TypeName, INSERTED.ValueString, INSERTED.ValueInt, INSERTED.ValueDecimal, INSERTED.ValueDateTime, INSERTED.ValueBoolean, INSERTED.ValueEnumId, INSERTED.CreatedAt, INSERTED.UpdatedAt
          WHERE AttributeTypeId = @AttributeTypeId;
        `);
            return result.recordset[0] ? mapRowToItemAttribute(result.recordset[0]) : undefined;
        }
        catch {
            const index = attributes.findIndex((attribute) => attribute.id === input.id);
            if (index === -1) {
                return undefined;
            }
            const current = attributes[index];
            const updated = {
                ...current,
                ...input,
                updatedAt: new Date().toISOString(),
            };
            attributes[index] = updated;
            return updated;
        }
    },
    delete: async (id) => {
        const pool = await (0, sql_1.getSqlPool)();
        if (!pool) {
            const index = attributes.findIndex((attribute) => attribute.id === id);
            if (index === -1) {
                return false;
            }
            attributes.splice(index, 1);
            return true;
        }
        try {
            const result = await pool.request()
                .input('AttributeTypeId', mssql_1.default.BigInt, Number(id))
                .query(`
          DELETE FROM dbo.ConfigurationItemAttributes
          WHERE AttributeTypeId = @AttributeTypeId;
        `);
            return result.rowsAffected[0] > 0;
        }
        catch {
            const index = attributes.findIndex((attribute) => attribute.id === id);
            if (index === -1) {
                return false;
            }
            attributes.splice(index, 1);
            return true;
        }
    },
};
