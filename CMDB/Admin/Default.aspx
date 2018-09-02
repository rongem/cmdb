<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Admin_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" Runat="Server">
    <h1>Administration</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" Runat="Server">
<cmdb:AdminMenu ID="ucAdminMenu" runat="server" />
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" Runat="Server">
</asp:Content>

