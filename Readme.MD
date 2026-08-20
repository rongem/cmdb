# 20260501 no longer supported

# CMDB

CDMB a.k.a. DC CMDB is a native configuration management system that can be used for ITIL.

For more details see the [Wiki](http://github.com/rongem/cmdb/wiki)


# DcCmdb

This repository contains a small CMDB learning project with a TypeScript ESM backend and an Angular frontend.

## Stack

- Backend: Node.js + TypeScript + Express + ESM
- Database: SQL Server 2022 via Docker
- Frontend: Angular

## Project structure

- `backend/` – API server, database bootstrap, tests, local SQL workflow
- `ng-frontend/` – Angular frontend application
- `sql/` – SQL Server schema and scripts
- `docker-compose.yml` – main project stack
- `docker-compose-dev.yml` – developer-oriented runtime setup

## Quick start

### 1) Install dependencies

```bash
cd backend
npm install
```

### 2) Start local SQL Server

```bash
cd backend
npm run db:start
```

### 3) Bootstrap schema

```bash
cd backend
npm run db:bootstrap
```

### 4) Seed demo data

```bash
cd backend
npm run db:seed
```

### 5) Run backend in dev mode

```bash
cd backend
npm run dev
```

### 6) Run frontend

```bash
cd ng-frontend
npm install
npm start
```

## Useful backend commands

```bash
cd backend
npm run check
npm test
npm run build
npm run db:validate
npm run db:reset
```

## Notes

- The backend is configured as a strict ESM TypeScript project.
- Local SQL Server defaults use `localhost:1433` with the `sa` user.
- The backend falls back to in-memory data when the database is unavailable.

## Default local database settings

```text
Server=localhost,1433;Database=cmdb_dev;User Id=sa;Password=YourStrong!Passw0rd;Encrypt=true;TrustServerCertificate=true;
```
