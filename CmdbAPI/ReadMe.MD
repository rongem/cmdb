# CmdbApi

Dieses Projekt stellt das Herzst�ck der Anwendung dar. Hier werden alle Methoden zur Datenverarbeitung und -speicherung implementiert.

## BusinessLogic

Der Zweig enth�lt alle Klassen zur Datenverarbeitung. Er verwendet die DataAccess-Komponenten, um Objekte aus den DataObjects- bzw. TransferObjects-Zweigen zu erzeugen und zu speichern.

## DataAccess

Dieser Zweig enth�lt alle Datenzugriffskomponenten. Die Datenbank enth�lt f�r alle Abfragen Stored Procedures, die �ber diese Klassen zug�nglich gemacht werden. Grund f�r die Verlagerung der Speicherlogik in die Datenbank ist die hohe Performance, die so erreicht wird. Teilweise sind SELECT-Statements in der Datenbank mehr als 50 Mal schneller als entsprechende Auswahloperationen im Programmcode

## Factories

Die Anwendung setzt auf Factory-Patterns, um Objekte zu erzeugen. Diese Factories sind in diesem Zweig implementiert.

## Security

Alle sicherheitsrelevanten Funktionen werden in diesem Zweig realisiert.

## DataObjects / TransferObjects

In diesem Zweig werden Datenobjekte realisiert.
