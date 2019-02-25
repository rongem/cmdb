<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AdminMenu.ascx.cs" Inherits="UserControls_AdminMenu" %>
<ul class="header-nav__menu-items">
    <li class="header-nav__menu-item">
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/Users.aspx">Benutzerverwaltung</asp:HyperLink>
    </li>
    <li class="header-nav__menu-item">
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/AttributeTypes.aspx">Attributtypen</asp:HyperLink>
    </li>
    <li class="header-nav__menu-item">
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/AttributeGroups.aspx">Attributgruppen</asp:HyperLink>
    </li>
    <li class="header-nav__menu-item">
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/ItemTypes.aspx">Itemtypen</asp:HyperLink>
    </li>
    <li class="header-nav__menu-item">
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/ConnectionTypes.aspx">Verbindungstypen</asp:HyperLink>
    </li>
    <li class="header-nav__menu-item">
        <asp:HyperLink runat="server" NavigateUrl="~/Admin/ConnectionRules.aspx">Verbindungsregeln</asp:HyperLink>
    </li>
</ul>
