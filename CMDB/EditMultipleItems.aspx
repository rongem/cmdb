<%@ Page Title="Mehrere Configuration Items editieren" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="EditMultipleItems.aspx.cs" Inherits="EditMultipleItems" %>

<asp:Content ID="Content3" ContentPlaceHolderID="cphNav" runat="Server">
    <asp:BulletedList ID="lstMenu" runat="Server">
        <asp:ListItem Value="~/Default.aspx" Text="Suchen"></asp:ListItem>
    </asp:BulletedList>
    <ul>
        <li>
            <a href="HelpPages/multiedititem.aspx" target="help">?</a>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Mehrere Configuration Items editieren</h1>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:Wizard ID="wzMultiEdit" runat="server" OnNextButtonClick="wzMultiEdit_NextButtonClick" DisplaySideBar="False" FinishCompleteButtonType="Link" FinishDestinationPageUrl="~/Default.aspx">
        <WizardSteps>
            <asp:WizardStep runat="server" Title="Aktionsauswahl" AllowReturn="false">
                <h2>Aktionen auswählen</h2>
                <p>
                    <asp:CheckBox ID="chkAttributes" runat="server" AutoPostBack="true" OnCheckedChanged="chkAttributes_CheckedChanged" Text="Attribute ändern" ToolTip="Das Attribut wird für alle Items geändert." /></p>
                <p>
                    <asp:CheckBoxList ID="cblAttributes" runat="server" /></p>
                <p>
                    <asp:CheckBox ID="chkDeleteConnections" runat="server" AutoPostBack="true" OnCheckedChanged="chkDeleteConnections_CheckedChanged" Text="Verbindungen löschen" /></p>
                <p>
                    <asp:CheckBoxList ID="cblDeleteConnections" runat="server" /></p>
                <p>
                    <asp:CheckBox ID="chkAddConnections" runat="server" AutoPostBack="true" OnCheckedChanged="chkAddConnections_CheckedChanged" Text="Verbindungen hinzufügen" /></p>
                <p>
                    <asp:RadioButtonList ID="cblAddConnections" runat="server" /></p>
            </asp:WizardStep>
            <asp:WizardStep runat="server" Title="Attribute" AllowReturn="false">
                <h2>Attribute editieren</h2>
                <asp:Repeater ID="rpAttributes" runat="server">
                    <HeaderTemplate>
                        <p>Vorbefüllte Felder bedeuten, dass hier alle CIs die gleichen Attributwerte besitzen. Bleibt ein Feld leer, wird keine Änderung durchgeführt.</p>
                        <div class="table">
                    </HeaderTemplate>
                    <ItemTemplate>
                        <div class="tr">
                            <div class="td">
                                <asp:Label runat="server" Text='<%# DataBinder.Eval(Container.DataItem, "AttributeTypeName") %>' />:&nbsp;
                            </div>
                            <div class="td">
                                <asp:TextBox runat="server" Text='<%# DataBinder.Eval(Container.DataItem, "AttributeValue") %>' />
                            </div>
                            <asp:HiddenField runat="server" Value='<%# DataBinder.Eval(Container.DataItem, "AttributeTypeId") %>' />
                        </div>
                    </ItemTemplate>
                    <FooterTemplate></div></FooterTemplate>
                </asp:Repeater>
            </asp:WizardStep>
            <asp:WizardStep runat="server" Title="Verbindung löschen" AllowReturn="false">
                <h2>Verbindungen löschen</h2>
                <p>Die nachfolgend aufgeführten Verbindungen werden endgültig gelöscht:</p>
                <p>
                    <asp:BulletedList ID="lstDeleteConnections" runat="server" />
                </p>
            </asp:WizardStep>
            <asp:WizardStep runat="server" Title="Verbindung hinzufügen" AllowReturn="false">
                <h2>Verbindungen hinzufügen</h2>
                <p>
                    <asp:Label ID="lblRule" runat="server"></asp:Label>
                    <asp:CheckBoxList ID="cblItemsToConnectTo" runat="server" />
                </p>
                <p>
                    Beschreibung der Verbindung:
                    <asp:TextBox ID="txtConnDescription" runat="server" />
                </p>
            </asp:WizardStep>
            <asp:WizardStep runat="server" Title="Verbindung hinzufügen">
                <h2>Aktion durchgeführt</h2>
                <p>Sie haben die folgenden Aktionen erfolgreich abgeschlossen:</p>
                <asp:BulletedList ID="lstResult" runat="server" />
            </asp:WizardStep>
        </WizardSteps>
    </asp:Wizard>
    <p>
        <asp:Label ID="lblError" runat="server" CssClass="errorlabel" ViewStateMode="Disabled"></asp:Label>
    </p>
    <h2>Die Aktionen betreffen folgende Configuration Items:</h2>
    <p>
        <asp:BulletedList ID="lstItems" runat="server" Target="_blank" />
    </p>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="cphAside" runat="Server">
</asp:Content>

