# CMDB

*Read this in other languages: [English](README.md)

Hierbei handelt es sich um die Kernanwendung, die den Datenbankzugriff steuert und die Funktionen per SOAP und REST anbietet.

# Voraussetzungen

Die Website muss auf einem Internet Information Server mit aktivierter Windows-Authentifizierung installiert werden.

Der Server muss Dom&auml;nenmitglied sein, weil sonst die Active-Directory-Abfragen nicht funktionieren.

Es ist ein SQL-Server in der Datei web.config als Datenquelle zu definieren, der das Datenschema aus dem Database-Projekt enth&auml;lt. Sofern Windows-Authentifizierung auf dem SQL-Server eingestellt ist, muss das Computerkonto des Webservers Ausf&uuml;hrungsrechte f&uuml;r Stored Procedures in der Datenbank haben. Zuweisung zu den Rollen DataReader oder h&ouml;her ist nicht erforderlich.

# Administrationsrechte

Administrationsrechte f&uuml;r die Anwendung sollten explizit einzelnen Benutzern zugewiesen werden. Existiert kein Benutzer mit der Rolle "Administrator" in der Datenbank, verf&uuml;gt jeder authentifizierte Benutzer &uuml;ber Administrator-Rechte. Deshalb sollte die Administration direkt nach der Installation festgelegt werden.

# Veraltetes Projekt

Die Benutzeroberfl&auml;che wurde in das Angular-Projekt ng-cmdb &uuml;berf&uuml;hrt und aus diesem Projekt entfernt. Der REST-Service bleibt jedoch als Kernkomponente bis zur Portierung nach NodeJS bestehen.
