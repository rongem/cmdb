# CMDB

Hierbei handelt es sich um die WebGui zum Ansehen, Exportieren, Importieren und Editieren der Configuration Items sowie zur Administration des Systems.

# Voraussetzungen

Die Website muss auf einem Internet Information Server mit aktivierter WIndows-Authentifizierung installiert werden.

Der Server muss Domänenmitglied sein, weil sonst die Active-Directory-Abfragen nicht funktionieren.

Es ist ein SQL-Server in der Datei web.config als Datenquelle zu definieren, der das Datenschema aus dem Database-Projekt enthält. Sofern Windows-Authentifizierung auf dem SQL-Server eingestellt ist, muss das Computerkonto des Webservers Ausführungsrechte für Stored Procedures in der Datenbank haben. Zuweisung zu den Rollen DataReader oder höher ist nicht erforderlich.

# Administrationsrechte

Administrationsrechte sollten explizit einzelnen Benutzern zugewiesen werden. Existiert kein Benutzer mit der Rolle "Administrator" in der Datenbank, verfügt jeder authentifizierte Benutzer über Administrator-Rechte. Deshalb sollte die Administration direkt nach der Installation festgelegt werden.