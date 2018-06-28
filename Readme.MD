# CMDB

## Geschichte

Das Projekt CMDB entstand aus der Not heraus, um eine generische, flexible CMDB zu erhalten, mit der wichtige Funktionen einer CMDB möglich waren, ohne gleich ein Produkt kaufen zu müssen.

Da der Begriff CMDB nicht geschützt ist, kann jeder Hersteller beliebige Produkte als CMDB verkaufen. Da die meisten dieser Produkte jedoch von einem Grundprodukt, wie einem Asset- oder Kabelmanagement, aus entwickelt wurden, tragen sie dessen Eigenschaften als Ballast mit sich herum. So wird ein Asset Management meist noch Gewicht oder Höhe erfordern, obwohl das für ein Configuation Item wie einen Datenbank-Cluster völlig sinnlos ist.

## Funktionen

Im Projekt können beliebig viele Itemtypen definiert werden. Jeder Itemtyp kann mit speziellen Attributen versehen werden, wobei die Attribute zum einfacheren Handling in Gruppen zusammengefasst werden. Außerdem kann jedes Item Verbindungen zu anderen Items besitzen.

Diese Verbindungen haben einen Typ und eine Richtung. Die Richtung innerhalb der eigenen CMDB sollte immer einheitlich gewählt werden, wobei egal ist, für welche Richtung man sich entscheidet. Die Räume eines Rechenzentrums können die oberste Ebene und die Services ganz unten sein, oder auch umgekehrt.

Eine wesentliche Funktion der CMDB ist die Möglichkeit, entlang von Verbindungen zu suchen. Damit lässt sich z. B. herausfinden, welche Services betroffen sind, wenn ein Raum ausfällt.

## Vorgehen

Die CMDB startet leer. Zuerst muss der Administrator mit der CmdbGui alle Typen (Items, Attribute, Verbindungen) und Verbindungsregeln definieren, erst dann kann die CMDB benutzt werden. Der Grund dafür, dass nicht mit einer vordefinierten Datenstruktur gestartet wird, liegt in der Erfahrung, dass man eine CMDB deutlich intelligenter nutzen kann, wenn man sich selbst Gedanken zur Datenstruktur macht. Die Strukur ist leicht ändern ist, weil sich z. B. Attributtypen in Itemtypen verwandeln lassen, wobei die Attribute gleich in Items umgewandelt werden.

Ziel muss es sein, nicht nur zu wissen, welche Itemtypen und Attribute man benötigt, sondern auch, wer für die Pflege der Daten zuständig ist. Erst wenn das geregelt ist, sollte man sich auf dem Markt nach einem geeigneten Produkt umsehen.

## Nachteile

Die CMDB ist ein einfaches System. Die hohe Flexibilität wird damit erkauft, dass z. B. die Attribute nur Textfelder sind, und es nicht möglich ist, z. B. Wertebereiche vorzugeben oder syntaktische Prüfungen durchzuführen.

Die Benutzerverwaltung muss momentan noch in der Datenbanktabelle cm_Roles durchgeführt werden, wobei eine AD-Gruppe oder ein Benutzerkonto eingetragen werden kann. Die Rolle wird über Zahlen festgelegt. 1 bedeutet Schreibrechte (Rolle Editor) auf die Daten, 2 bedeutet Administrationsrechte, d. h. Schreibrechte auch auf Typen und Regeln. Jeder Editor kann alle Objekte ändern, für die er die Verantwortung übernimmt. Eine Absicherung erfolgt durch History-Tabellen in der Datenbank, so dass z. B. gelöschte Items wiederhergestellt werden können.

## AddOns

Die CMDB wurde systematisch als konföderatives System gestaltet. So kann jedes Item mit Hyperlinks versehen werden, um in anderen Systemen (z. B. einem Wiki) weitere Informationen abzulegen und diese schnell zu erreichen. Über eine SOAP-API können beliebige Programme auf die Daten zugreifen, und alle Funktionen inklusive der administrativen ausführen. Die Sicherheitsmechanismen greifen auf dem Applikationsserver, d. h. es können auch über SOAP nur die Aktionen ausgeführt werden, für die der aufrufende Benutzer berechtigt ist.

Es existieren Addons zur Synchronisation mit VMware, mit HP c7000 Blade Enclosures und HP OneView Systemen für Synergy.

Zudem existiert ein Windows-Client namens RZ-Manager, der auf vorgegebene Datenstrukturen und Prozesse aufsetzt und zeigt, welche Möglichkeiten mit dem System sonst noch bestehen.

Die AddOns sind derzeit nicht Bestandteil des Quellcodes, werden aber nach und nach veröffentlicht.

## Bekannte Probleme

Derzeit ist die CmdbGui unvollständig, ledlich die Administration funktioniert darüber.

## Voraussetzungen

Das Projekt CMDB innerhalb der Projektmappe CMDB ist eine ASP.NET-Anwendung. Sie benötigt einen Internet Information Server und das .NET Framework 4.7.1 oder höher.

Zur Speicherung der Daten wird eine MS SQL Server Datenbank benötigt, deren Schema im Projekt Database enthalten ist. Der Datenzugriff erfolgt ausschließlich über Stored Procedures, allerdings ohne .NET-Code in der Datenbank.

CmdbGui ist eine Windows-Anwendung, die .NET Framework 4.7.1 als Laufzeitumgebung benötigt.