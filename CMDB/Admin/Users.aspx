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
                <asp:GridView ID="gvUsers" runat="server"
                    EnablePersistedSelection="true"
                    DataKeyNames="Username"
                    AllowPaging="false"
                    AutoGenerateSelectButton="true"
                    AutoGenerateColumns="false"
                    OnSelectedIndexChanged="gvUsers_SelectedIndexChanged">
                    <AlternatingRowStyle />
                    <SelectedRowStyle />
                    <HeaderStyle />
                    <Columns>
                        <asp:BoundField DataField="Username" HeaderText="Kontoname" />
                        <asp:CheckBoxField DataField="IsGroup" HeaderText="Gruppe" ReadOnly="true" />
                        <asp:BoundField DataField="Role" HeaderText="Rolle" />
                    </Columns>

                </asp:GridView>
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
                <p>&nbsp;</p>
                <table>
                    <tr>
                        <td>Name:</td>
                        <td>
                            <asp:Label ID="lblUsername" runat="server" /></td>
                    </tr>
                    <tr>
                        <td>Fundort:</td>
                        <td>
                            <asp:Label ID="lblSource" runat="server" /></td>
                    </tr>
                </table>
                <p>
                    <asp:CheckBox ID="chkDeleteWithResponisbilities" runat="server" Checked="true"
                        Text="Beim Löschen auch die Verantwortlichkeiten entfernen" />
                </p>
                <p>
                    <asp:Button ID="btnDelete" runat="server" OnClick="btnDelete_Click" Text="Benutzer löschen" />
                </p>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

