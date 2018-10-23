<%@ Page Title="" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="ShowHistory.aspx.cs" Inherits="ShowHistory" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
    <ul>
        <li>
            <asp:HyperLink runat="server" NavigateUrl="~/HelpPages/showhistory.aspx" Target="help">?</asp:HyperLink>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>
        <asp:Label ID="lblName" runat="server" />
    </h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:Repeater ID="rpHistory" runat="server">
        <HeaderTemplate>
            <table>
                <tr>
                    <th>Zeitpunkt</th>
                    <th>Kontext</th>
                    <th>Änderung</th>
                    <th>Verantwortlich</th>
                </tr>
        </HeaderTemplate>
        <ItemTemplate>
            <tr>
                <td>
                    <asp:Label ID="lblColumnTime" runat="server" Text="<%# (Container.DataItem as CmdbAPI.DataObjects.HistoryEntry).DateTime.ToString() %>" />
                </td>
                <td>
                    <asp:Label ID="Label1" runat="server" Text="<%# (Container.DataItem as CmdbAPI.DataObjects.HistoryEntry).Subject %>" />
                </td>
                <td>
                    <asp:Label ID="Label2" runat="server" Text="<%# (Container.DataItem as CmdbAPI.DataObjects.HistoryEntry).Text %>" />
                </td>
                <td>
                    <asp:Label ID="Label3" runat="server" Text="<%# (Container.DataItem as CmdbAPI.DataObjects.HistoryEntry).Responsible %>" />
                </td>
            </tr>
        </ItemTemplate>
        <FooterTemplate>
            </table>
        </FooterTemplate>
    </asp:Repeater>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
    <ul>
        <li>
            <a href="ShowItem.aspx?id=<%: Request.QueryString["id"] %>" class="intern">Item anzeigen</a>
        </li>
    </ul>
</asp:Content>

