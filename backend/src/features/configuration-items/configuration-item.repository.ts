import sql from 'mssql';
import { getSqlPool } from '../../db/sql';
import { ConfigurationItem, CreateConfigurationItemInput, UpdateConfigurationItemInput } from './configuration-item.types';

type ConfigurationItemRow = {
  ConfigurationItemId: number;
  Name: string;
  ItemTypeId: number;
  TypeName: string;
  TypeColor: string;
  CreatedAt: Date | string;
  UpdatedAt: Date | string;
};

const inMemoryItems: ConfigurationItem[] = [
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

const mapRowToConfigurationItem = (row: ConfigurationItemRow): ConfigurationItem => ({
  id: String(row.ConfigurationItemId),
  name: row.Name,
  type: row.TypeName,
  status: 'active',
  description: undefined,
  createdAt: new Date(row.CreatedAt).toISOString(),
  updatedAt: new Date(row.UpdatedAt).toISOString(),
});

const mapInputToRow = (input: CreateConfigurationItemInput | UpdateConfigurationItemInput) => ({
  Name: input.name,
  ItemTypeId: 1,
  TypeName: input.type,
  TypeColor: '#3b82f6',
});

export const configurationItemRepository = {
  list: async (): Promise<ConfigurationItem[]> => {
    const pool = await getSqlPool();
    if (!pool) {
      return inMemoryItems;
    }

    try {
      const result = await pool.request().query<ConfigurationItemRow>(`
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
    } catch {
      return inMemoryItems;
    }
  },

  getById: async (id: string): Promise<ConfigurationItem | undefined> => {
    const pool = await getSqlPool();
    if (!pool) {
      return inMemoryItems.find((item) => item.id === id);
    }

    try {
      const result = await pool.request()
        .input('ConfigurationItemId', sql.BigInt, Number(id))
        .query<ConfigurationItemRow>(`
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
    } catch {
      return inMemoryItems.find((item) => item.id === id);
    }
  },

  create: async (input: CreateConfigurationItemInput): Promise<ConfigurationItem> => {
    const pool = await getSqlPool();
    if (!pool) {
      const now = new Date().toISOString();
      const nextItem: ConfigurationItem = {
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
        .input('Name', sql.NVarChar(255), row.Name)
        .input('ItemTypeId', sql.BigInt, row.ItemTypeId)
        .input('TypeName', sql.NVarChar(128), row.TypeName)
        .input('TypeColor', sql.NVarChar(32), row.TypeColor)
        .query<ConfigurationItemRow>(`
          INSERT INTO dbo.ConfigurationItems (Name, ItemTypeId, TypeName, TypeColor, CreatedAt, UpdatedAt)
          OUTPUT INSERTED.ConfigurationItemId, INSERTED.Name, INSERTED.ItemTypeId, INSERTED.TypeName, INSERTED.TypeColor, INSERTED.CreatedAt, INSERTED.UpdatedAt
          VALUES (@Name, @ItemTypeId, @TypeName, @TypeColor, SYSUTCDATETIME(), SYSUTCDATETIME());
        `);

      const created = result.recordset[0];
      return mapRowToConfigurationItem(created);
    } catch {
      const now = new Date().toISOString();
      const nextItem: ConfigurationItem = {
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

  update: async (input: UpdateConfigurationItemInput): Promise<ConfigurationItem | undefined> => {
    const pool = await getSqlPool();
    if (!pool) {
      const index = inMemoryItems.findIndex((item) => item.id === input.id);
      if (index === -1) {
        return undefined;
      }

      const current = inMemoryItems[index];
      const updated: ConfigurationItem = {
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
        .input('ConfigurationItemId', sql.BigInt, Number(input.id))
        .input('Name', sql.NVarChar(255), row.Name)
        .input('ItemTypeId', sql.BigInt, row.ItemTypeId)
        .input('TypeName', sql.NVarChar(128), row.TypeName)
        .input('TypeColor', sql.NVarChar(32), row.TypeColor)
        .query<ConfigurationItemRow>(`
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
    } catch {
      const index = inMemoryItems.findIndex((item) => item.id === input.id);
      if (index === -1) {
        return undefined;
      }

      const current = inMemoryItems[index];
      const updated: ConfigurationItem = {
        ...current,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      inMemoryItems[index] = updated;
      return updated;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const pool = await getSqlPool();
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
        .input('ConfigurationItemId', sql.BigInt, Number(id))
        .query(`
          DELETE FROM dbo.ConfigurationItems
          WHERE ConfigurationItemId = @ConfigurationItemId;
        `);

      return result.rowsAffected[0] > 0;
    } catch {
      const index = inMemoryItems.findIndex((item) => item.id === id);
      if (index === -1) {
        return false;
      }

      inMemoryItems.splice(index, 1);
      return true;
    }
  },
};
