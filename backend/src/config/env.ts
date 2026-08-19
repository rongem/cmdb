import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  AUTH_MODE: z.enum(['jwt', 'ntlm', 'none']).default('jwt'),
  JWT_SECRET: z.string().default('local-development-secret'),
  DATABASE_URL: z.string().default('Server=localhost,1433;Database=cmdb_dev;User Id=sa;Password=YourStrong!Passw0rd;Encrypt=true;TrustServerCertificate=true;'),
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
});

export const env = envSchema.parse(process.env);
