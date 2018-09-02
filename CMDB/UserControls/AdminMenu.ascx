<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AdminMenu.ascx.cs" Inherits="UserControls_AdminMenu" %>
<ul>
    <li>
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/Users.aspx">Benutzerverwaltung</asp:HyperLink>
    </li>
    <li>
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/AttributeTypes.aspx">Attributtypen</asp:HyperLink>
    </li>
    <li>
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/AttributeGroups.aspx">Attributgruppen</asp:HyperLink>
    </li>
    <li>
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/ItemTypes.aspx">Itemtypen</asp:HyperLink>
    </li>
    <li>
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/ConnectionTypes.aspx">Verbindungstypen</asp:HyperLink>
    </li>
    <li>
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/ConnectionRules.aspx">Verbindungsregeln</asp:HyperLink>
    </li>
</ul>
