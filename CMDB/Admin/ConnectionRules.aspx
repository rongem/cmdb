<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="ConnectionRules.aspx.cs" Inherits="Admin_ConnectionRules" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Verbindungsregeln</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <cmdb:HelpContent runat="server">
                <HelpContentTemplate>
                    <p>
                        Verbindungsregeln steuern, welche <a href="ItemTypes.aspx">Typen von Configuration Items</a> miteinander verbunden werden dürfen. Nur da, wo explizit eine Regel existiert,
                        ist eine Verbindung möglich.
                    </p>
                    <p>
                        Neben der reinen Möglichkeit der Verbindung werden einer Regel auch erlaubte Anzahlen von Verbindungen möglich. So sind Verbindungen 1:1, 1:n oder n:m denkbar.
                        Die jeweils angegebene Zahl stellt dabei die Obergrenze dessen dar, was erlaubt ist.
                        Die Untergrenze liegt immer bei 0, d. h. eine Verbindung kann angelegt werden muss es aber nicht.
                    </p>
                </HelpContentTemplate>
            </cmdb:HelpContent>
            <div class="table">
                <div class="tr">
                    <div class="td">
                        Oberer Item-Typ
                    </div>
                    <div class="td">
                        Verbindungstyp
                    </div>
                    <div class="td">
                        Unterer Item-Typ
                    </div>
                </div>
                <div class="tr">
                    <div class="td">
                        <asp:DropDownList ID="lstUpperItemType" runat="server" DataValueField="TypeId" DataTextField="TypeName"
                            AutoPostBack="true" OnSelectedIndexChanged="lstFilter_SelectedIndexChanged" />
                    </div>
                    <div class="td">
                        <asp:DropDownList ID="lstConnectionType" runat="server" DataValueField="ConnTypeId" DataTextField="ConnTypeName"
                            AutoPostBack="true" OnSelectedIndexChanged="lstFilter_SelectedIndexChanged" />
                    </div>
                    <div class="td">
                        <asp:DropDownList ID="lstLowerItemType" runat="server" DataValueField="TypeId" DataTextField="TypeName"
                            AutoPostBack="true" OnSelectedIndexChanged="lstFilter_SelectedIndexChanged" />
                    </div>
                    <div class="td">
                        <asp:ImageButton ID="btnAddRule" runat="server" ImageUrl="~/img/AddNewItem.png" AlternateText="Regel für diese Kombination hinzufügen"
                            Visible="false" OnClick="btnAddRule_Click" Width="55%" />
                    </div>
                </div>
            </div>
            <div id="divAddRule" class="table" runat="server">
                <div class="tr">
                    <div class="td">
                        Maximale Anzahl von
                        <asp:Label ID="Label1" runat="server" />
                        die einem
                        <asp:Label ID="Label2" runat="server" />
                        hinzugefügt werden können.
                    </div>
                    <div class="td">
                        <asp:TextBox ID="txtNewToLower" runat="server" TextMode="Number" Text="1"
                            ToolTip="Maximale Anzahl von unteren Objekten, die einem oberen Objekt hinzugefügt werden können." />
                        <asp:RangeValidator ID="valToLower" runat="server"
                            MinimumValue="1" MaximumValue="9999"
                            ControlToValidate="txtNewToLower" Display="Dynamic" CssClass="errorlabel"
                            Text="Der Wert muss zwischen 1 und 9.999 liegen." />
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="txtNewToLower" Text="Der Wert der Verbindungen von oben muss eine Zahl sein." Display="Dynamic" CssClass="errorlabel" />
                    </div>
                </div>
                <div class="tr">
                    <div class="td">
                        Maximale Anzahl von
                        <asp:Label ID="lblUpperItemType2" runat="server" />
                        die einem
                        <asp:Label ID="lblLowerItemType2" runat="server" />
                        hinzugefügt werden können.
                    </div>
                    <div class="td">
                        <asp:TextBox ID="txtNewToUpper" runat="server" TextMode="Number" Text="1"
                            ToolTip="Maximale Anzahl von oberen Objekten, die einem unteren Objekt hinzugefügt werden können." />
                        <asp:RangeValidator ID="valToUpper" runat="server"
                            MinimumValue="1" MaximumValue="9999"
                            ControlToValidate="txtNewToUpper" Display="Dynamic" CssClass="errorlabel"
                            Text="Der Wert muss zwischen 1 und 9.999 liegen." />
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="txtNewToUpper" Text="Der Wert der Verbindungen von unten muss eine Zahl sein." Display="Dynamic" CssClass="errorlabel" />
                    </div>
                </div>
                <div class="tr">
                    <div class="td">
                        <asp:Button ID="btnCreate" runat="server" Text="Speichern" OnClick="btnCreate_Click" Width="45%" />
                        <asp:Button ID="btnCancelCreate" runat="server" Text="Abbrechen" OnClick="btnCancelCreate_Click" Width="45%" CausesValidation="False" />
                    </div>
                </div>
            </div>
            <asp:GridView ID="gvRules" runat="server"
                EnablePersistedSelection="true"
                DataKeyNames="RuleId"
                AllowPaging="false"
                AutoGenerateColumns="false">
                <AlternatingRowStyle />
                <SelectedRowStyle />
                <HeaderStyle />
                <Columns>
                    <asp:BoundField DataField="ItemUpperTypeName" HeaderText="Oberer Item-Typ" ReadOnly="true" />
                    <asp:BoundField DataField="ConnTypeName" HeaderText="Verbindungstyp" ReadOnly="true" />
                    <asp:BoundField DataField="ItemLowerTypeName" HeaderText="Unterer Item-Typ" ReadOnly="true" />
                    <asp:TemplateField HeaderText="Max. Verbindungen">
                        <ItemTemplate>
                            <asp:MultiView ID="mvMax" runat="server" ActiveViewIndex="0">
                                <asp:View runat="server">
                                    <asp:Label ID="lblMaxConnectionsToUpper" runat="server" Text='<%# Bind("MaxConnectionsToLower") %>'
                                        ToolTip="Maximale Anzahl von unteren Objekten, die einem oberen Objekt hinzugefügt werden können." />
                                    /
                                    <asp:Label ID="lblMaxConnectionsToLower" runat="server" Text='<%# Bind("MaxConnectionsToUpper") %>'
                                        ToolTip="Maximale Anzahl von oberen Objekten, die einem unteren Objekt hinzugefügt werden können." />
                                    <asp:ImageButton ID="btnEditRule" runat="server" ImageUrl="~/img/EditItem.png" AlternateText="Verbindungsregeln bearbeiten"
                                        CommandArgument='<%# Bind("RuleId") %>'
                                        ToolTip="Bearbeitet die Verbindungsregel" AccessKey="D"
                                        OnClick="btnEditRule_Click" CausesValidation="False" />
                                </asp:View>
                                <asp:View runat="server">
                                    Abwärts: 
                                    <asp:TextBox ID="txtToLower" runat="server" TextMode="Number" Text='<%# Bind("MaxConnectionsToLower") %>'
                                        ToolTip="Maximale Anzahl von unteren Objekten, die einem oberen Objekt hinzugefügt werden können." />
                                    <asp:RangeValidator ID="valToLower" runat="server"
                                        MinimumValue='<%# Math.Max(1,int.Parse(DataBinder.Eval(Container.DataItem, "MaxExistingConnectionsFromUpper").ToString())) %>' MaximumValue="9999"
                                        ControlToValidate="txtToLower" Display="Dynamic" CssClass="errorlabel"
                                        Text='<%# ("Der Wert muss zwischen " + Math.Max(1,int.Parse(DataBinder.Eval(Container.DataItem, "MaxExistingConnectionsFromUpper").ToString())) + " und 9.999 liegen.") %>' />
                                    <asp:RequiredFieldValidator runat="server" ControlToValidate="txtToLower" Text="Der Wert der Verbindungen von oben muss eine Zahl sein." Display="Dynamic" CssClass="errorlabel" />
                                    <br />
                                    Aufwärts:
                                    <asp:TextBox ID="txtToUpper" runat="server" TextMode="Number" Text='<%# Bind("MaxConnectionsToUpper") %>'
                                        ToolTip="Maximale Anzahl von oberen Objekten, die einem unteren Objekt hinzugefügt werden können." />
                                    <asp:RangeValidator ID="valToUpper" runat="server"
                                        MinimumValue='<%# Math.Max(1,int.Parse(DataBinder.Eval(Container.DataItem, "MaxExistingConnectionsFromLower").ToString())) %>' MaximumValue="9999"
                                        ControlToValidate="txtToUpper" Display="Dynamic" CssClass="errorlabel"
                                        Text='<%# ("Der Wert muss zwischen " + Math.Max(1,int.Parse(DataBinder.Eval(Container.DataItem, "MaxExistingConnectionsFromLower").ToString())) + " und 9.999 liegen.") %>' />
                                    <asp:RequiredFieldValidator runat="server" ControlToValidate="txtToUpper" Text="Der Wert der Verbindungen von unten muss eine Zahl sein." Display="Dynamic" CssClass="errorlabel" />
                                    <br />
                                    <asp:Button ID="btnSave" runat="server" Text="Speichern" CommandArgument='<%# Bind("RuleId") %>' OnClick="btnSave_Click" />
                                    <asp:Button ID="btnCancel" runat="server" Text="Abbrechen" OnClick="btnCancel_Click" CausesValidation="False" />
                                </asp:View>
                            </asp:MultiView>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField>
                        <ItemTemplate>
                            <asp:ImageButton ID="btnDeleteRule" runat="server" ImageUrl="~/img/DeleteItem.png" AlternateText="Verbindungsregeln löschen"
                                Visible='<%# (Eval("ExistingConnections").ToString() == "0") %>'
                                CommandArgument='<%# Bind("RuleId") %>'
                                ToolTip="Löscht die Verbindungsregel" AccessKey="D"
                                OnClientClick="return confirm('Sind Sie sicher, dass Sie die Verbindungsregel löschen wollen?');"
                                OnClick="btnDeleteRule_Click" />
                            <asp:Label ID="lblExistingConnections" runat="server" Text='<%# Bind("ExistingConnections") %>'
                                Visible='<%# (Eval("ExistingConnections").ToString() != "0") %>'
                                ToolTip="Anzahl der existierenden Verbindungen dieses Typs" />
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
            </asp:GridView>

            <asp:Label ID="lblLocalError" CssClass="errorlabel" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <ul>
                <li></li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

