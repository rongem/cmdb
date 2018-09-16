<%@ Page Title="" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="Import.aspx.cs" Inherits="Import" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Importieren von Configuration Items</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdateProgress runat="server" AssociatedUpdatePanelID="upImport">
        <ProgressTemplate>
            <div id="searchprogress">
                <span id="searching">Verarbeite Daten ...
                    <img src="img/ajax_load.gif" /></span>
            </div>
        </ProgressTemplate>
    </asp:UpdateProgress>
    <asp:UpdatePanel ID="upImport" runat="server">
        <ContentTemplate>
            <cmdb:HelpContent runat="server">
                <HelpContentTemplate>
                    <p>Über die Zwischenablage können Configuration Items inklusive Attributen, Verbindungen und Links importiert werden. Die CIs werden über ihren Namen eindeutig bestimmt.</p>
                    <p>Dabei kann als Trennzeichen sowohl der Tabulator (wie in Excel) oder ein Semikolon (wie bei CSV-Dateien verwendet werden.</p>
                </HelpContentTemplate>
            </cmdb:HelpContent>
            <asp:Wizard ID="wzContent" runat="server" DisplaySideBar="false">
                <WizardSteps>
                    <asp:WizardStep ID="wzsFile" runat="server" StepType="Complete">
                        <h2>Hochladen der Datei und Festlegen der Rahmenbedingungen</h2>
                        <p>
                            Folgender Item-Typ soll importiert werden:
                            <asp:DropDownList ID="lstItemTypes" runat="server" DataValueField="TypeId" DataTextField="TypeName" />
                        </p>
                        <p>
                            Welche Elemente sollen importiert werden?
                            <asp:CheckBoxList ID="chkElements" runat="server">
                                <asp:ListItem Text="Attribute" Selected="True" />
                                <asp:ListItem Text="Verbindungen nach unten" />
                                <asp:ListItem Text="Verbindungen nach oben" />
                                <asp:ListItem Text="Hyperlinks" />
                            </asp:CheckBoxList>
                        </p>
                        <p>
                            <asp:CheckBox ID="chkIgnore" runat="server" Text="CIs, deren Namen bereits vorhanden ist, sollen ignoriert werden."
                                ToolTip="Es werden nur neue CIs angelegt, vorhanden werden nicht verändert, wenn diese Option gewählt ist." Checked="true" />
                        </p>
                        <p>
                            <asp:CheckBox ID="chkHeadlines" runat="server" Text="Die erste Zeile der Datei enthält die Spaltenüberschriften." />
                        </p>
                        <p>
                            Bitte die Datei zum Importieren hochladen:
                        </p>
                        <p>
                            <asp:FileUpload ID="fuImportFile" runat="server" />
                        </p>
                        <p><asp:Button ID="btnUpload" runat="server" Text="Datei hochladen und weiter" OnClick="btnUpload_Click" /></p>
                    </asp:WizardStep>
                    <asp:WizardStep runat="server" AllowReturn="false" OnDeactivate="Columns_Deactivate">
                        <h2>Zuordnen der Spalten</h2>
                        <asp:Repeater ID="repColumns" runat="server" OnItemDataBound="repColumns_ItemDataBound">
                            <HeaderTemplate>
                                <table>
                                    <tr>
                                        <th>Spalte</th>
                                        <th>Auswahl des Ziels</th>
                                    </tr>
                            </HeaderTemplate>
                            <ItemTemplate>
                                <tr>
                                    <td>
                                        <asp:Label ID="lblColumnName" runat="server" Text="<%# Container.DataItem.ToString() %>" />
                                    </td>
                                    <td>
                                        <asp:DropDownList ID="lstTargets" runat="server" DataTextField="Text" DataValueField="Value" />
                                    </td>
                                </tr>
                            </ItemTemplate>
                            <FooterTemplate>
                                </table>
                            </FooterTemplate>
                        </asp:Repeater>
                    </asp:WizardStep>
                    <asp:WizardStep runat="server" Title="Werte überprüfen" AllowReturn="false" OnActivate="Review_Activate">
                        <h2>Überprüfen der Werte</h2>
                        <asp:GridView ID="gvImport" runat="server" ShowHeaderWhenEmpty="true" />
                    </asp:WizardStep>
                    <asp:WizardStep>
                        <h2>Ergebnisse des Imports</h2>
                    </asp:WizardStep>
                </WizardSteps>
            </asp:Wizard>
            <asp:Label ID="lblLocalError" CssClass="errorlabel" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
</asp:Content>

