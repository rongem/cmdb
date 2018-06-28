<%@ Page Language="C#" MasterPageFile="~/HelpPages/help.master" AutoEventWireup="true" %>
<asp:Content ID="cSectionHeader" ContentPlaceHolderID="cphSectionHeader" runat="server">
    Mehrere Configuration Items gemeinsam editieren
</asp:Content>
<asp:Content ID="cSectionArticle" ContentPlaceHolderID="cphSectionArticle" runat="server">
    <p>
        Zur vereinfachten Bearbeitung von Massen&auml;nderungen wurde die M&ouml;glichkeit geschaffen, 
        mehrere CIs gleichzeitig zu bearbeiten, sofern sie denselben Typ haben. Dabei sind folgende 
        Bearbeitungen m&ouml;glich:
    </p>
    <ul>
        <li>&Auml;nderung/Hinzuf&uuml;gen eines Attributwerts</li>
        <li>L&ouml;schen von Verkn&uuml;pfungen</li>
        <li>Anlegen von Verkn&uuml;pfungen</li>
    </ul>
    <p>
        Da nur CIs bearbeitet werden k&ouml;nnen, f&uuml;r die der aktuelle Benutzer die Verantwortung 
        &uuml;bernommen hat, wird zum Beginn des Vorgangs sichergestellt, dass alle Items diese 
        Voraussetzung erf&uuml;llen, d. h. der Benutzer &uuml;bernimmt zu diesem Zeitpunkt die 
        Verantwortung f&uuml;r alle gew&auml;hlten CIs.
    </p>
    <h1>&Auml;ndern / Hinzuf&uuml;gen eines Attributwerts </h1>
    <p>
        Zuerst wird ausgew&auml;hlt, welche Attribute ge&auml;ndert werden sollen. In einem zweiten Schritt
        werden alle gew&auml;hlten Attribute zur &Auml;nderung angeboten. Sofern der Attributwert bei allen 
        gew&auml;hlten CIs identisch ist, wird dieser Wert angezeigt. Ist der Attributwert nicht identisch, 
        oder ist das Attribut gar nicht gesetzt, bleibt der Attributwert leer.
    </p>
    <h1>L&ouml;schen von Verkn&uuml;pfungen </h1>
    <p>
        Es werden nur Verkn&uuml;pfungen zum L&ouml;schen angeboten, die bei allen CIs identisch vorhanden sind.
    </p>
    <h1>Anlegen von Verkn&uuml;pfungen </h1>
    <p>
        Es k&ouml;nnen erlaubte Verkn&uuml;pfungen nach unten (d. h. zu CIs, von denen die aktuellen CIs 
        abh&auml;ngig sind) angelegt werden. Dabei stellt die Software sicher, dass keine Verkn&uuml;pfungen 
        doppelt angelegt werden.
    </p>
</asp:Content>
