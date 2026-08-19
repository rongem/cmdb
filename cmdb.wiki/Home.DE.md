# CMDB

*Read this in other languages: [English](Home)

## Geschichte

Das Projekt CMDB entstand aus der Not heraus, um eine generische, flexible CMDB zu erhalten, mit der wichtige Funktionen einer CMDB m&ouml;glich waren, ohne gleich ein Produkt kaufen zu m&uuml;ssen.

Da der Begriff CMDB nicht gesch&uuml;tzt ist, kann jeder Hersteller beliebige Produkte als CMDB verkaufen. Da die meisten dieser Produkte jedoch von einem Grundprodukt, wie einem Asset- oder Kabelmanagement, aus entwickelt wurden, tragen sie dessen Eigenschaften als Ballast mit sich herum. So wird ein Asset Management meist noch Gewicht oder H&ouml;he erfordern, obwohl das f&uuml;r ein Configuation Item wie einen Datenbank-Cluster v&ouml;llig sinnlos ist.

Diese Vorpr&auml;gung verhindert h&auml;ufig die L&ouml;sung akuter Probleme, so dass man beim Kauf sehr genau wissen muss, was man ben&ouml;tigt. Da sich dieses Wissen nicht theoretisch erwerben l&auml;sst, sorgte das Projekt CMDB f&uuml;r die notwendigen praktischen Kenntnisse und letztlich zur Formulierung des Lastenheftes.

## Funktionen

Im Projekt k&ouml;nnen beliebig viele Itemtypen definiert werden. Jeder Itemtyp kann mit speziellen Attributen versehen werden, wobei die Attribute zum einfacheren Handling in Gruppen zusammengefasst werden. Au&szlig;erdem kann jedes Item Verbindungen zu anderen Items besitzen.

Diese Verbindungen haben einen Typ und eine Richtung. Die Richtung innerhalb der eigenen CMDB sollte immer einheitlich gew&auml;hlt werden, wobei egal ist, f&uuml;r welche Richtung man sich entscheidet. Die R&auml;ume eines Rechenzentrums k&ouml;nnen die oberste Ebene und die Services ganz unten sein, oder auch umgekehrt.

Eine wesentliche Funktion der CMDB ist die M&ouml;glichkeit, entlang von Verbindungen zu suchen. Damit l&auml;sst sich z. B. herausfinden, welche Services betroffen sind, wenn ein Raum ausf&auml;llt.

## Vorgehen

Die CMDB startet leer, d. h. es gibt kein vorgefertigtes Datenmodell. Daher muss der Administrator zuerst alle Typen (Items, Attribute, Verbindungen) und Verbindungsregeln definieren, erst dann kann die CMDB benutzt werden. Der Grund daf&uuml;r, dass nicht mit einer vordefinierten Datenstruktur gestartet wird, liegt in der Erfahrung, dass man eine CMDB deutlich intelligenter nutzen kann, wenn man sich selbst Gedanken zur Datenstruktur macht. Die Strukur ist leicht &auml;ndern, weil sich z. B. durch eine Funktion Attributtypen in Itemtypen verwandeln lassen, wobei die Attribute gleich in Items umgewandelt werden.

Ziel muss es sein, nicht nur zu wissen, welche Itemtypen und Attribute man ben&ouml;tigt, sondern auch, wer f&uuml;r die Pflege der Daten zust&auml;ndig ist. Erst wenn das geregelt ist, sollte man sich auf dem Markt nach einem geeigneten Produkt umsehen.

## Nachteile

Die CMDB ist ein einfaches System. Die hohe Flexibilit&auml;t wird damit erkauft, dass z. B. die Attribute nur Textfelder sind, und es nur mit Aufwand m&ouml;glich ist, z. B. Wertebereiche vorzugeben oder syntaktische Pr&uuml;fungen durchzuf&zuml;hren. Zuletzt wurde eine &Uuml;berpr&uuml;fung der Attributwerte anhand von regul&auml;ren Ausdr&uuml;cken eingef&uuml;hrt, mit der f&uuml;r jeden Attributtypen festgelegt werden kann, nur bestimmte Formate zu akzeptieren, z. B. IP-Adressen.

Es gibt drei Rollen: Administratoren, Editoren und Leser. Administrationsrechte beinhalten die Benutzerverwaltung und Schreibrechte auch auf Typen und Regeln. Jeder Editor kann alle Objekte &auml;ndern, f&uuml;r die er die Verantwortung &uuml;bernimmt. Eine Absicherung erfolgt durch History-Tabellen in der Datenbank, so dass z. B. gel&ouml;schte Items wiederhergestellt werden k&ouml;nnen. Es ist nicht m&ouml;glich, Editoren auf bestimmte Objekttypen festzulegen. Zudem erh&auml;lt jeder authentifizierte Benutzer, der nicht explizit einer der beiden Rollen zugewiesen ist, Leserechte auf alle Items. Es sollten also keine vertraulichen Informationen gespeichert werden.

## AddOns

Die CMDB wurde systematisch als konf&ouml;deratives System gestaltet. So kann jedes Item mit Hyperlinks versehen werden, um in anderen Systemen (z. B. einem Wiki) weitere Informationen abzulegen und diese schnell zu erreichen. Auch ist jedes Objekt &uuml;ber einen Link eindeutig adressierbar und kann somit in anderen Systemen verlinkt werden.

&Uuml;ber eine REST-API k&ouml;nnen beliebige Programme auf die Daten zugreifen, und alle Funktionen inklusive der administrativen ausf&uuml;hren. Die Sicherheitsmechanismen greifen auf dem Applikationsserver, d. h. es k&ouml;nnen auch &uuml;ber REST nur die Aktionen ausgef&uuml;hrt werden, f&uuml;r die der aufrufende Benutzer berechtigt ist. Die Authentifizierung erfolgt &uuml;ber HTTP mit JWT oder alternativ mit Windows-Benutzern aus der Dom&auml;ne.

Als primäres Frontend dient eine Angular App. Zudem existiert ein Angular-Client namens DCMan (DataCenter Manager), der auf vorgegebene Datenstrukturen und Prozesse aufsetzt und zeigt, welche M&ouml;glichkeiten mit dem System sonst noch realisierbar sind. dieser setzt ein Datenmodell voraus, das er bei der ersten Verbindung mit dem Backend anlegt.

Es können eigene Addons, z. B. zur Synchronisation mit VMware oder HPE OneView, geschaffen werden.

## Voraussetzungen

Das Projekt **njs-backend** ist eine NodeJS/Express-Anwendung. Sie ben&ouml;tigt NodeJS. Zur Speicherung der Daten wird eine MongoDB noSQL-Datenbank ben&ouml;tigt.

Das Projekt **ng-frontent** enthält drei Angular-Apps: _cmdb_, _dcman_ und _migration-tool_. Letzteres dient zur Migration von der alten ASP.NET-Umgebung auf das neue System. Die Apps _cmdb_ und _dcman_ benötigen die Bibliothek _backend-access_.

## Ausblick

Die Anwendung wird für Containerisierung vorbereitet, so dass sie auf jeder Kubernetes Cloud lauffähig ist.

Darüber hinaus plane ich noch ein Frontend, das ein wenig an Microsoft SharePoint Listen erinnert, und in dem alle Item-Typen als Tabellen dargestellt werden.
