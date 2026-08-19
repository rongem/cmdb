# DcCmdb Bun Backend

Basis-Setup für ein Bun-basiertes Backend, das auf der SQL-Struktur aus dem Projekt aufsetzt.

## Verzeichnisstruktur

- `src/config` – Umgebungs- und Konfigurationswerte
- `src/db` – SQL-Verbindung, Bootstrap und Reset-Helpers
- `src/index.ts` – Express-Startpunkt

## Voraussetzungen

- Bun 1.x
- MS SQL Server / Azure SQL mit einer vorhandenen Datenbank
- Das Schema in `sql/mssql-2022-schema.sql`

## Setup

1. Kopieren Sie `.env.example` nach `.env` und anpassen.
2. Abhängigkeiten installieren:
   `bun install`
3. Schema in die Datenbank laden:
   `bun run db:bootstrap`
4. Server starten:
   `bun run dev`

## Endpunkte

- `GET /health`
- `GET /api/meta`

## Hinweise

Dieses Projekt ist bewusst als Basis-Infrastruktur angelegt. Die API-Route-Struktur und Domänen-Controller aus dem Node-Backend können in einem nächsten Schritt 1:1 nach Bun portiert werden.
