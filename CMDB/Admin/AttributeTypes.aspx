<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="AttributeTypes.aspx.cs" Inherits="Admin_AttributeTypes" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Attribut-Typen</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <cmdb:HelpContent runat="server">
                <HelpContentTemplate>
                    <p>Attribute sind Textinformationen, die zu einem Configuration Item gespeichert werden. Jedes Attribut besitzt einen Attribut-Typen.</p>
                    <p>Attribut-Typen werden in <a href="AttributeGroups.aspx">Attributgruppen</a> zusammengefasst. Nur Attribut-Typen, die zu keiner Attributgruppe gehören, können gelöscht werden.</p>
                    <p>Jeder Attribut-Typ nur einmal pro Configuration Item vergeben werden.</p>
                </HelpContentTemplate>
            </cmdb:HelpContent>
            <asp:MultiView ID="mvContent" runat="server" ActiveViewIndex="0" OnActiveViewChanged="mvContent_ActiveViewChanged">
                <asp:View runat="server">
                    <asp:GridView ID="gvTypes" runat="server"
                        EnablePersistedSelection="true"
                        DataKeyNames="TypeId"
                        AllowPaging="false"
                        AutoGenerateColumns="false"
                        OnSelectedIndexChanged="gvTypes_SelectedIndexChanged">
                        <AlternatingRowStyle />
                        <SelectedRowStyle />
                        <HeaderStyle />
                        <Columns>
                            <asp:BoundField DataField="TypeName" HeaderText="Attribut-Typ" />
                            <asp:CommandField ButtonType="Link" ShowSelectButton="true" />
                            <asp:BoundField DataField="TypeID" HeaderText="Interne ID" ReadOnly="true" />
                        </Columns>
                    </asp:GridView>
                </asp:View>
                <asp:View runat="server">
                    <h2>Neuen Attribut-Typ anlegen</h2>
                    <cmdb:IdNameInput ID="ucInput" runat="server" OnSave="ucInput_Save" OnCancel="ucInput_Cancel" />
                </asp:View>
            </asp:MultiView>
            <asp:Label ID="lblLocalError" CssClass="errorlabel" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <ul>
                <li>
                    <asp:LinkButton ID="btnCreate" runat="server" CssClass="intern" ToolTip="Neuen Attribut-Typ hinzufügen"
                        OnClick="btnCreate_Click" Text="Erstellen" />
                </li>
                <li>
                    <asp:LinkButton ID="btnEdit" runat="server" CssClass="intern" ToolTip="Ausgewählten Attribut-Typ bearbeiten"
                        OnClick="btnEdit_Click" Text="Bearbeiten" />
                </li>
                <li>
                    <asp:LinkButton ID="btnDelete" runat="server" CssClass="intern" ToolTip="Attribut-Typ löschen (inklusive aller Attribute)"
                        OnClientClick="return confirm('Sind Sie sicher, dass Sie den Attribut-Typ löschen wollen?');"
                        OnClick="btnDelete_Click" Text="Löschen" />
                </li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

