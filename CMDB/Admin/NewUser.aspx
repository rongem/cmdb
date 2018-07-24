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
            <div class="table">
                <div class="tr">
                    <div class="td" style="text-align: center;">
                        <asp:TextBox ID="txtSearch" runat="server" placeholder="Benutzernamen eingeben" CssClass="searchtextbox" />
                    </div>
                </div>
                <div class="tr">
                    <div class="td">
                        <asp:Button runat="server" Text="Suchen" OnClick="btnSearchUser_Click" />
                        <asp:Label ID="lblError" runat="server" CssClass="errorlabel" />
                    </div>
                </div>
                <div class="tr">
                    <div class="td">
                        <hr />
                        <h2>Benutzer und Rolle auswählen</h2>
                        <asp:ListBox ID="lstUsers" runat="server" DataValueField="NTAccount" AutoPostBack="true" OnSelectedIndexChanged="lstUsers_SelectedIndexChanged" />
                    </div>
                </div>
                <div class="tr">
                    <div class="td">
                        Rolle: 
                        <asp:DropDownList ID="lstRoles" runat="server" Enabled="false">
                            <asp:ListItem Selected="True" Text="Editor" Value="1" />
                            <asp:ListItem Text="Administrator" Value="2" />
                        </asp:DropDownList>
                    </div>
                </div>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <asp:Button ID="btnCreate" runat="server" Text="Rolle zu Benutzer zuweisen" Visible="false" OnClick="btnCreate_Click" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

