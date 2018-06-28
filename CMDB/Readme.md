# CMDB

Hierbei handelt es sich um die WebGui zum Ansehen, Exportieren und Editieren der Configuration Items.

# Voraussetzungen

Die Website muss auf einem Internet Information Server mit aktivierter Authentifizierung installiert werden.

Der Server muss Domänenmitglied sein, weil sonst die Active-Directory-Abfragen nicht funktionieren.

Es ist ein SQL-Server zu definieren. Sofern Windows-Authentifizierung auf dem SQL-Server eingestellt ist, muss das Computerkonto des Webservers Ausführungsrechte für Stored Procedures in der Datenbank haben.
