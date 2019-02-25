<%@ Page Title="" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="EditItem.aspx.cs" Inherits="EditItem" %>

<asp:Content ID="Content3" ContentPlaceHolderID="cphNav" runat="Server">
    <ul class="header-nav__items">
        <li class="header-nav__item">
            <asp:Hyperlink runat="server" NavigateUrl="~/HelpPages/edititem.aspx" target="help">?</asp:Hyperlink>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Editieren</h1>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <div class="table">
        <div class="tr">
            <div class="td">
                ID:
            </div>
            <div class="td">
                <asp:Label ID="lblItemID" runat="server" />
            </div>
            <div class="td">
                Erstellt:
            </div>
            <div class="td">
                <asp:Label ID="lblItemCreated" runat="server" />
            </div>
        </div>
        <div class="tr">
            <div class="td">
                Name:
            </div>
            <div class="td">
                <asp:TextBox ID="txtItemName" runat="server" Enabled="false" AccessKey="n" />
            </div>
            <div class="td">
                Zuletzt geändert:
            </div>
            <div class="td">
                <asp:Label ID="lblItemLastChange" runat="server" />
            </div>
        </div>
        <div class="tr">
            <div class="td">
                ItemTyp:
            </div>
            <div class="td">
                <asp:Label ID="lblItemType" runat="server" />
            </div>
            <div class="td">
                Version:
            </div>
            <div class="td">
                <asp:Label ID="lblItemVersion" runat="server" />
            </div>
        </div>
    </div>
    <asp:Label ID="lblError" runat="server" Visible="false" CssClass="errorlabel" />
    <asp:Button ID="btnTakeResponsibility" Text="Verantwortung übernehmen" runat="server" OnClick="btnTakeResponsibility_Click" />
    <asp:Button ID="btnSaveItem" Text="Namensänderung speichern" runat="server" Visible="false" OnClick="btnSaveItem_Click" />
    <p>&nbsp;</p>
    <div class="table">
        <div class="trnoline">
            <div class="tab">
                <asp:Button ID="btnEditAttributes" runat="server" Text="Attribute" ToolTip="Eigenschaften zum Configuration Item" CssClass="selectedTab" OnClick="btnEditAttributes_Click" />
            </div>
            <div class="tab">
                <asp:Button ID="btnEditLinks" runat="server" Text="Doku-Links" ToolTip="Hyperlinks zu externen Dokumentationen" CssClass="notSelectedTab" OnClick="btnEditLinks_Click" />
            </div>
            <div class="tab">
                <asp:Button ID="btnEditResponsibility" runat="server" Text="Verantwortliche" ToolTip="Mitarbeiter, die das Configuration Item betreuen" CssClass="notSelectedTab" OnClick="btnEditResponsibility_Click" />
            </div>
            <div class="tab">
                <asp:Button ID="btnEditConnections" runat="server" Text="Abhängigkeiten" ToolTip="Configuration Items, von denen dieses Item abhängig ist" CssClass="notSelectedTab" OnClick="btnEditConnections_Click" />
            </div>
            <div class="tab">
                &nbsp;
            </div>
        </div>
    </div>
    <asp:MultiView ID="mvContent" runat="server">
        <asp:View ID="vAttributes" runat="server">
            <asp:MultiView ID="mvAttributes" runat="server" ActiveViewIndex="0">
                <asp:View runat="server">
                    <asp:GridView ID="grAttributes" runat="server" AutoGenerateColumns="false" Width="100%">
                        <Columns>
                            <asp:BoundField DataField="GroupName" HeaderText="Attributgruppe" ReadOnly="true" />
                            <asp:BoundField DataField="AttributeTypeName" HeaderText="Attribut-Typ" ReadOnly="true" />
                            <asp:BoundField DataField="AttributeValue" HeaderText="Inhalt" />
                            <asp:TemplateField HeaderText="Befehle" ItemStyle-CssClass="command">
                                <ItemTemplate>
                                    <asp:ImageButton ID="btnInsertAttribute" ImageUrl="~/img/AddNewItem.png" Width="16" Height="16" AlternateText="Einfügen" runat="server"
                                        OnClick="btnAttribute_Command" CommandName="CreateAttribute" ToolTip="Attribut hinzufügen"
                                        CommandArgument='<%# DataBinder.Eval(Container.DataItem, "AttributeTypeId") %>'
                                        Visible='<%# DataBinder.Eval(Container.DataItem, "AttributeID").ToString() == string.Empty %>' />
                                    <asp:ImageButton ID="btnEditAttribute" ImageUrl="~/img/EditItem.png" Width="16" Height="16" AlternateText="Editieren" runat="server"
                                        OnClick="btnAttribute_Command" CommandName="EditAttribute" ToolTip="Attributwert bearbeiten"
                                        CommandArgument='<%# DataBinder.Eval(Container.DataItem, "AttributeID") %>'
                                        Visible='<%# DataBinder.Eval(Container.DataItem, "AttributeID").ToString() != string.Empty %>' />
                                    <asp:ImageButton ID="btnDeleteAttribute" ImageUrl="~/img/DeleteItem.png" Width="16" Height="16" AlternateText="Löschen" runat="server"
                                        OnClick="btnAttribute_Command" CommandName="DeleteAttribute" ToolTip="Attribut löschen"
                                        OnClientClick="return confirm('Sind Sie sicher, dass Sie das Attribut löschen wollen?');"
                                        CommandArgument='<%# DataBinder.Eval(Container.DataItem, "AttributeID") %>'
                                        Visible='<%# DataBinder.Eval(Container.DataItem, "AttributeId").ToString() != string.Empty %>' />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </asp:View>
                <asp:View runat="server">
                    <h2 class="teaser">
                        <asp:Label ID="lblAttributeHeadline" runat="server" />
                    </h2>
                    <p>
                        Attributwert:
                        <asp:TextBox ID="txtAttributeUpdateValue" runat="server" Width="280px" />
                    </p>
                    <p>
                        <asp:Label ID="lblAttributeUpdateError" runat="server" CssClass="errorlabel" />&nbsp;
                    </p>
                    <p>
                        <asp:Button ID="btnSaveAttribute" OnClick="btnUpdateAttribute_Click" Text="Speichern" runat="server" Width="200px" />&nbsp;<asp:Button Text="Abbrechen" runat="server" OnClick="btnCancelAttribute_Click" Width="200px" />
                    </p>
                </asp:View>
            </asp:MultiView>
        </asp:View>
        <asp:View ID="vLinks" runat="server">
            <asp:MultiView ID="mvLinks" runat="server" ActiveViewIndex="0">
                <asp:View runat="server">
                    <asp:GridView ID="grLinks" runat="server" AutoGenerateColumns="false" Width="100%">
                        <Columns>
                            <asp:BoundField DataField="LinkDescription" HeaderText="Link-Beschreibung" ReadOnly="true" />
                            <asp:TemplateField>
                                <HeaderTemplate>Link-Adresse</HeaderTemplate>
                                <ItemTemplate>
                                    <asp:HyperLink ID="hyplink" runat="server" Text='<%# this.PathShortener(DataBinder.Eval(Container.DataItem, "LinkURI").ToString()) %>'
                                        NavigateUrl='<%# DataBinder.Eval(Container.DataItem, "LinkURI") %>' />
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Befehle" ItemStyle-CssClass="command">
                                <ItemTemplate>
                                    <asp:ImageButton ID="btnEditLink" ImageUrl="~/img/EditItem.png" Width="16" Height="16" AlternateText="Editieren" runat="server"
                                        OnClick="btnLink_Command" CommandName="EditLink" ToolTip="Link bearbeiten"
                                        CommandArgument='<%# DataBinder.Eval(Container.DataItem, "LinkId") %>'
                                        Visible='<%# DataBinder.Eval(Container.DataItem, "LinkId").ToString() != string.Empty %>' />
                                    <asp:ImageButton ID="btnDeleteLink" ImageUrl="~/img/DeleteItem.png" Width="16" Height="16" AlternateText="Löschen" runat="server"
                                        OnClick="btnLink_Command" CommandName="DeleteLink" ToolTip="Link löschen"
                                        OnClientClick="return confirm('Sind Sie sicher, dass Sie den Link löschen wollen?');"
                                        CommandArgument='<%# DataBinder.Eval(Container.DataItem, "LinkId") %>'
                                        Visible='<%# DataBinder.Eval(Container.DataItem, "LinkId").ToString() != string.Empty %>' />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                    <asp:ImageButton ID="btnInsertLink" ImageUrl="~/img/AddNewItem.png" Width="16" Height="16" AlternateText="Einfügen" runat="server"
                        OnClick="btnLink_Command" ToolTip="Link hinzufügen" CommandName="CreateLink" />
                </asp:View>
                <asp:View runat="server">
                    <h2 class="teaser">
                        <asp:Label ID="lblLinkHeadline" runat="server" />
                    </h2>
                    <p>
                        Link-Adresse:
                        <asp:TextBox ID="txtEditLinkURI" runat="server" Width="390px" />
                    </p>
                    <p>
                        Link-Beschreibung:
                        <asp:TextBox ID="txtEditLinkDescription" runat="server" Width="350px" />
                    </p>
                    <p>
                        <asp:Label ID="lblLinkUpdateError" runat="server" CssClass="errorlabel" />&nbsp;
                    </p>
                    <p>
                        <asp:Button ID="btnSaveLink" OnClick="btnUpdateLink_Click" Text="Speichern" runat="server" Width="200px" />&nbsp;<asp:Button Text="Abbrechen" runat="server" OnClick="btnCancelLink_Click" Width="200px" />
                    </p>
                </asp:View>
            </asp:MultiView>
        </asp:View>
        <asp:View ID="vResponsible" runat="server">
            <asp:GridView ID="grResponsible" runat="server" AutoGenerateColumns="false" Width="100%">
                <Columns>
                    <asp:BoundField DataField="UserFullName" HeaderText="Name" ReadOnly="true" />
                    <asp:BoundField DataField="UserPhone" HeaderText="Telefon" ReadOnly="true" />
                    <asp:TemplateField>
                        <HeaderTemplate>Mail</HeaderTemplate>
                        <ItemTemplate>
                            <a class="feedback" href='mailto:<%# DataBinder.Eval(Container.DataItem, "UserMail") %>?subject=<%# this.GetTitle() %>'>
                                <%# DataBinder.Eval(Container.DataItem, "UserMail") %>
                            </a>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField ItemStyle-CssClass="command">
                        <HeaderTemplate>Befehle</HeaderTemplate>
                        <ItemTemplate>
                            <asp:ImageButton ImageUrl="~/img/DeleteItem.png" Width="16" Height="16" AlternateText="Verantwortung aufgeben" runat="server"
                                OnClick="btnResponsibility_Command" CommandName="DeleteResponibility" ToolTip="Verantwortung aufgeben"
                                OnClientClick="return confirm('Sind Sie sicher, dass Sie die Verantwortung für das Item aufgeben wollen?');"
                                CommandArgument='<%# DataBinder.Eval(Container.DataItem, "UserId") %>'
                                Visible='<%# DataBinder.Eval(Container.DataItem, "UserId").ToString().Equals(Request.LogonUserIdentity.Name, StringComparison.CurrentCultureIgnoreCase) %>' />
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
            </asp:GridView>
        </asp:View>
        <asp:View ID="vDependendItems" runat="server">
            <asp:MultiView ID="mvConnections" runat="server" ActiveViewIndex="0">
                <asp:View runat="server">
                    <asp:GridView ID="grConnections" runat="server" AutoGenerateColumns="false" Width="100%">
                        <Columns>
                            <asp:BoundField DataField="ConnTypeName" HeaderText="Verbindungstyp" ReadOnly="true" />
                            <asp:BoundField DataField="ItemTypeName" HeaderText="Item-Typ" ReadOnly="true" />
                            <asp:BoundField DataField="ItemName" HeaderText="Configuration Item" />
                            <asp:BoundField DataField="Description" HeaderText="Beschreibung" />
                            <asp:TemplateField ItemStyle-CssClass="command">
                                <HeaderTemplate>Befehle</HeaderTemplate>
                                <ItemTemplate>
                                    <asp:ImageButton ID="btnDeleteConnection" ImageUrl="~/img/DeleteItem.png" Width="16" Height="16" AlternateText="Löschen" runat="server"
                                        OnClick="btnConnection_Command" CommandName="DeleteConnection" ToolTip="Verbindung löschen"
                                        OnClientClick="return confirm('Sind Sie sicher, dass Sie die Verbindung löschen wollen?');"
                                        CommandArgument='<%# DataBinder.Eval(Container.DataItem, "ConnId") %>'
                                        Visible='<%# DataBinder.Eval(Container.DataItem, "ConnId").ToString() != string.Empty %>' />
                                    <asp:ImageButton ID="btnInsertLink" ImageUrl="~/img/AddNewItem.png" Width="16" Height="16" AlternateText="Einfügen" runat="server"
                                        OnClick="btnConnection_Command" ToolTip="Verbindung hinzufügen" CommandName="CreateConnection"
                                        CommandArgument='<%# DataBinder.Eval(Container.DataItem, "ConnRuleId") %>'
                                        Visible='<%# DataBinder.Eval(Container.DataItem, "ConnId").ToString() == string.Empty %>' />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </asp:View>
                <asp:View runat="server">
                    <h2>Verbindung hinzufügen</h2>
                    <p>
                        <asp:Label ID="lblConnectionAndItemTypeName" runat="server" />
                    </p>
                    <p>
                        <asp:DropDownList ID="lstItemsToConnectTo" runat="server" DataTextField="ItemName" DataValueField="ItemId" />
                    </p>
                    <p>
                        Beschreibung der Verbindung
                    </p>
                    <p>
                        <asp:TextBox ID="txtConnectionDescription" runat="server" />
                    </p>
                    <p>
                        <asp:Button runat="server" OnClick="btnCreateConnection_Click" Text="Speichern" Width="120px" />
                        <asp:Button runat="server" OnClick="btnCancelCreateConnection_Click" Text="Abbrechen" Width="120px" CausesValidation="False" />
                        <br />
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="lstItemsToConnectTo" Display="Dynamic" Text="Es muss ein Configuration Item ausgewählt sein." Font-Bold="True" CssClass="errorlabel" />
                    </p>
                    <p>
                        <asp:Button ID="btnAddMultipleConnections" runat="server" OnClick="btnAddMultipleConnections_Click" Text="Mehrere Verbindungen erstellen" Width="240px" CausesValidation="False" />
                    </p>
                </asp:View>
                <asp:View runat="server">
                    <h2>Verbindungen hinzufügen</h2>
                    <p>
                        <asp:Label ID="lblConnectionAndItemTypeNameMulti" runat="server" />
                    </p>
                    <p>
                        <asp:TextBox ID="txtConnDescriptionMulti" runat="server" />
                    </p>
                    <p>
                        <asp:CheckBoxList ID="lstItemsToConnectToMulti" runat="server" DataTextField="ItemName" DataValueField="ItemId" />
                    </p>
                    <p>
                        <asp:Button runat="server" OnClick="btnCreateConnections_Click" Text="Speichern" Width="120px" />
                        <asp:Button runat="server" OnClick="btnCancelCreateConnection_Click" Text="Abbrechen" Width="120px" />
                        <br />
                        <asp:Label ID="lblConnectMultiError" runat="server" Text="Es muss mindestens ein Configuration Item ausgewählt sein." Font-Bold="True" CssClass="errorlabel" Visible="false" EnableViewState="false" />
                    </p>

                </asp:View>
            </asp:MultiView>
        </asp:View>
    </asp:MultiView>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="cphAside" runat="Server">
    <ul class="actions">
        <li class="action">
            <asp:HyperLink ID="lnkCopyItem" runat="server" Text="CI kopieren" ToolTip="Erzeugt ein neues Configuration Item als Kopie des aktuellen CI" CssClass="intern" />
        </li>
        <li class="action">
            <a href="ShowGraphical.aspx?id=<%: Request.QueryString["id"] %>" class="intern" target="_blank">Grafisch anzeigen</a>
        </li>
        <li class="action">
            <asp:HyperLink ID="lnkViewItem" runat="server" Text="Item anzeigen" ToolTip="Wechselt zurück zur Ansicht aller Eigenschaften des aktuellen CI." CssClass="intern" />
        </li>
        <li class="action">
            <asp:HyperLink ID="lnkSearchNeighbor" runat="server" Text="Nachbarn suchen" ToolTip="Sucht ausgehend vom aktuellen CI alle Verbindungen nach bestimmten CIs ab.." CssClass="intern" />
        </li>
        <li class="action">
            <asp:LinkButton ID="btnDeleteItem" runat="server" CssClass="intern" ToolTip="Configuration Item löschen (inklusive aller Attribute, Links und Verbindungen zu anderen Items)"
                OnClientClick="return confirm('Wollen Sie wirklich das aktuelle Configuration Item inklusive aller Attribute, Links und Verbindungen zu anderen Items unwiderruflich löschen?');"
                OnClick="btnDeleteItem_Click" Text="Löschen" />
        </li>
    </ul>
</asp:Content>

