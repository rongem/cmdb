<%@ Page Language="C#" MasterPageFile="~/HelpPages/help.master" AutoEventWireup="true" %>
<asp:Content ID="cSectionHeader" ContentPlaceHolderID="cphSectionHeader" runat="server">
    Configuration Item bearbeiten
</asp:Content>
<asp:Content ID="cSectionArticle" ContentPlaceHolderID="cphSectionArticle" runat="Server">
    <p>
        Sofern der aktuelle Benutzer über die Rechte verfügt, kann er Configuration Items 
        bearbeiten. Jedes CI kann aber nur dann bearbeitet werden, wenn der Benutzer dafür 
        verantwortlich ist. Sofern der Benutzer die Verantwortung für das CI nicht besitzt, 
        kann er die Verantwortung über die entsprechende Schaltfläche übernehmen.
    </p>
    <p>
        Bei einem Objekt kann der Name geändert werden. Dazu wird das Textfeld entsprechend 
        bearbeitet. Die Änderung des Namens ist die einzige Änderung, die über die Schaltfläche 
        "Namensänderung speichern" durchgeführt werden muss. Alle anderen Änderungen erfolgen 
        über ihre eigenen Schaltflächen.
    </p>
    <p>
        Generell werden neue Attribute, Links oder Abhängigkeiten über ein gelbes Plus-Symbol 
        neu angelegt, über ein Stift-Symbol bearbeitet und über ein rotes X gelöscht.
    </p>
    <h1>Bearbeitung</h1>
    <h2>Attribute</h2>
    <p>
        Attribute sind über Attributgruppen einem CI-Typen zugeordnet. Ein Attribut kann, aber 
        muss nicht, gesetzt werden.
    </p>
    <p>
        Vorhandene Attribute können bearbeitet werden. Sowohl das Anlegen als auch das Bearbeiten 
        erfolgt über ein Textfeld, in dem der Wert editiert wird. Dabei können maximal 50 Zeichen 
        Text eingegeben werden. Es erfolgt keine Plausibilitätsprüfung, d. h. der Text kann beliebig 
        sein, er darf nur nicht leer bleiben oder nur aus Leerzeichen bestehen.
    </p>
    <p>
        Vorhandene Attribute können gelöscht werden.
    </p>
    <h2>Doku-Links</h2>
    <p>
        Doku-Links sind Hyperlinks, die auf Webseiten verweisen, die nähere Informationen zu einem 
        CI enthalten. Es können aber auch andere Links, z. B. auf das iLO-Board einer Server-Hardware 
        hinzugefügt werden.
    </p>
    <h2>Verantwortliche</h2>
    <p>
        Hier wird eine Liste der Verantwortlichen angegeben. Jeder kann die Verantwortung für ein Objekt 
        aufgeben, sofern er nicht der letzte Verantwortliche ist.
    </p>
    <p>
        Über einen Link besteht die Möglichkeit, einem Verantwortlichen eine Mail zu schreiben, die Bezug 
        auf das aktuelle CI nimmt.
    </p>
    <h2>Abhängigkeiten</h2>
    <p>
        Hier können alle CIs eingesehen werden, von denen das aktuelle CI abhängig ist. Neben einem 
        Verbindungstyp kann zu jeder Verbindung auch eine eigene Beschreibung angegeben werden.
    </p>
    <p>
        Im Gegensatz zur <a href="showitem.aspx">Ansicht</a> des Objekts werden hier nur 
        Abhängigkeiten in Abwärtsrichtung angezeigt, d. h. solche CIs, von denen das bearbeitete CI 
        abhängig ist. Auch können nur solche Verknüpfungen angelegt werden.
    </p>
    <p>
        Das Anlegen erfolgt durch Auswahl des entsprechenden CIs aus einer Liste. Eine Filterung der 
        Liste soll später möglich sein.
    </p>
    <h1>Weitere Aktionen</h1>
    <ul>
        <li><b>Suchen</b> startet eine neue <a href="Default.aspx">Suche</a>.
        </li>
        <li><b>Item anzeigen</b> wechselt in die <a href="showitem.aspx">Detailansicht des CIs</a>.
        </li>
        <li><b>Nachbarn suchen</b> startet eine <a href="searchneighbor.aspx">Nachbarschaftssuche für das CI</a>.
        </li>
        <li><a href="createitem.aspx">Neues CI anlegen</a>
        </li>
        <li><a href="createitem.aspx">Neues CI als Kopie des aktuellen CI anlegen</a></li>
        <li><b>Löschen</b> löscht das CI inklusive aller Attribute, Links, Verknüpfungen und Verantwortlichkeiten. Diese Aktion sollte nur mit Vorsicht eingesetzt werden.
        </li>
    </ul>
</asp:Content>
