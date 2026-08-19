"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(3000),
    AUTH_MODE: zod_1.z.enum(['jwt', 'ntlm', 'none']).default('jwt'),
    JWT_SECRET: zod_1.z.string().default('local-development-secret'),
    DATABASE_URL: zod_1.z.string().default('Server=localhost,1433;Database=cmdb_dev;User Id=sa;Password=YourStrong!Passw0rd;Encrypt=true;TrustServerCertificate=true;'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:4200'),
});
exports.env = envSchema.parse(process.env);
