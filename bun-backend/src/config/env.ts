import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  dbHost: process.env.DB_HOST ?? 'localhost',
  dbPort: Number(process.env.DB_PORT ?? 1433),
  dbName: process.env.DB_NAME ?? 'dc_cmdb',
  dbUser: process.env.DB_USER ?? 'sa',
  dbPassword: process.env.DB_PASSWORD ?? 'YourStrong!Passw0rd',
  dbEncrypt: (process.env.DB_ENCRYPT ?? 'false').toLowerCase() === 'true',
  dbTrustServerCertificate:
    (process.env.DB_TRUST_SERVER_CERTIFICATE ?? 'true').toLowerCase() === 'true',
};
