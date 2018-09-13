<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="AttributeGroups.aspx.cs" Inherits="Admin_AttributeGroups" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Attributgruppen</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <cmdb:HelpContent runat="server">
                <HelpContentTemplate>
                    <p>Attribute sind Textinformationen, die zu einem Configuration Item gespeichert werden. Jedes Attribut besitzt einen eindeutigen <a href="AttributeGroups.aspx">Attribut-Typen</a>.</p>
                    <p>Attribut-Typen werden in Attributgruppen zusammengefasst. Attributgruppen können gelöscht werden, wenn sie keinem <a href="ItemTypes.aspx">Item-Typen</a> mehr zugeordnet sind und keine Attribut-Typen mehr enthalten.</p>
                </HelpContentTemplate>
            </cmdb:HelpContent>
            <asp:MultiView ID="mvContent" runat="server" ActiveViewIndex="0" OnActiveViewChanged="mvContent_ActiveViewChanged">
                <asp:View runat="server">
                    <asp:GridView ID="gvTypes" runat="server"
                        EnablePersistedSelection="true"
                        DataKeyNames="GroupId"
                        AllowPaging="false"
                        AutoGenerateColumns="false"
                        OnSelectedIndexChanged="gvTypes_SelectedIndexChanged">
                        <AlternatingRowStyle />
                        <SelectedRowStyle />
                        <HeaderStyle />
                        <Columns>
                            <asp:BoundField DataField="GroupName" HeaderText="Attributgruppe" />
                            <asp:CommandField ButtonType="Link" ShowSelectButton="true" />
                            <asp:BoundField DataField="GroupID" HeaderText="Interne ID" ReadOnly="true" />
                        </Columns>
                    </asp:GridView>
                    <div id="divAssociations" runat="server">
                        <p>&nbsp;</p>
                        <h2>Zugeordnete Attribut-Typen</h2>
                        <asp:GridView ID="gvAssociations" runat="server"
                            EnablePersistedSelection="true"
                            DataKeyNames="TypeId"
                            AllowPaging="false"
                            AutoGenerateColumns="false"
                            OnRowCommand="gvAssociations_RowCommand">
                            <AlternatingRowStyle />
                            <SelectedRowStyle />
                            <HeaderStyle />
                            <Columns>
                                <asp:BoundField DataField="TypeName" HeaderText="Attribut-Typ" />
                                <asp:CommandField ButtonType="Link" ShowDeleteButton="true" />
                                <asp:TemplateField>
                                    <ItemTemplate>
                                        <asp:ImageButton ID="btnMoveAttributeTypeToAnotherGroup" runat="server"
                                            OnClick="btnMoveAttributeTypeToAnotherGroup_Click"
                                            ImageUrl="~/img/NextItem.png"
                                            CommandArgument='<%# Bind("TypeId") %>'
                                            AlternateText="Attributtyp in eine andere Attributgruppe verschieben"
                                            ToolTip="Attributtyp in eine andere Attributgruppe verschieben. Die Attribute bleiben erhalten, ggf. wird die neue Gruppe den Item-Typen hinzugefügt."
                                            Visible='<%# (gvTypes.Rows.Count > 1) %>'
                                            />
                                    </ItemTemplate>
                                </asp:TemplateField>
                            </Columns>
                        </asp:GridView>
                        <div id="divAddType" runat="server">
                            <p>
                                Attribut-Typ:
                                <asp:DropDownList ID="lstUnassignedAttributeTypes" runat="server" DataValueField="TypeId" DataTextField="TypeName" />
                                <asp:Button ID="btnAddAttributeType" runat="server" Text="zur Attributgruppe hinzufügen" OnClick="btnAddAttributeType_Click" />
                            </p>
                        </div>
                    </div>
                </asp:View>
                <asp:View runat="server">
                    <h2><asp:Label ID="lblEditCaption" runat="server" /></h2>
                    <cmdb:IdNameInput ID="ucInput" runat="server" OnSave="ucInput_Save" OnCancel="ucInput_Cancel" />
                </asp:View>
                <asp:View runat="server">
                    <h2>Löschen der Zuordnung des Attribut-Typs <asp:Label ID="lblAssociation" runat="server" /></h2>
                    <p>Wenn Sie die Zuordnung löschen, werden dadurch <asp:Label ID="lblCount" runat="server" />
                        Attributwerte gelöscht. Sind Sie sicher, dass Sie die Zuordnung löschen wollen?
                    </p>
                    <input type="hidden" id="IdToDelete" runat="server" />
                    <asp:Button ID="btnConfirmDelete" runat="server" Text="Ja" OnClick="btnConfirmDelete_Click" />
                    <asp:Button ID="btnCancelDelete" runat="server" Text="Nein" OnClick="btnCancelDelete_Click" />
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
                    <asp:LinkButton ID="btnCreate" runat="server" CssClass="intern" ToolTip="Neue Attributgruppe hinzufügen"
                        OnClick="btnCreate_Click" Text="Erstellen" />
                </li>
                <li>
                    <asp:LinkButton ID="btnEdit" runat="server" CssClass="intern" ToolTip="Ausgewählte Attributgruppe bearbeiten"
                        OnClick="btnEdit_Click" Text="Bearbeiten" />
                </li>
                <li>
                    <asp:LinkButton ID="btnDelete" runat="server" CssClass="intern" ToolTip="Attributgruppe löschen"
                        OnClientClick="return confirm('Sind Sie sicher, dass Sie die Attributgruppe löschen wollen?');"
                        OnClick="btnDelete_Click" Text="Löschen" />
                </li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
