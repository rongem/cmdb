# Database-Projekt

Das Projekt enhält das Schema der Datenbank, d. h. alle Tabellen und alle Stored Procedures. Eine Grundregel bei der Erstellung war, dass alle Zugriffe auf Daten nur über Stored Procedures und nicht über direkte Tabellenzugriffe erfolgen. Das sichert einerseits die Applikationskonsistenz und schützt vor Angriffen wie SQL Injections, andererseits ist die Performance erheblich höher.

Da Performance ein wesentlicher Faktor für die Benutzerfreundlichkeit ist, sind außerdem alle Auswertungen und Filterungen in den Stored Procedures realisiert.

