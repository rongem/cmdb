<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Admin_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" Runat="Server">
    <h1>Administration</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" Runat="Server">
    <ul>
        <li>
            <asp:HyperLink runat="server" NavigateUrl="Users.aspx">Benutzerverwaltung</asp:HyperLink>
        </li>
        <li>
            <asp:HyperLink runat="server" NavigateUrl="AttributeTypes.aspx">Attributtypen</asp:HyperLink>
        </li>
        <li>
            <asp:HyperLink runat="server" NavigateUrl="AttributeGroups.aspx">Attributgruppen</asp:HyperLink>
        </li>
        <li>
            <asp:HyperLink runat="server" NavigateUrl="ItemTypes.aspx">Itemtypen</asp:HyperLink>
        </li>
        <li>
            <asp:HyperLink runat="server" NavigateUrl="ConnectionTypes.aspx">Verbindungstypen</asp:HyperLink>
        </li>
        <li>
            <asp:HyperLink runat="server" NavigateUrl="ConnectionRules.aspx">Verbindungsregeln</asp:HyperLink>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" Runat="Server">
</asp:Content>

