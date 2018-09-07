<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="ConnectionTypes.aspx.cs" Inherits="Admin_ConnectionTypes" %>

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
                    <p>Verbindungstypen sind die Beschriftungen auf dem Pfeil zwischen zwei <a href="ItemTypes.aspx">Configuration Items</a>.</p>
                    <p>
                        Verbindungen sind immer &quot;gerichtet&quot;, d. h. es gibt ein oberes und ein untere Configuration Item. So lassen sich 
                        ganze Bäume von miteinander verbundenen Configuration Items realiseren, z. B. Raum zu Rack zu Server-Hardware. Es empfiehlt sich,
                        am Anfang eine Systematik zur Befüllung festzulegen und diese dann konsequent durchzuhalten.
                    </p>
                    <p>
                        Eine Verbindung besitzt immer zwei Namen, um die Richtung widerzuspiegeln, aus der die Verbindung betrachtet wird.
                        So lautet der Name der Verbindung aus Sicht einer Server-Hardware, die Server-Hardware &quot;ist eingebaut in&quot; ein Rack. 
                        Aus Sicht des Racks lautet der Rückwärts-Name für dieselbe Verbindung, das Rack &quot;enthält&quot; die Server-Hardware.
                    </p>
                </HelpContentTemplate>
            </cmdb:HelpContent>
            <asp:MultiView ID="mvContent" runat="server" ActiveViewIndex="0" OnActiveViewChanged="mvContent_ActiveViewChanged">
                <asp:View runat="server">
                    <asp:GridView ID="gvTypes" runat="server"
                        EnablePersistedSelection="true"
                        DataKeyNames="ConnTypeId"
                        AllowPaging="false"
                        AutoGenerateColumns="false"
                        OnSelectedIndexChanged="gvTypes_SelectedIndexChanged">
                        <AlternatingRowStyle />
                        <SelectedRowStyle />
                        <HeaderStyle />
                        <Columns>
                            <asp:BoundField DataField="ConnTypeName" HeaderText="Name" />
                            <asp:BoundField DataField="ConnTypeReverseName" HeaderText="Rückwärts-Name" />
                            <asp:CommandField ButtonType="Link" ShowSelectButton="true" />
                            <asp:BoundField DataField="ConnTypeID" HeaderText="Interne ID" ReadOnly="true" />
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
                            <div class="td">Rückwärts-Name:</div>
                            <div class="td">
                                <asp:TextBox ID="txtReverseName" runat="server" />
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
                    <asp:LinkButton ID="btnCreate" runat="server" CssClass="intern" ToolTip="Neuen Verbindungstyp hinzufügen"
                        OnClick="btnCreate_Click" Text="Erstellen" />
                </li>
                <li>
                    <asp:LinkButton ID="btnEdit" runat="server" CssClass="intern" ToolTip="Ausgewählten Verbindungstyp bearbeiten"
                        OnClick="btnEdit_Click" Text="Bearbeiten" />
                </li>
                <li>
                    <asp:LinkButton ID="btnDelete" runat="server" CssClass="intern" ToolTip="Verbindungstyp löschen"
                        OnClientClick="return confirm('Sind Sie sicher, dass Sie den Verbindungstyp löschen wollen?');"
                        OnClick="btnDelete_Click" Text="Löschen" />
                </li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

