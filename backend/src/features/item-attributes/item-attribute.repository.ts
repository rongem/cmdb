import sql from 'mssql';
import { getSqlPool } from '../../db/sql.js';
import type { ItemAttribute, CreateItemAttributeInput, UpdateItemAttributeInput } from './item-attribute.types.js';

type ItemAttributeRow = {
  ConfigurationItemId: number;
  AttributeTypeId: number;
  TypeName: string;
  ValueString?: string | null;
  ValueInt?: number | null;
  ValueDecimal?: number | null;
  ValueDateTime?: Date | string | null;
  ValueBoolean?: boolean | null;
  ValueEnumId?: number | null;
  CreatedAt: Date | string;
  UpdatedAt: Date | string;
};

const attributes: ItemAttribute[] = [
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

const mapRowToAttributeValue = (row: ItemAttributeRow): ItemAttribute['value'] => {
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

const mapRowToItemAttribute = (row: ItemAttributeRow): ItemAttribute => ({
  id: String(row.AttributeTypeId),
  itemId: String(row.ConfigurationItemId),
  key: row.TypeName,
  value: mapRowToAttributeValue(row),
  createdAt: new Date(row.CreatedAt).toISOString(),
  updatedAt: new Date(row.UpdatedAt).toISOString(),
});

const mapInputToRow = (input: CreateItemAttributeInput | UpdateItemAttributeInput) => {
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
    } satisfies Partial<ItemAttributeRow>;
  }

  const row: Partial<ItemAttributeRow> = {
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

export const itemAttributeRepository = {
  listByItemId: async (itemId: string): Promise<ItemAttribute[]> => {
    const pool = await getSqlPool();
    if (!pool) {
      return attributes.filter((attribute) => attribute.itemId === itemId);
    }

    try {
      const result = await pool.request()
        .input('ConfigurationItemId', sql.BigInt, Number(itemId))
        .query<ItemAttributeRow>(`
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
    } catch {
      return attributes.filter((attribute) => attribute.itemId === itemId);
    }
  },

  getById: async (id: string): Promise<ItemAttribute | undefined> => {
    const pool = await getSqlPool();
    if (!pool) {
      return attributes.find((attribute) => attribute.id === id);
    }

    try {
      const result = await pool.request()
        .input('AttributeTypeId', sql.BigInt, Number(id))
        .query<ItemAttributeRow>(`
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
    } catch {
      return attributes.find((attribute) => attribute.id === id);
    }
  },

  create: async (input: CreateItemAttributeInput): Promise<ItemAttribute> => {
    const pool = await getSqlPool();
    if (!pool) {
      const now = new Date().toISOString();
      const nextAttribute: ItemAttribute = {
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
        .input('ConfigurationItemId', sql.BigInt, Number(row.ConfigurationItemId))
        .input('AttributeTypeId', sql.BigInt, Number(row.AttributeTypeId))
        .input('TypeName', sql.NVarChar(128), row.TypeName)
        .input('ValueString', sql.NVarChar(sql.MAX), row.ValueString ?? null)
        .input('ValueInt', sql.Int, row.ValueInt ?? null)
        .input('ValueDecimal', sql.Decimal(18, 4), row.ValueDecimal ?? null)
        .input('ValueDateTime', sql.DateTime2, row.ValueDateTime ?? null)
        .input('ValueBoolean', sql.Bit, row.ValueBoolean ?? null)
        .input('ValueEnumId', sql.BigInt, row.ValueEnumId ?? null)
        .query<ItemAttributeRow>(`
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
    } catch {
      const now = new Date().toISOString();
      const nextAttribute: ItemAttribute = {
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

  update: async (input: UpdateItemAttributeInput): Promise<ItemAttribute | undefined> => {
    const pool = await getSqlPool();
    if (!pool) {
      const index = attributes.findIndex((attribute) => attribute.id === input.id);
      if (index === -1) {
        return undefined;
      }

      const current = attributes[index];
      const updated: ItemAttribute = {
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
        .input('AttributeTypeId', sql.BigInt, Number(input.id))
        .input('ConfigurationItemId', sql.BigInt, Number(row.ConfigurationItemId))
        .input('TypeName', sql.NVarChar(128), row.TypeName)
        .input('ValueString', sql.NVarChar(sql.MAX), row.ValueString ?? null)
        .input('ValueInt', sql.Int, row.ValueInt ?? null)
        .input('ValueDecimal', sql.Decimal(18, 4), row.ValueDecimal ?? null)
        .input('ValueDateTime', sql.DateTime2, row.ValueDateTime ?? null)
        .input('ValueBoolean', sql.Bit, row.ValueBoolean ?? null)
        .input('ValueEnumId', sql.BigInt, row.ValueEnumId ?? null)
        .query<ItemAttributeRow>(`
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
    } catch {
      const index = attributes.findIndex((attribute) => attribute.id === input.id);
      if (index === -1) {
        return undefined;
      }

      const current = attributes[index];
      const updated: ItemAttribute = {
        ...current,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      attributes[index] = updated;
      return updated;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const pool = await getSqlPool();
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
        .input('AttributeTypeId', sql.BigInt, Number(id))
        .query(`
          DELETE FROM dbo.ConfigurationItemAttributes
          WHERE AttributeTypeId = @AttributeTypeId;
        `);

      return result.rowsAffected[0] > 0;
    } catch {
      const index = attributes.findIndex((attribute) => attribute.id === id);
      if (index === -1) {
        return false;
      }

      attributes.splice(index, 1);
      return true;
    }
  },
};
