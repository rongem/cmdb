# CmdbApi

*Read this in other languages: [English](README.md)

Dieses Projekt stellt das Herzst&uuml;ck der Anwendung dar. Hier werden alle Methoden zur Datenverarbeitung und -speicherung implementiert.

## BusinessLogic

Der Ordner enth&auml;lt alle Klassen zur Datenverarbeitung. Er verwendet die DataAccess-Komponenten, um Objekte aus den DataObjects- bzw. TransferObjects-Zweigen zu erzeugen und zu speichern.

## DataAccess

Dieser Ordner enth&auml;lt alle Datenzugriffskomponenten. Die Datenbank enth&auml;lt f&uuml;r alle Abfragen Stored Procedures, die &uuml;ber diese Klassen zug&auml;nglich gemacht werden. Grund f&uuml;r die Verlagerung der Speicherlogik in die Datenbank ist die hohe Performance, die so erreicht wird. Teilweise sind SELECT-Statements in der Datenbank mehr als 50 Mal schneller als entsprechende Auswahloperationen im Programmcode.

## Factories

Die Anwendung setzt auf Factory-Patterns, um Objekte zu erzeugen. Diese Factories sind in diesem Zweig implementiert.

## Security

Alle sicherheitsrelevanten Funktionen werden in diesem Zweig realisiert.

## DataObjects / TransferObjects

In diesem Ordner werden Datenobjekte realisiert.

