<%@ Page Title="" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="cNav" ContentPlaceHolderID="cphNav" runat="Server">
    <ul>
        <li>
            <asp:Hyperlink runat="server" NavigateUrl="~/HelpPages/Default.aspx" target="help">?</asp:Hyperlink>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="cMainHeader" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Suchen</h1>
</asp:Content>
<asp:Content ID="cMainArticle" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel ID="upSearchCriteria" runat="server">
        <ContentTemplate>
            <div class="table">
                <div class="tr">
                    <div class="td">
                        <cmdb:FilterSelector runat="server" ID="ucFilter" IsFilterButtonVisible="false" />
                    </div>
                </div>
            </div>
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
                <asp:Button ID="btnSearch" runat="server" OnClick="btnSearch_Click" Text="Suchen" />
            </p>
            <p>
                <asp:Label ID="ErrorLabel" runat="server" CssClass="errorlabel"></asp:Label>
            </p>
            <asp:MultiView ID="mvResults" runat="server" ActiveViewIndex="0">
                <asp:View runat="server">
                    <h2>Ergebnisse</h2>
                    <p>
                        <asp:Button ID="btnShowMultiEdit" runat="server" OnClick="btnShowMultiEdit_Click" Text="Mehrere Items gemeinsam editieren" Visible="false" />
                        <asp:DropDownList ID="lstShowAdditional" runat="server" AutoPostBack="true" OnSelectedIndexChanged="lstShowAdditional_SelectedIndexChanged" DataValueField="ID" DataTextField="Text" Visible="false" CssClass="boxRight" />
                    </p>
                    <asp:BulletedList ID="lvSearchResults" Visible="false" runat="server" Width="100%" CssClass="nolistitemstyle" />
                </asp:View>
                <asp:View runat="server">
                    <h2>Ergebnisse</h2>
                    <p>
                        In der nachfolgenden Tabelle finden Sie die Configuration Items, die Sie zum gemeinsamen Editieren auswählen können. Sofern Sie die Verantwortung für
                        ein Item besitzen, ist es bereits mit einem Häkchen am Ende versehen. Besitzen Sie die Verantwortung nicht, können Sie sie durch das Setzen des Häkchens 
                        übernehmen. Nicht angehakte CIs werden nachfolgend in der Bearbeitung nicht berücksichtigt, die Verantwortung wird dadurch aber nicht abgegeben.
                    </p>
                    <asp:DropDownList ID="lstSelectItems" runat="server" OnSelectedIndexChanged="lstSelectItems_SelectedIndexChanged" AutoPostBack="True">
                        <asp:ListItem Value="null" Text="(Auswählen)" />
                        <asp:ListItem Value="all" Text="Alle angezeigten Items auswählen" />
                        <asp:ListItem Value="none" Text="Auswahl aufheben" />
                        <asp:ListItem Value="owned" Text="Alle Items auswählen, für die ich verantwortlich bin" />
                        <asp:ListItem Value="unowned" Text="Alle Items auswählen, für die ich nicht verantwortlich bin" />
                    </asp:DropDownList>
                    <asp:CheckBoxList ID="cblSearchResults" runat="server" DataTextField="ItemName" DataValueField="ItemId" />
                    <p>
                        <asp:Button runat="server" OnClick="btnMultiEdit_Click" Text="Ausgewählte gemeinsam editieren" />
                    </p>
                </asp:View>
            </asp:MultiView>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="cAside" ContentPlaceHolderID="cphAside" runat="Server">
    <asp:UpdatePanel ID="UpdatePanel2" runat="server">
        <ContentTemplate>
            <ul>
                <li>
                    <asp:LinkButton ID="lnkExportToExcel" runat="server" OnClick="lnkExportToExcel_Click" Visible="false" CssClass="download" Text="Liste mit Attributen nach Excel exportieren" />
                </li>
                <li>
                    <asp:LinkButton ID="lnkExportToCsv" runat="server" OnClick="lnkExportToCsv_Click" Visible="false" CssClass="download" Text="Liste mit Attributen als CSV exportieren" />
                </li>
                <li>
                    <a href="Export.aspx?app=yed&scope=all" class="download">Gesamte Datenbank nach GraphML exportieren</a>
                </li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

