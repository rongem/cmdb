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
                    <p>Attribute sind Textinformationen, die zu einem Configuration Item gespeichert werden. Jedes Attribut besitzt einen eindeutigen Attribut-Typen.</p>
                    <p>Attribut-Typen werden in <a href="AttributeGroups.aspx">Attributgruppen</a> zusammengefasst.</p>
                    <p>Jeder Attribut-Typ kann nur einmal pro Configuration Item vergeben werden.</p>
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
                            <asp:BoundField DataField="AttributeGroup" HeaderText="Attribut-Gruppe" />
                            <asp:CommandField ButtonType="Link" ShowSelectButton="true" />
                            <asp:BoundField DataField="TypeID" HeaderText="Interne ID" ReadOnly="true" />
                            <asp:TemplateField>
                                <ItemTemplate>
                                    <asp:ImageButton ID="btnMoveAttributeTypeToAnotherGroup" runat="server"
                                        OnClick="btnMoveAttributeTypeToAnotherGroup_Click"
                                        ImageUrl="~/img/NextItem.png"
                                        CommandArgument='<%# Bind("TypeId") %>'
                                        AlternateText="Attributtyp in eine andere Attributgruppe verschieben"
                                        ToolTip="Attributtyp in eine andere Attributgruppe verschieben. Die Attribute bleiben erhalten, ggf. wird die neue Gruppe den Item-Typen hinzugefügt."
                                        Visible='<%# (gvTypes.Rows.Count > 1) %>' />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </asp:View>
                <asp:View runat="server">
                    <input id="txtAttributTypeId" runat="server" type="hidden" />
                    <h2>Verschieben eines Attribut-Typs</h2>
                    <p>Wenn Sie einen Attribut-Typen in eine andere Gruppe verschieben, wird überprüft, ob die Zielgruppe allen Item-Typen zugeordnet ist. Wo das nicht der Fall ist, wird die Zuordnung erstellt. Dadurch können an Item-Typen deutlich mehr Attribute gebunden sein als zuvor.</p>
                    <p>
                        Neue Gruppe, in die der Attribut-Typ
                        <asp:Label ID="lblAttributTypeToMove" runat="server" />
                        verschoben werden soll:
                    </p>
                    <p>
                        <asp:DropDownList ID="lstGroupToMoveTo" runat="server" DataValueField="GroupId" DataTextField="GroupName"
                            OnSelectedIndexChanged="lstGroupToMoveTo_SelectedIndexChanged" />
                    </p>
                    <span id="spanItemTypesToChange" runat="server">
                        <p>Diese Gruppe wird folgenden Item-Typen hinzugefügt:</p>
                        <asp:BulletedList ID="lstChangedItemTypes" runat="server" />
                    </span>
                    <p>Sind Sie sicher, dass Sie das Verschieben durchführen wollen?</p>
                    <asp:Button ID="btnConfirmMove" runat="server" Text="Verschieben" OnClick="btnConfirmMove_Click" />
                    <asp:Button ID="btnCancelMove" runat="server" Text="Abbrechen" OnClick="btnCancelMove_Click" />
                </asp:View>
                <asp:View runat="server">
                    <h2><asp:Label ID="lblEditCaption" runat="server" /></h2>
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
                    <asp:LinkButton ID="btnConvert" runat="server" CssClass="intern" ToolTip="Attribut-Typ in Item-Typ umwandeln"
                        OnClick="btnConvert_Click" Text="In Item-Typ konviertieren" />
                </li>
                <li>
                    <asp:LinkButton ID="btnDelete" runat="server" CssClass="intern" ToolTip="Attribut-Typ löschen"
                        OnClientClick="return confirm('Sind Sie sicher, dass Sie den Attribut-Typ löschen wollen?');"
                        OnClick="btnDelete_Click" Text="Löschen" />
                </li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

