<%@ Page Language="C#" MasterPageFile="~/HelpPages/help.master" AutoEventWireup="true" %>
<asp:Content ID="cSectionHeader" ContentPlaceHolderID="cphSectionHeader" runat="server">
    Erstellen von Configuration Items
</asp:Content>
<asp:Content ID="cSectionArticle" ContentPlaceHolderID="cphSectionArticle" runat="Server">
    <h1>Neues CI anlegen</h1>
    <p>
        Wird ein neues CI angelegt, muss der Typ ausgew&auml;hlt und der Name eingegeben werden. 
        Der Name muss innerhalb des Typs eindeutig sein, d. h. es d&uuml;rfen keine zwei CIs 
        mit identischem Namen und Typ existieren.
    </p>
    <p>Beim Anlegen wird der aktuelle Benutzer automatisch Verantwortlicher f&uuml;r das CI.</p>
    <p>Nach dem erfolgreichen Anlegen wird das CI zum <a href="edititem.aspx">Bearbeiten</a> angezeigt.</p>
    <h1>CI kopieren</h1>
    <p>
        Aus den Seiten zur <a href="showitem.aspx">Detailansicht f&uuml;r ein Configuration Item</a>
        bzw. <a href="edititem.aspx">Configuration Item bearbeiten</a> existiert ein Link 
        &quot;CI kopieren&quot;. Dieser ver&auml;ndert das Erstellen folgenderma&szlig;en:
    </p>
    <ul>
        <li>Der Typ des anzulegenden CIs entspricht dem Typ der vorher angesehenen CI und kann 
        nicht ver&auml;ndert werden.</li>
        <li>Es k&ouml;nnen alle oder einzelne Attributwerte kopiert werden.</li>
        <li>Es k&ouml;nnen alle oder einzelne Verkn&uuml;pfungen zu anderen CIs kopiert werden, 
        sofern das zu kopierende CI von ihnen abh&auml;ngig ist. Verkn&uuml;pfungen zu CIs, 
        die von dem zu kopierenden CI abh&auml;ngen, k&ouml;nnen nicht kopiert werden.</li>
        <li>Es k&ouml;nnen alle oder einzelne Links zu anderen Websites kopiert werden.</li>
    </ul>
    <p>Jede ausgew&auml;hlte Eigenschaft wird beim Erstellen auch dem neuen CI zugewiesen.</p>
</asp:Content>
