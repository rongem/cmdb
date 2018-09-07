<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="ItemTypes.aspx.cs" Inherits="Admin_ItemTypes" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Item-Typen</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <cmdb:HelpContent runat="server">
                <HelpContentTemplate>
                    <p>Configuration Items sind die zentralen Objekte. Jedes Configuration Item besitzt einen eindeutigen Typ. 
                        Innerhalb des Typs muss der Name des Configuration Items eindeutig sein.</p>
                    <p>An Item-Typen hängen alle weiteren Daten im System wie <a href="ConnectionTypes.aspx">Verbindungstypen</a>,
                        <a href="AttributeTypes.aspx">Attribut-Typen</a>, <a href="AttributeGroups.aspx">Attributgruppen</a> und
                        <a href="ConnectionRules.aspx">Verbindungsregeln.</a>
                    </p>
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
                            <asp:BoundField DataField="TypeName" HeaderText="Name" />
                            <asp:BoundField DataField="TypeBackColor" HeaderText="FarbCode" />
                            <asp:CommandField ButtonType="Link" ShowSelectButton="true" />
                            <asp:BoundField DataField="TypeID" HeaderText="Interne ID" ReadOnly="true" />
                        </Columns>
                    </asp:GridView>
                </asp:View>
                <asp:View runat="server">
                    <h2>
                        <asp:Label ID="lblEditCaption" runat="server" /></h2>
                    <div class="table">
                        <div class="tr">
                            <div class="td">ID:</div>
                            <div class="td">
                                <asp:TextBox ID="txtId" runat="server" Enabled="false" />
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td">Name:</div>
                            <div class="td">
                                <asp:TextBox ID="txtName" runat="server" />
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td">Farbe:</div>
                            <div class="td">
                                <asp:TextBox ID="txtColor" runat="server" />
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                <asp:Button ID="btnOK" runat="server" Text="Speichern" OnClick="btnOK_Click" />
                            </div>
                            <div class="td">
                                <asp:Button ID="btnCancel" runat="server" Text="Abbrechen" OnClick="btnCancel_Click" />
                            </div>
                        </div>
                    </div>

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
                    <asp:LinkButton ID="btnCreate" runat="server" CssClass="intern" ToolTip="Neuen Item-Typ hinzufügen"
                        OnClick="btnCreate_Click" Text="Erstellen" />
                </li>
                <li>
                    <asp:LinkButton ID="btnEdit" runat="server" CssClass="intern" ToolTip="Ausgewählten Item-Typ bearbeiten"
                        OnClick="btnEdit_Click" Text="Bearbeiten" />
                </li>
                <li>
                    <asp:LinkButton ID="btnDelete" runat="server" CssClass="intern" ToolTip="Item-Typ löschen"
                        OnClientClick="return confirm('Sind Sie sicher, dass Sie den Item-Typ löschen wollen?');"
                        OnClick="btnDelete_Click" Text="Löschen" />
                </li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
