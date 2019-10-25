# CMDB

*Read this in other languages: [English](README.md)

Hierbei handelt es sich um die WebGui zum Ansehen, Exportieren, Importieren und Editieren der Configuration Items sowie zur Administration des Systems.

# Voraussetzungen

Die Website muss auf einem Internet Information Server mit aktivierter Windows-Authentifizierung installiert werden.

Der Server muss Dom&auml;nenmitglied sein, weil sonst die Active-Directory-Abfragen nicht funktionieren.

Es ist ein SQL-Server in der Datei web.config als Datenquelle zu definieren, der das Datenschema aus dem Database-Projekt enth&auml;lt. Sofern Windows-Authentifizierung auf dem SQL-Server eingestellt ist, muss das Computerkonto des Webservers Ausf&uuml;hrungsrechte f&uuml;r Stored Procedures in der Datenbank haben. Zuweisung zu den Rollen DataReader oder h&ouml;her ist nicht erforderlich.

# Administrationsrechte

Administrationsrechte sollten explizit einzelnen Benutzern zugewiesen werden. Existiert kein Benutzer mit der Rolle "Administrator" in der Datenbank, verf&uuml;gt jeder authentifizierte Benutzer &uuml;ber Administrator-Rechte. Deshalb sollte die Administration direkt nach der Installation festgelegt werden.

# Veraltetes Projekt

Die Benutzeroberfl&auml;che wird derzeit in das Angular-Projekt ng-cmdb &uuml;berf&uuml;hrt. Die Administrationsoberfl&auml;che wurde bereits hier entfernt und steht nur noch in Angular zur Verf&uuml;gung. Sobald die gesamte Funktionalit&auml;t in Angular zur Verf&uuml;gung steht, wird die Benutzeroberfl&auml;che in diesem Projekt entfernt. Der REST-Service bleibt jedoch als Kernkomponente bis auf Weiteres bestehen.
