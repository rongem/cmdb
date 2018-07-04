<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="Users.aspx.cs" Inherits="Admin_Users" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Benutzerverwaltung</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <div id="divContent" runat="server">
                <asp:ListBox ID="lstUsers" runat="server" AutoPostBack="true" OnSelectedIndexChanged="lstUsers_SelectedIndexChanged" DataTextField="Token" />
            </div>
            <asp:Label ID="lblLocalError" CssClass="errorlabel" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
    <ul>
        <li>
            <a href="NewUser.aspx">Neuen Benutzer anlegen</a>
        </li>
    </ul>
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <div id="divUserDetails" runat="server">
                <table>
                    <tr>
                        <td>Name:</td>
                        <td>
                            <asp:Label ID="lblUsername" runat="server" /></td>
                    </tr>
                    <tr>
                        <td>Kontentyp:</td>
                        <td>
                            <asp:Label ID="lblGroupOrUser" runat="server" /></td>
                    </tr>
                    <tr>
                        <td>Fundort:</td>
                        <td>
                            <asp:Label ID="lblSource" runat="server" /></td>
                    </tr>
                </table>
                <asp:Button ID="btnDelete" runat="server" OnClick="btnDelete_Click" Text="Benutzer löschen" />
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

