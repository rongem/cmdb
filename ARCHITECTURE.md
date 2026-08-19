# Architekturrichtlinie für KI-Agenten

Diese Datei dient als verbindliche Leitlinie für alle Code-Änderungen in diesem Repository. Sie beschreibt das gewünschte Zielsystem und die verbindlichen Regeln für neue Änderungen. Der aktuelle Zustand in den Ordnern njs-backend und ng-frontend kann davon abweichen; dieser Leitfaden ist deshalb als Zielarchitektur und Richtlinie für modernisierte Änderungen zu verstehen, nicht als Beschreibung des kompletten Legacy-Status.

## 1. Projektziel

Das Repository enthält derzeit ein Legacy-System mit Angular, Node/Express, Mongoose, NgRx und Express-Validator. Der Rewrite soll auf eine moderne, saubere Architektur mit klaren Schichten, besserer Validierung und besserer Dokumentierbarkeit führen.

Dieses Dokument beschreibt das Zielsystem für die neue Umsetzung. Das neue Repository in den Verzeichnissen backend und frontend implementiert ein generisches CMDB-Werkzeug, das die Verwaltung von Items mit Attributen und Relationen zu verwalten:

- Backend als TypeScript-Express-Service mit SQL-Interaktion und Authentifizierung
- Frontend als Angular-App für Bedienung und Validierung
- Der Produktivbetrieb kann als getrennte Container oder als getrennte Deploy-Units erfolgen; das Frontend kann über nginx oder einen vergleichbaren Webserver ausgeliefert werden
- Sicherheitsmechanismen sind Teil der Anwendungslogik und nicht optional

Für die Authentifizierung gilt eine Legacy-Kompatibilitätsanforderung: Das Zielsystem muss die bisherigen Ausprägungen des Systems weiterhin respektieren und aufsetzen. Insbesondere müssen die bestehenden Authentifizierungsmethoden `ntlm` und `jwt` unterstützt werden. `none` bleibt nur als lokale Entwicklungs- oder Testoption und darf nicht als Produktivmodus verwendet werden.

Das System soll robust gegen falsche Daten, unsichere Anfragen und unzulässige Nutzerzugriffe sein.

### 1.1 Legacy-Status vs. Zielarchitektur

- Aktueller Legacy-Status: njs-backend und ng-frontend mit älteren Mustern, Mongoose, NgRx, Express-Validator und teilweise stark vermischter Geschäftslogik
- Aktuelle Legacy-Authentifizierung: `ntlm` und `jwt`, optional `none` nur für lokale Entwicklung / Test
- Zielzustand: saubere Schichtentrennung, SQL-basierter Backend-Kern, Zod-basierte Validierung, Angular-Signals im Frontend und klare API-Contracts
- Für neue Änderungen gilt immer die Zielarchitektur; bestehender Legacy-Code darf nur lokal und bewusst angepasst werden
- Die Authentifizierung muss die Legacy-Methoden weiterhin berücksichtigen; `ntlm` und `jwt` sind Mindestanforderungen, nicht nur historischer Ballast

### 1.2 Authentifizierungsstrategie

Die Zielarchitektur verfolgt eine klare, umgebungsabhängige Strategie:

- `jwt` ist der Standard für lokale Entwicklung und allgemeine API-Authentifizierung
- `ntlm` bleibt als kompatible Legacy-/Windows-Domänen-Option erhalten, insbesondere für Intranet- oder AD-basierte Umgebungen
- `none` bleibt nur für lokale Test- oder Sandbox-Umgebungen und darf niemals als Produktivmodus dienen
- `oauth2` / `oidc` ist kein unmittelbarer Implementationsschritt, sondern ein späterer Erweiterungspunkt für echte Enterprise-SSO-Umgebungen

Dieser Ansatz dient drei Zwecken:

1. lokale Entwicklung soll ohne Domänen-Setup und ohne manuelles Passwort-Handling funktionieren
2. Legacy-Kompatibilität bleibt gewahrt, ohne die moderne Architektur zu blockieren
3. echte External-IdP-Integrationen können später als klar definierte Erweiterung hinzugefügt werden, ohne die Kernarchitektur zu zerstören

OAuth2/OIDC darf in dieser Phase nicht „nur virtuell“ implementiert werden, ohne echte Prüfungen. Die Stolperfallen liegen in Token-Validation, Issuer-/Audience-Prüfung, PKCE, Redirect-URIs, Refresh-Flow, CORS, Token-Expiry und Rollen-/Claims-Mapping. Wenn diese Punkte nicht mit echten End-to-End-Tests abgesichert werden, führt das schnell zu falsch konfigurierten oder unbrauchbaren Auth-Mechanismen.

## 2. Technologiestack

### Backend (Zielarchitektur)
- TypeScript
- Node.js
- Express oder ein vergleichbarer minimaler HTTP-Server
- SQL-Datenbank (vorzugsweise SQL Server oder PostgreSQL, je nach Projektdatenmodell)
- `zod` für Runtime-Validierung und Schema-Definitionen
- Sicherheits-Middleware für Origin-Checks, CSRF, Rate-Limits, Request-Context

### Frontend (Zielarchitektur)
- Angular
- TypeScript
- Angular Signals und RXJS nur dort, wo es wirklich nötig ist
- Dev-Server mit Proxy zu `/api/*`

### Legacy-Status im Repository
- Aktuelles Backend in njs-backend arbeitet mit Express, Mongoose und Express-Validator
- Aktuelles Frontend in ng-frontend verwendet Angular mit NgRx-ähnlicher Store-Struktur
- Die Zielarchitektur ist modernisiert und dient als Leitfaden für weitere Entwicklungen, nicht als Beschreibung des aktuellen Legacystatus

### Teststrategie
- Backend-Tests mit Node/TypeScript Test-Runner
- Frontend-Tests mit Angular/Vitest-Umgebung
- Fokus auf echte Verhaltens- und Integrationsszenarien statt Mock-Only-Assertions

### 2.1 Festgelegte Architekturentscheidungen für das Lernprojekt

Die folgenden Entscheidungen sind verbindlich und sollen nicht erneut in jedem Sprint neu diskutiert werden:

1. Backend-Technologie: TypeScript + Express
2. Primäre Datenbank: SQL Server
3. Validierung: `zod`
4. Test-Runner: Node Test Runner
5. Zweck des Projekts: einfache Verwaltung von Configuration Items mit Attributen und Beziehungen
6. Grundprinzip: Backend ist die Daten- und Validierungsquelle, Frontend ist die UX-Schicht

Diese Punkte definieren die Grundlage für alle späteren Implementierungen. Sie sind bewusst bewusst einfach gehalten, weil das Lernprojekt auf klare fachliche Abläufe statt auf komplexe Enterprise-Funktionen abzielt.

## 3. Architekturelle Grundprinzipien

### 3.1 Separation of Concerns

Die Aufteilung folgt klaren Schichten:

- `src/app.ts`: globale App-Konstruktion, Middleware-Registrierung, Routen-Setup
- `src/routes/*`: HTTP-Routing und Parameter-Validierung; keine Geschäftslogik
- `src/controllers/*`: Request/Response-Orchestrierung; Daten auslesen, Services aufrufen, Antworten senden
- `src/services/*`: Business-Logic, fachliche Regeln, Ablaufkontrolle, Validierung und CRUD-Logik
- `src/repositories/*`: Datenbankzugriff und SQL-Abfragen
- `src/models/*`: Typen, DTOs, Rest-Modelle, Domain-Objekte
- `src/middleware/*`: Sicherheits- und Kontext-Middleware
- `src/config/*`: Umgebung, Laufzeit-Config, Validierung
- `src/utils/*`: Hilfsfunktionen, Logger, Metadaten-Helper, allgemeine Utilities

Bei Änderungen immer derselben Schicht treu bleiben. Eine Controller-Funktion darf keine SQL-Logik enthalten. Eine Repository-Datei darf keine HTTP-Response-Logik enthalten.

### 3.2 Kleine, explizite Migrations

- Keine breiten Refactorings ohne konkreten Zweck
- Funktionen und Klassen sollen fachlich klar benannt sein
- Für neue Features kleine, lokale Änderungen vorziehen
- Bestehende Struktur nicht „umdekorieren“, wenn das Problem lokal gelöst werden kann

### 3.3 Typ-Sicherheit und klare Contracts

- TypeScript-Typen sind verbindlich und sollten erweitert werden, wenn neue Datenmodelle eingeführt werden
- `Request`, `Response`, `HttpError`, DTOs und Domain-Modelle sollen sauber genutzt werden
- Neue API-Contracts müssen konsistent zwischen Backend, OpenAPI und Frontend gepflegt werden

### 3.4 Keine unkontrollierten Fehlerpfade

Fehler werden nicht einfach „durchgereicht“, sondern semantisch gemappt:

- `HttpError` für kontrollierte API-Fehler
- `logger` für structured logging
- Operationsergebnisse werden in einem klaren Status modelliert (`success`, `failed_validation`, `failed_internal`)
- Interne Fehler sollen nicht unangemessen als 5xx-Detail an den Client zurücklaufen

## 4. Backend-Architektur

### 4.1 Grundgerüst

Die zentralen App-Hooks liegen in der Zielarchitektur in `backend/src/app.ts` bzw. im aktuellen Legacy-Repo in `njs-backend/src/app.ts`:

- `app.disable('x-powered-by')`
- `setSecurityHeaders` global
- NTLM-Authentication optional abhängig von `AUTH_MODE`
- Routen unter `/api/v1` registrieren
- Sicherheits-Middleware für unsichere Methoden (Origin-Protection, CSRF, Rate-Limit)
- Fehler-Handler am Ende der Middleware-Kette

Die konkrete Ordnerstruktur kann je nach Umsetzung abweichen. Wichtiger ist die Schichtstruktur und Verantwortlichkeiten, nicht die absolute Pfadnamen.

Die Reihenfolge der Middleware ist wichtig:

1. Request-Context / Request-ID setzen
2. Authentifizierung/Authorization prüfen
3. Origin-Checks und CSRF für unsichere Methoden
4. Rate-Limits bei Schreiboperationen
5. Route-Handler
6. Globaler Error-Handler

### 4.2 Route- und Controller-Muster

Die vorhandene Struktur folgt einem klaren Muster:

- Route definiert die URL und delegiert an Controller-Funktionen
- Controller liest Request-Daten, ruft Services auf und beantwortet mit JSON
- Service enthält fachliche Validierungslogik
- Repository kapselt Zugriff auf SQL/DB

Neues Verhalten muss diesem Muster folgen. Eine Route darf nicht direkt auf die Datenbank oder auf unstrukturierte Logik zugreifen.

### 4.3 Authentifizierung und Autorisierung

Das Backend unterstützt ausdrücklich die im Legacy-System vorhandenen Modi sowie die moderne Entwicklungsstrategie:

- `AUTH_MODE=jwt` als Standard für lokale Entwicklung und allgemeine API-Authentifizierung
- `AUTH_MODE=ntlm` für Windows-Authentifizierung und Domänen-/Intranet-Umgebungen
- `AUTH_MODE=none` nur für lokale Entwicklung / Test
- `AUTH_MODE=oidc` oder `oauth2` als spätere, klar definierte Enterprise-Erweiterung, aber nicht als unmittelbarer Implementationsschritt
- Autorisierung über eine spezielle Tabelle, z. B. `_Authorizations`

Wichtige Regeln:

- `AUTH_MODE=jwt` ist der bevorzugte Standard für neue lokale Entwicklungs- und API-Setups
- `AUTH_MODE=ntlm` und `AUTH_MODE=jwt` sind die produktiven, legacy-kompatiblen Varianten und müssen in der Zielarchitektur weiterhin berücksichtigt werden
- `AUTH_MODE=none` darf nie unbeaufsichtigt in Produktion verwendet werden
- Nutzerbezogene Informationen aus NTLM sollten sauber in `req.userName` / `req.userName`-ähnlichen Kontexten verarbeitet werden
- Zugriffsprüfung darf nicht in Routes selbst erfolgen, sondern in Authorization-Middleware bzw. Services
- OAuth2/OIDC darf nicht implementiert werden, ohne echte End-to-End-Tests zu validieren; die Absicherung muss auf realen Tokens, Redirect-/Callback-Flows und Claim-Prüfungen beruhen
- Ein möglicher Modernisierungspfad muss `jwt` als bevorzugte moderne Variante festlegen, aber `ntlm` muss als komplementäre Legacy-Option weiterhin tragfähig bleiben

#### Warum dieser Punkt wichtig ist: User-Kontext und Authentifizierung

Der wichtige Unterschied zwischen “nur ein Token prüfen” und “einen brauchbaren User-Kontext schaffen” ist der folgende:

- Die Anwendung muss nicht nur wissen, ob ein Request ein gültiges JWT hat
- sondern auch, wer der Benutzer ist, welche Rolle er hat und welche Operationen ihm erlaubt sind

Das muss im Backend in einem klaren, immer gleichen Format vorliegen. Typisch sieht das so aus:

```ts
req.user = {
  id: 'u-123',
  userName: 'max.mustermann',
  roles: ['editor'],
  authMode: 'jwt',
  tenantId: 'default'
}
```

Dieser Kontext wird in einer Authorization-Middleware gesetzt und danach für alle nachfolgenden Controller und Services nutzbar. Dadurch bleibt der Code konsistent:

- kein Wildwuchs an `req.headers`, `req.userName` oder Spezialfällen im Controller
- keine Rolle „irgendwo im Code verborgen“
- jede fachliche Operation kann dieselbe Benutzer- und Berechtigungslogik verwenden

Das ist gerade bei einem CMDB-/Configuration-Item-System wichtig, weil nicht jeder Benutzer dieselben Items editieren darf. Eine gemeinsame `req.user`-Struktur macht die Implementierung von `read`, `update`, `delete` und `authorize` deutlich einfacher und weniger fehleranfällig.

### 4.4 CRUD- und Validierungsfluss für Configuration Items

Das Kerngeschäft des Lernprojekts ist die Verwaltung von Configuration Items, ihren Attributen und ihren Beziehungen. Der fachliche Ablauf ist bewusst einfach und klar strukturiert:

- Item anlegen
- Item lesen und anzeigen
- Item aktualisieren
- Item löschen bzw. deaktivieren
- Attribute und Beziehungen validieren
- Änderungen persistieren nur nach erfolgreicher fachlicher Prüfung

Die fachliche Logik für diese Operationen ist:

- ein neues Item darf nur mit gültigen Pflichtfeldern und erlaubten Attributwerten angelegt werden
- Aktualisierungen müssen die vorhandenen Domain-Regeln respektieren, z. B. Typvalidität, Namens-/Kennzeichnungsregeln und erlaubte Beziehungen
- das System muss zwischen fachlichen Validierungsfehlern und technischen Fehlern sauber unterscheiden
- das Backend ist die autoritative Stelle für Datenintegrität; der Client kann nur die UI-Validierung und die Bedienung abbilden
- jede relevante Änderung muss mit einem nachvollziehbaren Audit-Kontext versehen werden

Die Audit- und Änderungslogik muss erhalten bleiben:

- `requestId` für Korrelation
- `userName` für Nachvollziehbarkeit
- `operation` (`create` / `read` / `update` / `delete`)
- `itemId` bzw. `entityType`
- `status` und ggf. `validationErrors`

Diese Felder dokumentieren den fachlichen Verlauf der Datenerfassung und sind für ein Lernprojekt wichtiger als aufwändige Import-Mechaniken.

## 5. Frontend-Architektur

### 5.1 Frontend-Role

Das Frontend ist die fachliche Bedienoberfläche für die Verwaltung von Configuration Items, aber nicht die Quelle der fachlichen Wahrheit und nicht die primäre Sicherheitsbarriere. Es dient:

- Listen von Configuration Items anzeigen
- Details und Formulare für die Bearbeitung öffnen
- Attribute und Beziehungen darstellen
- Validierungsfehler für den Nutzer verständlich anzeigen
- Speichern, Aktualisieren und Löschen auslösen

Für das Lernprojekt bedeutet das: Das Frontend soll dem Benutzer helfen, Configuration Items sauber zu erfassen und zu pflegen. Es kann Statusanzeigen, Felder, Fehlerlisten und Tabellen darstellen, aber die eigentliche fachliche Entscheidung liegt auf der Backend-Seite. Der Server prüft ob Werte zulässig sind, ob Pflichtfelder erfüllt sind und ob die Änderung konsistent mit den Datenregeln ist.

Diese Trennung ist wichtig:

- das Frontend kann Hinweise für den Benutzer rendern, aber nicht autoritativ validieren
- die fachliche Entscheidung über zulässige Werte, Typen und Konsistenz muss auf dem Server getroffen werden
- das Frontend darf die Fachlogik nur sauber abbilden, nicht selbst Sicherheits- oder Datenintegritätslogik ersetzen

Das Frontend darf nicht als Sicherheitsmechanismus verstanden werden. Es kann nur UX-Feedback liefern; der Server entscheidet über Autorisierung, fachliche Validierung und Persistenz.

### 5.2 Produktionsmodus

Im Produktions-Setup dient das Backend als Host für die gebaute Angular-Frontend-Ansicht. Das Frontend darf nicht als eigenständige App mit eigener Businesslogik im Backend interpretiert werden; Produktiv- und Dev-Modi müssen kompatibel bleiben.

### 5.3 API Contracts

Die Frontend-Integration basiert auf stabilen Data Contracts. Insbesondere gilt für Spalten-Metadaten:

- Backend-neutraler Contract mit `constraints`
- `logicalTypes` statt vendor-spezifischer Typen bevorzugen
- Fallbacks nur für Legacy-Kompatibilität akzeptieren

Ein neuer Backend-Datentyp sollte grundsätzlich zuerst im generischen Contract modelliert werden, nicht als Frontend-Hack.

## 6. Sicherheitsrichtlinien

Diese Regeln sind bindend:

- Origin allow list für unsichere HTTP-Methoden
- CSRF-Schutz für mutierende Requests
- Rate-Limits für Schreiboperationen
- sichere Header via Security Middleware
- keine direkten SQL-Statements aus Controllern/Routes
- keine Verarbeitung von untrusted input ohne Validierung
- keine Datenschutz-/Audit-Logik unterdrücken, wenn DB-Importe ausgelöst werden

Besonders wichtig:

- `AUTH_MODE=none` nur lokal oder in speziell gekennzeichneten Testumgebungen
- keine Freigabe interner Fehlerdetails an Clients
- keine Öffnung von Admin-/Metadaten-Endpunkten für unautorisierte Nutzer

## 7. Konventionen für neue Änderungen

### 7.1 Wenn du eine neue Route ergänzt
- Route im passenden Route-Modul definieren, z. B. `routes/*.route.ts` oder `features/*/routes/*.ts`
- Controller-Funktion in passendem Controller-Modul anlegen
- Business-Logik in `services/*.service.ts` oder `application/use-cases/*.ts` verschieben
- SQL-Zugriffe in `repositories/*.repository.ts` oder `infrastructure/*.ts`
- DTO/Typ in `models` oder einem passenden Domain-/Contract-Paket ergänzen
- API-Response und Error-Handling konsistent halten

Wichtig: Die konkrete Pfadangabe kann je nach Projektstruktur variieren. Die entscheidende Regel bleibt: Route, Controller, Service und Repository müssen sauber getrennt bleiben.

### 7.2 Wenn du neue DB-Logik ergänzt
- Repository-Muster beibehalten
- keine SQL-Strings im Controller bauen
- Parameterisierung und sichere SQL-Konstruktion bevorzugen
- keine Tabellen-/Schema-Namen ohne Validierung aus raw inputs übernehmen

### 7.3 Wenn du eine API erweitert
- OpenAPI/Dokumentation in `openapi.yaml` aktualisieren
- Typ-Contract im Backend und Frontend berücksichtigen
- Frontend-Validierung und Backend-Validierung logisch abstimmen

### 7.4 Wenn du Sicherheitslogik änderst
- Auswirkungen auf CORS, CSRF, Autorisierung und Request-Context prüfen
- keine Sicherheitsprüfungen „nur im Frontend“ setzen
- Änderungen so minimal wie möglich, aber vollständig im Back-End-Stack verankern

## 8. Test- und Qualitätsanforderungen

- Vor einem Fix eine nachvollziehbare Ursache bestimmen
- Relevante Tests vor dem Patch ausführen, wenn vorhanden
- Keine Mock-Assertions auf reine Mock-Befehle ersetzen echte Verhaltenstests
- Bei API-Änderungen die betroffenen Backend-/Frontend-Tests mitlaufen lassen
- Neue Funktionen ohne passende Prüfung nicht einbauen

Empfohlene Prüfungsbefehle:

- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`
- Lokaler Backend-Dev-Run: `cd backend && npm run dev:local`
- Frontend-Dev-Run: `cd frontend && npm run start`

## 9. Entscheidungshilfe für KI-Agenten

Wenn ein Vorschlag zwischen mehreren Architekturoptionen unsicher ist, bevorzugt die Anwendung diese Reihenfolge:

1. Bestehende Schichtung und Namenskonventionen beibehalten
2. Kleinste, lokale Änderung mit klarer Kapselung
3. Sicherheits- und Validierungsregeln nicht umgehen
4. API-Contracts konsistent erweitern
5. Tests/Verifikation nach der Änderung ergänzen

## 10. Verbotene Muster

Die KI darf diese Muster in diesem Projekt nicht reproduzieren:

- Controller mit direkte SQL-Zugriffen
- Frontend-Only-Sicherheitsprüfung statt Backend-Sicherung
- unstrukturierte Fehlerausgabe oder Dev-Details im Produktivpfad
- Überschreiben bestehender API-Contracts ohne Gegenprüfung
- Einführung neuer Abhängigkeits- oder Architekturpatterns ohne Notwendigkeit
- breite, unübersichtliche Refactorings ohne Ziel

## 11. Kurzform für Agenten

Wenn du in diesem Repo arbeitest:

- halte dich an die bestehende Schichtstruktur
- erweitere keine Verantwortlichkeiten über die Schichten hinweg
- sichere alle mutierenden Endpunkte mit den vorhandenen Sicherheitsmechanismen
- behandle Datenvalidierung und Audit-Logging wie ein Kernfeature
- halte Änderungen klein, typisiert und verifizierbar

Das Ziel ist ein robustes, leicht verständliches Backend-Frontend-System, das auf sichere, gut dokumentierte und prüfbare Importspezifikationen setzt.
