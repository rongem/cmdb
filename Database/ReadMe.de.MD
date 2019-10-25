# Database-Projekt

*Read this in other languages: [English](Readme.md)


Das Projekt enh�lt das Schema der Datenbank, d. h. alle Tabellen und alle Stored Procedures. Eine Grundregel bei der Erstellung war, dass alle Zugriffe auf Daten nur &uuml;ber Stored Procedures und nicht &uuml;ber direkte Tabellenzugriffe erfolgen. Das sichert einerseits die Applikationskonsistenz und sch&uuml;tzt vor Angriffen wie SQL Injections, andererseits ist die Performance erheblich h&ouml;her.

Da Performance ein wesentlicher Faktor f&uuml;r die Benutzerfreundlichkeit ist, sind au�erdem alle Auswertungen und Filterungen in den Stored Procedures realisiert.

