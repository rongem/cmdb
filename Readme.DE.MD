# CMDB

*Read this in other languages: [English](README.md)

## Geschichte

Das Projekt CMDB entstand aus der Not heraus, um eine generische, flexible CMDB zu erhalten, mit der wichtige Funktionen einer CMDB m&ouml;glich waren, ohne gleich ein Produkt kaufen zu m�ssen.

Da der Begriff CMDB nicht gesch�tzt ist, kann jeder Hersteller beliebige Produkte als CMDB verkaufen. Da die meisten dieser Produkte jedoch von einem Grundprodukt, wie einem Asset- oder Kabelmanagement, aus entwickelt wurden, tragen sie dessen Eigenschaften als Ballast mit sich herum. So wird ein Asset Management meist noch Gewicht oder H�he erfordern, obwohl das f�r ein Configuation Item wie einen Datenbank-Cluster v�llig sinnlos ist.

Diese Vorpr�gung verhindert h�ufig die L�sung akuter Probleme, so dass man beim Kauf sehr genau wissen muss, was man ben�tigt. Da sich dieses Wissen nicht theoretisch erwerben l�sst, sorgte das Projekt CMDB f�r die notwendigen praktischen Kenntnisse und letztlich zur Formulierung des Lastenheftes.

## Funktionen

Im Projekt k�nnen beliebig viele Itemtypen definiert werden. Jeder Itemtyp kann mit speziellen Attributen versehen werden, wobei die Attribute zum einfacheren Handling in Gruppen zusammengefasst werden. Au�erdem kann jedes Item Verbindungen zu anderen Items besitzen.

Diese Verbindungen haben einen Typ und eine Richtung. Die Richtung innerhalb der eigenen CMDB sollte immer einheitlich gew�hlt werden, wobei egal ist, f�r welche Richtung man sich entscheidet. Die R�ume eines Rechenzentrums k�nnen die oberste Ebene und die Services ganz unten sein, oder auch umgekehrt.

Eine wesentliche Funktion der CMDB ist die M�glichkeit, entlang von Verbindungen zu suchen. Damit l�sst sich z. B. herausfinden, welche Services betroffen sind, wenn ein Raum ausf�llt.

## Vorgehen

Die CMDB startet leer, d. h. es gibt kein vorgefertigtes Datenmodell. Daher muss der Administrator zuerst alle Typen (Items, Attribute, Verbindungen) und Verbindungsregeln definieren, erst dann kann die CMDB benutzt werden. Der Grund daf�r, dass nicht mit einer vordefinierten Datenstruktur gestartet wird, liegt in der Erfahrung, dass man eine CMDB deutlich intelligenter nutzen kann, wenn man sich selbst Gedanken zur Datenstruktur macht. Die Strukur ist leicht �ndern, weil sich z. B. Attributtypen in Itemtypen verwandeln lassen, wobei die Attribute gleich in Items umgewandelt werden.

Ziel muss es sein, nicht nur zu wissen, welche Itemtypen und Attribute man ben�tigt, sondern auch, wer f�r die Pflege der Daten zust�ndig ist. Erst wenn das geregelt ist, sollte man sich auf dem Markt nach einem geeigneten Produkt umsehen.

## Nachteile

Die CMDB ist ein einfaches System. Die hohe Flexibilit�t wird damit erkauft, dass z. B. die Attribute nur Textfelder sind, und es nicht m�glich ist, z. B. Wertebereiche vorzugeben oder syntaktische Pr�fungen durchzuf�hren.

Es gibt drei Rollen: Administratoren, Editoren und Leser. Administrationsrechte beinhalten die Benutzerverwaltung und Schreibrechte auch auf Typen und Regeln. Jeder Editor kann alle Objekte �ndern, f�r die er die Verantwortung �bernimmt. Eine Absicherung erfolgt durch History-Tabellen in der Datenbank, so dass z. B. gel�schte Items wiederhergestellt werden k�nnen. Es ist nicht m�glich, Editoren auf bestimmte Objekttypen festzulegen. Zudem erh�lt jeder authentifizierte Benutzer, der nicht explizit einer der beiden Rollen zugewiesen ist, Leserechte auf alle Items. Es sollten also keine vertraulichen Informationen gespeichert werden.

## AddOns

Die CMDB wurde systematisch als konf�deratives System gestaltet. So kann jedes Item mit Hyperlinks versehen werden, um in anderen Systemen (z. B. einem Wiki) weitere Informationen abzulegen und diese schnell zu erreichen. Auch ist jedes Objekt �ber einen Link eindeutig adressierbar und kann somit in anderen Systemen verlinkt werden.

�ber eine SOAP-API k�nnen beliebige Programme auf die Daten zugreifen, und alle Funktionen inklusive der administrativen ausf�hren. Die Sicherheitsmechanismen greifen auf dem Applikationsserver, d. h. es k�nnen auch �ber SOAP nur die Aktionen ausgef�hrt werden, f�r die der aufrufende Benutzer berechtigt ist. Die Authentifizierung erfolgt �ber HTTP mit Windows-Benutzern aus der Dom�ne.

Es existieren Addons zur Synchronisation mit VMware, mit HP c7000 Blade Enclosures und HPE OneView Systemen f�r Synergy. Diese erm�glichen, Configuration Items automatisiert anpassen zu lassen, setzen daf�r aber ein bestimmtes Datenmodell voraus, das sie jedoch selbst erzeugen.

Zudem existiert ein Windows-Client namens RZ-Manager, der auf vorgegebene Datenstrukturen und Prozesse aufsetzt und zeigt, welche M�glichkeiten mit dem System sonst noch bestehen. Auch dieser setzt das genannte Datenmodell voraus.

Nur der RZ-Manager ist derzeit Bestandteil des Quellcodes, die anderen AddOns werden aber nach und nach ver�ffentlicht.

## Voraussetzungen

Das Projekt CMDB innerhalb der Projektmappe CMDB ist eine ASP.NET-Anwendung. Sie ben�tigt einen Internet Information Server und das .NET Framework 4.7.2 oder h�her.

Zur Speicherung der Daten wird eine MS SQL Server Datenbank ab Version 2012 ben�tigt, deren Schema im Projekt Database enthalten ist. Der Datenzugriff erfolgt ausschlie�lich �ber Stored Procedures. Diese verzichten konsequent auf .NET-Code in der Datenbank.

## Ausblick

Derzeit portiere ich die Benutzeroberfläche der CMDB auf Angular. Die Administrationsoberfläche ist bereits vollständig in Angular umgesetzt und wurde aus der ASP.NET-Anwendung entfernt. Die Angular-Anwendung enthält alle Funktionalitäten der ASP.NET-CMDB, außer (im Moment) Funktionen zum Export, Import und Editieren mehrerer Datensätze gleichzeitig. Diese will ich in den nächsten Wochen realisieren.

Weil ASP.NET Webforms von Microsoft nicht mehr unterstützt werden, habe ich mich entschieden, Schritt für Schritt vollständig weg von dieser Technologie zu entwickeln. Bis zur vollständigen Fertigstellung der Angular App bleibt der ASP.NET Rest Service als Kern bestehen. Außerdem wird das CMDB-Addon RZ-Manager, das auf Basis von WPF programmiert wurde, ebenfalls nach Angular portiert.

Derzeit habe ich noch nicht entschieden, ob die Kernanwendung mit den REST-Services nach .NET-Core oder nach NodeJS portiert wird. Sicher ist jedoch, dass sie auf eine andere Technologieplattform umgestellt wird.
