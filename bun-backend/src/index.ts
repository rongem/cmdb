import express from 'express';
import { env } from './config/env';
import { query } from './db/mssql';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'dc-cmdb-bun-backend' });
});

app.get('/api/meta', async (_req, res) => {
  try {
    const rows = await query<{ TableName: string; RowCount: number }>(`
      SELECT 'Users' AS TableName, COUNT(*) AS RowCount FROM dbo.Users
      UNION ALL SELECT 'AttributeGroups', COUNT(*) FROM dbo.AttributeGroups
      UNION ALL SELECT 'ItemTypes', COUNT(*) FROM dbo.ItemTypes
      UNION ALL SELECT 'ConnectionTypes', COUNT(*) FROM dbo.ConnectionTypes
      UNION ALL SELECT 'ConfigurationItems', COUNT(*) FROM dbo.ConfigurationItems;
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed', detail: String(error) });
  }
});

const server = app.listen(env.port, () => {
  console.log(`Bun backend listening on http://localhost:${env.port}`);
});

process.on('SIGINT', async () => {
  server.close();
  process.exit(0);
});
