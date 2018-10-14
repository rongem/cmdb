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
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
    <ul>
        <li>
            <a href="ShowItem.aspx?id=<%: Request.QueryString["id"] %>" class="intern">Item anzeigen</a>
        </li>
    </ul>
</asp:Content>

