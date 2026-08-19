# SQL-Schema für MSSQL

Dieses Verzeichnis enthält ein SQL Server 2022 Schema, das auf Basis der Mongoose-Modelle in [njs-backend/src/models/mongoose](../njs-backend/src/models/mongoose) abgeleitet wurde.

## Dateien

- [mssql-2022-schema.sql](mssql-2022-schema.sql): vollständiges DDL für MSSQL 2022

## Entwurfsprinzipien

- Relationale Normalisierung statt Mongo-ähnlicher eingebetteter Arrays
- Fremdschlüssel für alle Referenzen zwischen Entity-Typen, Verbindungen und Historie
- Eindeutige Constraints und Indexe entsprechen den Mongoose-Unique- und Lookup-Regeln
- Historisierungs-Tabellen für konfigurierte CIs und Verbindungen als separate Versions-/Snapshots-Modelle

## Hinweise zu MSSQL 2022 vs. 2025

Das erstellte Schema nutzt bewusst Features, die bereits in SQL Server 2022 stabil und breit unterstützt sind.

MSSQL 2025 würde vor allem bei folgenden Bereichen einen Unterschied machen:

- JSON-/document-first Datenspeicherung und stärkere JSON-Query-Funktionen
- Erweiterte Analyse- und Performance-Features bei großen historisierten Datensätzen
- Weitere Verbesserungen bei temporären Tabellen und Optimierungen in großen OLTP-/Reporting-Szenarien

Für den aktuellen Modellstil, der auf klaren Relationen und Referenzintegrität basiert, ist eine MSSQL-2022-Lösung jedoch vollständig passend und deutlich robusteren als eine JSON-Only-Lösung. Ich würde deshalb erst dann auf 2025-spezifische Features umschalten, wenn der Datenzugriff bewusst document-first oder schema-flexibler werden soll.

## Nächster sinnvoller Schritt

Als Nächstes empfehle ich die Erstellung einer kleinen Migration mit Beispieldaten, damit die Mapping-Regeln von Mongo-Objekten nach SQL-Tabellen gegen echte Datensätze überprüft werden können.
