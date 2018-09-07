<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="ConvertAttributeToItem.aspx.cs" Inherits="Admin_ConvertAttributeToItem" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Attribut-Typen in Item-Typen konvertieren</h1>
    <h2>-
        <asp:Label ID="lblTypeName" runat="server" />
        -</h2>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdateProgress ID="upSearch" runat="server" AssociatedUpdatePanelID="upContent">
        <ProgressTemplate>
            <div id="searchprogress">
                <span id="searching">Arbeite ... <img src="~/img/ajax_load.gif" /></span>
            </div>
        </ProgressTemplate>
    </asp:UpdateProgress>
    <asp:UpdatePanel ID="upContent" runat="server">
        <ContentTemplate>
            <cmdb:HelpContent runat="server">
                <HelpContentTemplate>
                    <p>Die neuen Configuration Items werden mit den Configuration Items verbunden, deren Attribute sie bislang waren.</p>
                    <p>Beim Umwandeln eines Attribut-Typen in einen Configuration Item Typen werden identische Attributwerte zu einem Configuration Item zusammengefasst.
                        Folglich wird auf 5 Attributen mit dem Wert 'X' nur ein Configuration Item mit dem Namen 'X', das mit den 5 bisherigen Configuration Items,
                        die das Attribut besaßen, verbunden sind.
                    </p>
                    <p>Weiterhin können zusätzliche Attribute zum neuen Configuration Item mitgenommen werden, sofern ihre Werte konsistent mit den zu übertragenden 
                        Attributwerten übereinstimmen. Lautet also zu einem Attribut vom Typ 'Modell' der Wert 'Y', und beim zugehörigen Attribut 'Hersteller'
                        der Wert immer 'Z', so kann das Attribut 'Hersteller' als Attribut zum neuen Configuration Item-Typ 'Modell' mitgenommen werden.
                        Bei den bisherigen Configuration Items wird dann das Attribut 'Hersteller' entfernt.
                    </p>
                    <p>Je nach der zu verarbeitenden Datenmenge kann die Operation mehrere Minuten dauern.</p>
                </HelpContentTemplate>
            </cmdb:HelpContent>
            <asp:Wizard ID="mvContent" runat="server" DisplaySideBar="false">
                <WizardSteps>
                    <asp:WizardStep runat="server">
                        <div id="divNameExists" runat="server">
                            <p>Der Item-Typ <asp:Label ID="lblTypeName2" runat="server" /> existiert bereits. Soll 
                                <asp:RadioButtonList ID="rblChangeOrRename" runat="server" OnSelectedIndexChanged="rblChangeOrRename_SelectedIndexChanged">
                                    <asp:ListItem Selected="True" Text="der neue Name geändert oder" Value="rename" />
                                    <asp:ListItem Text="die Attribute dem vorhandenen Item-Typ hinzugefügt" Value="add" />
                                </asp:RadioButtonList>
                                werden?
                            </p>
                            <p id="pNewName" runat="server">Neuer Name: <asp:TextBox ID="txtNewName" runat="server" style="width:calc(100% - 300px);" /></p>
                            <hr />
                        </div>
                        <p>Hintergrundfarbe des Item-Typs: <asp:TextBox ID="txtColor" runat="server" TextMode="Color" /></p>
                        <p>
                            Der neue Item-Typ <asp:Label ID="lblTypeName3" runat="server" /> soll
                        <asp:DropDownList ID="lstDirection" runat="server" AutoPostBack="true" OnSelectedIndexChanged="lstDirection_SelectedIndexChanged">
                            <asp:ListItem Selected="True" Text="oberhalb" Value="above" />
                            <asp:ListItem Text="unterhalb" Value="below" />
                        </asp:DropDownList>
                            des bisherigen Item-Typen mit dem Attribut stehen. 
                        </p>
                        <p>
                            Welcher Verbindungstyp soll verwendet werden?
                        <asp:DropDownList ID="lstConnectionType" runat="server" DataTextField="ConnTypeName" DataValueField="ConnTypeId"
                            OnPreRender="lstConnectionType_PreRender" />
                        </p>
                        <p>Welche Attribut-Typen sollen vom alten Item-Typ zum aus dem Attribut-Typ neu erstellten Item-Typ transferiert werden?</p>
                        <asp:CheckBoxList ID="cblCorrespondingAttributeTypes" runat="server" DataTextField="TypeName" DataValueField="TypeId" />
                    </asp:WizardStep>
                    <asp:WizardStep runat="server" OnActivate="SummaryStep_Activate">
                        <h2>Zu erwartende Ergebnisse</h2>
                        <div class="table" id="divResult" runat="server">
                            <div class="tr">
                                <div class="td">
                                    <asp:Label ID="lblTypeName4" runat="server" />
                                </div>
                                <div class="td">
                                    <asp:Label ID="lblConnType" runat="server" />
                                </div>
                                <div class="td">
                                    <asp:ListBox ID="lstItemTypes" runat="server"
                                        DataTextField="TypeName" DataValueField="TypeId" Enabled="false" />
                                </div>
                            </div>
                        </div>
                        <table>
                            <tr>
                                <td>Anzahl tatsächlich betroffener Configuration Items:</td>
                                <td>
                                    <asp:Label ID="txtNumItems" runat="server" /></td>
                            </tr>
                            <tr>
                                <td>Anzahl betroffener Attribute:</td>
                                <td>
                                    <asp:Label ID="txtNumAttributes" runat="server" /></td>
                            </tr>
                            <tr>
                                <td>Neu aus den Attributen entstehende Configuration Items:</td>
                                <td>
                                    <asp:Label ID="txtNumNewItems" runat="server" /></td>
                            </tr>
                        </table>
                    </asp:WizardStep>
                    <asp:WizardStep AllowReturn="false" runat="server" Title="Operation abgeschlossen" OnActivate="FinalStep_Activate">
                        <asp:TextBox ID="txtResult" runat="server" TextMode="MultiLine" ReadOnly="true" />
                    </asp:WizardStep>
                </WizardSteps>
            </asp:Wizard>
            <asp:Label ID="lblError" runat="server" Visible="false" CssClass="errorlabel" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
</asp:Content>

