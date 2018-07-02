<%@ Page Title="" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="SearchNeighbor.aspx.cs" Inherits="SearchNeighbor" %>

<asp:Content ID="Content3" ContentPlaceHolderID="cphNav" runat="Server">
    <ul>
        <li>
            <asp:Hyperlink runat="server" NavigateUrl="~/HelpPages/searchneighbor.aspx" target="help">?</asp:Hyperlink>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Benachbarte Configuration Items finden</h1>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel ID="upSearchCriteria" runat="server">
        <ContentTemplate>
            <p>Ausgehend vom Configuration Item <b>&quot;<asp:Label ID="lblOrigin" runat="server" />&quot;</b> suchen nach allen Items</p>
            <cmdb:Filter ID="ucFilter" runat="server" IsItemTypeMandatory="true" IsFilterButtonVisible="false" IsSearchTextVisible="false" />
            <p>
                die maximal
                    <asp:TextBox ID="txtMaxLevels" runat="server" Text="5" Width="30px" />
                Ebenen
                    <asp:DropDownList ID="lstDirection" runat="server" Width="150px">
                        <asp:ListItem Text="nach oben" Value="up" />
                        <asp:ListItem Text="nach unten" Value="down" />
                        <asp:ListItem Selected="True" Text="in beiden Richtungen" Value="both" />
                    </asp:DropDownList>
                entfernt sind.
            </p>
        </ContentTemplate>
    </asp:UpdatePanel>
    <asp:UpdateProgress ID="upSearch" runat="server" AssociatedUpdatePanelID="upSearchResult">
        <ProgressTemplate>
            <div id="searchprogress">
                <span id="searching">Suche ...</span>
            </div>
        </ProgressTemplate>
    </asp:UpdateProgress>
    <asp:UpdatePanel ID="upSearchResult" runat="server">
        <ContentTemplate>
            <p>
                <asp:Button ID="btnSearch" runat="server" OnClick="btnSearch_Click" Text="Suche starten" Width="120px" />
            </p>
            <p>
                <asp:Label ID="lblError" runat="server" CssClass="errorlabel" />
                <asp:RequiredFieldValidator runat="server" ControlToValidate="txtMaxLevels" CssClass="errorlabel" Display="Dynamic" Text="Die maximale Anzahl der Ebenen muss angegeben werden." />
                <asp:RangeValidator runat="server" ControlToValidate="txtMaxLevels" CssClass="errorlabel" Display="Dynamic" MaximumValue="100" MinimumValue="1" Text="Die Anzahl der Ebenen muss zwischen 1 und 100 liegen" Type="Integer" />
            </p>
            <hr />
            <asp:MultiView ID="mvResults" runat="server" ActiveViewIndex="0">
                <asp:View runat="server">
                    <h2>Ergebnisse
                    </h2>
                    <p>
                        <asp:Button ID="btnShowMultiEdit" runat="server" OnClick="btnShowMultiEdit_Click" Text="Mehrere Items gemeinsam editieren" Visible="false" />
                        <asp:DropDownList ID="lstShowAdditional" runat="server" AutoPostBack="true" DataTextField="Text" DataValueField="ID" OnSelectedIndexChanged="lstShowAdditional_SelectedIndexChanged" Visible="false" />
                    </p>
                    <asp:BulletedList ID="lvSearchResults" runat="server" Visible="false" Width="100%" />
                </asp:View>
                <asp:View runat="server">
                    <h2>Ergebnisse
                    </h2>
                    <p>
                        In der nachfolgenden Tabelle finden Sie die Configuration Items, die Sie zum gemeinsamen Editieren auswählen können. Sofern Sie die Verantwortung für ein Item besitzen, ist es bereits mit einem Häkchen am Ende versehen. Besitzen Sie die Verantwortung nicht, können Sie sie durch das Setzen des Häkchens übernehmen. Nicht angehakte CIs werden nachfolgend in der Bearbeitung nicht berücksichtigt, die Verantwortung wird dadurch aber nicht abgegeben.
                    </p>
                    <asp:DropDownList ID="lstSelectItems" runat="server" AutoPostBack="True" OnSelectedIndexChanged="lstSelectItems_SelectedIndexChanged">
                        <asp:ListItem Text="(Auswählen)" Value="null" />
                        <asp:ListItem Text="Alle angezeigten Items auswählen" Value="all" />
                        <asp:ListItem Text="Auswahl aufheben" Value="none" />
                        <asp:ListItem Text="Alle Items auswählen, für die ich verantwortlich bin" Value="owned" />
                        <asp:ListItem Text="Alle Items auswählen, für die ich nicht verantwortlich bin" Value="unowned" />
                    </asp:DropDownList>
                    <asp:CheckBoxList ID="cblSearchResults" runat="server" DataTextField="ItemName" DataValueField="ItemId" />
                    <p>
                        <asp:Button runat="server" OnClick="btnMultiEdit_Click" Text="Ausgewählte gemeinsam editieren" />
                    </p>
                </asp:View>
            </asp:MultiView>
            </p>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="cphAside" runat="Server">
    <asp:UpdatePanel ID="UpdatePanel2" runat="server">
        <ContentTemplate>
            <ul>
                <li><a href="ShowGraphical.aspx?id=<%: Request.QueryString["id"] %>" class="intern" target="_blank">Grafisch anzeigen</a></li>
                <li>
                    <asp:LinkButton ID="lnkExportToExcel" runat="server" OnClick="lnkExportToExcel_Click" Visible="false" CssClass="download" Text="Liste nach Excel exportieren" /></li>
                <li>
                    <asp:LinkButton ID="lnkExportToCsv" runat="server" OnClick="lnkExportToCsv_Click" Visible="false" CssClass="download" Text="Liste als CSV exportieren" /></li>
                <li><a href="Export.aspx?app=yed&scope=all" class="download">Gesamte Datenbank nach GraphML exportieren</a></li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

