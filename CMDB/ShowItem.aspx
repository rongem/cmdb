<%@ Page Title="" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="ShowItem.aspx.cs" Inherits="ShowItem" %>

<asp:Content ID="Content3" ContentPlaceHolderID="cphNav" runat="Server">
    <ul>
        <li>
            <asp:Hyperlink runat="server" NavigateUrl="~/HelpPages/showitem.aspx" target="help">?</asp:Hyperlink>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>
        <asp:Label ID="lblName" runat="server" />
    </h1>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <cmdb:ContentTable ID="cgAttributes" runat="server" Caption="Attribute" />
    <cmdb:ContentTable ID="cgResponsibilites" runat="server" Caption="Verantwortliche" />
    <h2>
        <asp:Label ID="lblHeaderConnections" runat="server" />
    </h2>
    <cmdb:HierarchicalGrid ID="hgConnections" runat="server" />
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="cphAside" runat="Server">
    <ul>
        <li>
            <asp:HyperLink ID="lnkCopyItem" runat="server" Text="CI kopieren" ToolTip="Erzeugt ein neues Configuration Item als Kopie des aktuellen CI" CssClass="intern" Visible="false" />
        </li>
        <li>
            <a href="SearchNeighbor.aspx?id=<%: Request.QueryString["id"] %>" class="intern">Nachbarn suchen</a>
        </li>
        <li>
            <a href="ShowGraphical.aspx?id=<%: Request.QueryString["id"] %>" class="intern" target="_blank">Grafisch anzeigen</a></li>
        <li>
            <asp:HyperLink ID="lnkEdit" CssClass="intern" runat="server" Visible="false" Text="Editieren"></asp:HyperLink>
        </li>
        <li>
            <a href="ShowHistory.aspx?id=<%: Request.QueryString["id"] %>" class="intern">Veränderungen anzeigen</a>
        </li>
        <li>Nach Excel exportieren
            <ul style="padding-left: 20px">
                <li><a href="Export.aspx?app=excel&scope=<%: Request.QueryString["id"] %>&type=connections" class="download">CI und eine Ebene</a></li>
                <li><a href="Export.aspx?app=excel&scope=<%: Request.QueryString["id"] %>&type=links" class="download">Links</a></li>
            </ul>
        </li>
        <li>Nach CSV exportieren
            <ul style="padding-left: 20px">
                <li><a href="Export.aspx?app=csv&scope=<%: Request.QueryString["id"] %>&type=connections" class="download">CI und eine Ebene</a></li>
                <li><a href="Export.aspx?app=csv&scope=<%: Request.QueryString["id"] %>&type=links" class="download">Links</a></li>
            </ul>
        </li>
        <li>Nach Graph ML exportieren
            <ul style="padding-left: 20px">
                <li><a href="Export.aspx?app=yed&scope=<%: Request.QueryString["id"] %>&levels=1" class="download">CI und eine Ebene</a></li>
                <li><a href="Export.aspx?app=yed&scope=<%: Request.QueryString["id"] %>&levels=all" class="download">CI und alle Ebenen</a></li>
            </ul>
        </li>
    </ul>
    <p>&nbsp;</p>
    <h2>
        <asp:Label ID="lblHeaderLinks" runat="server" />
    </h2>
    <asp:BulletedList ID="lstLinks" runat="server" Target="_blank" />
</asp:Content>

