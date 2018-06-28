<%@ Page Language="C#" MasterPageFile="~/HelpPages/help.master" AutoEventWireup="true" %>
<asp:Content ID="cSectionHeader" ContentPlaceHolderID="cphSectionHeader" runat="server">
    Detailansicht f&uuml;r ein Configuration Item
</asp:Content>
<asp:Content ID="cSectionArticle" ContentPlaceHolderID="cphSectionArticle" runat="server">
    <p>
        Die Detailansicht enth&auml;lt zumindest den Typ und den Namen des ausgew&auml;hlten 
        CIs. Jeder CI enth&auml;lt eine eindeutige interene ID, die in der Adresse der Seite 
        zu sehen ist. Diese Link-Adresse kann dadurch von einem anderen System dazu verwendet 
        werden, ein bestimmtes CI von außen anzuspringen.
    </p>
    <p>
        Neben dem Namen werden folgende weiteren Informationen angezeigt:
    </p>
    <ul>
        <li>Alle Attribute, die dem CI zugeordnet sind.</li>
        <li>Alle Verantwortlichen f&uuml;r das CI inklusive ihrer Erreichbarkeiten</li>
        <li>Alle Verkn&uuml;pfungen zu anderen CIs in beide Richtungen</li>
        <li>Links, die von diesem Objekt zu anderen Systemen angelegt wurden.</li>
    </ul>
    <p>
        Folgende Aktionen k&ouml;nnen f&uuml;r ein CI ausgef&uuml;hrt werden:
    </p>
    <ul>
        <li><a href="searchneighbor.aspx">Nachbarn suchen</a>: Verkn&uuml;pfungen &uuml;ber mehrere 
            Ebenen verfolgen.</li>
        <li><a href="createitem.aspx">Neues CI anlegen</a>, sofern der Benutzer die notwendigen 
            Rechte besitzt.</li>
        <li><a href="createitem.aspx">Neues CI als Kopie des aktuellen CI anlegen</a>, sofern 
            der Benutzer die notwendigen Rechte besitzt.</li>
        <li><a href="edititem.aspx">Editieren</a>, sofern der Benutzer die notwendigen Rechte besitzt.</li>
        <li>Das CI und eine Verkn&uuml;pfungsebene nach Excel exportieren.</li>
        <li>Das CI und seine Links nach Excel exportieren.</li>
        <li>Das CI und eine Verkn&uuml;pfungsebene nach CSV exportieren.</li>
        <li>Das CI und seine Links nach CSV exportieren.</li>
    </ul>
</asp:Content>
