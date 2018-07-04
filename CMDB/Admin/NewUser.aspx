<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="NewUser.aspx.cs" Inherits="Admin_NewUser" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Neuen Benutzer anlegen</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdateProgress ID="upSearch" runat="server" AssociatedUpdatePanelID="upSearchResult">
        <ProgressTemplate>
            <div id="searchprogress">
                <span id="searching">Suche ...
                    <img src="img/ajax_load.gif" /></span>
            </div>
        </ProgressTemplate>
    </asp:UpdateProgress>
    <asp:UpdatePanel ID="upSearchResult" runat="server">
        <ContentTemplate>
            <asp:TextBox ID="txtSearch" runat="server" placeholder="Benutzernamen eingeben" AutoPostBack="true" OnTextChanged="txtSearch_TextChanged" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
</asp:Content>

