# CmdbApi

Dieses Projekt stellt das Herzstück der Anwendung dar. Hier werden alle Methoden zur Datenverarbeitung und -speicherung implementiert.

## BusinessLogic

Der Zweig enthält alle Klassen zur Datenverarbeitung. Er verwendet die DataAccess-Komponenten, um Objekte aus den DataObjects- bzw. TransferObjects-Zweigen zu erzeugen und zu speichern.

## DataAccess

Dieser Zweig enthält alle Datenzugriffskomponenten. Die Datenbank enthält für alle Abfragen Stored Procedures, die über diese Klassen zugänglich gemacht werden. Grund für die Verlagerung der Speicherlogik in die Datenbank ist die hohe Performance, die so erreicht wird. Teilweise sind SELECT-Statements in der Datenbank mehr als 50 Mal schneller als entsprechende Auswahloperationen im Programmcode

## Factories

Die Anwendung setzt auf Factory-Patterns, um Objekte zu erzeugen. Diese Factories sind in diesem Zweig implementiert.

## Security

Alle sicherheitsrelevanten Funktionen werden in diesem Zweig realisiert.

## DataObjects / TransferObjects

In diesem Zweig werden Datenobjekte realisiert.

