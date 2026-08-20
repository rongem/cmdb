# CMDB Backend

This backend is a strict ESM TypeScript project for a small CMDB API.

## Requirements

- Node.js 20+
- Docker Desktop or Docker Engine
- SQL Server 2022 via the provided Docker Compose setup

## Install

```bash
npm install
```

## Local development

### Start the SQL Server container

```bash
npm run db:start
```

### Bootstrap the schema

```bash
npm run db:bootstrap
```

### Load demo data

```bash
npm run db:seed
```

### Validate the schema

```bash
npm run db:validate
```

### Start the API in dev mode

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Type checking without emit

```bash
npm run check
```

### Production build

```bash
npm run build
```

### Start the built app

```bash
npm start
```

## Important notes

- The project uses strict ESM syntax and expects `.js` extension imports in TypeScript source files.
- The app falls back to in-memory data when the SQL Server is unavailable.
- Local database connection defaults are configured in `src/config/env.ts`.

## SQL Server local defaults

The default database connection is configured as:

```text
Server=localhost,1433;Database=cmdb_dev;User Id=sa;Password=YourStrong!Passw0rd;Encrypt=true;TrustServerCertificate=true;
```

## Typical local workflow

```bash
npm run db:start
npm run db:bootstrap
npm run db:seed
npm run dev
```
