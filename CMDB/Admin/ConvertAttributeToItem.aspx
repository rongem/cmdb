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
                <span id="searching">Arbeite ... <img src="img/ajax_load.gif" /></span>
            </div>
        </ProgressTemplate>
    </asp:UpdateProgress>
    <asp:UpdatePanel ID="upContent" runat="server">
        <ContentTemplate>
            <p></p>
            <asp:Wizard ID="mvContent" runat="server" DisplaySideBar="false" OnActiveStepChanged="mvContent_ActiveStepChanged">
                <WizardSteps>
                    <asp:WizardStep runat="server">
                        <p>
                            Der neue Item-Typ <asp:Label ID="lblTypeName2" runat="server" /> soll
                        <asp:DropDownList ID="lstDirection" runat="server" AutoPostBack="true" OnSelectedIndexChanged="lstDirection_SelectedIndexChanged">
                            <asp:ListItem Selected="True" Text="oberhalb" Value="1" />
                            <asp:ListItem Text="unterhalb" Value="0" />
                        </asp:DropDownList>
                            des bisherigen Item-Typen mit dem Attribut stehen.
                        </p>
                        <p>
                            Welcher Verbindungstyp soll verwendet werden?
                        <asp:DropDownList ID="lstConnectionType" runat="server" DataTextField="ConnTypeName" DataValueField="ConnTypeId"
                            OnPreRender="lstConnectionType_PreRender" />
                        </p>
                        <p>Welche Attribut-Typen sollen vom alten Item-Typ zum aus dem Attribut-Typ neu erstellten Item-Typ transferiert werden?</p>
                        <asp:CheckBoxList ID="lstCorrespondingAttributeTypes" runat="server" DataTextField="TypeName" DataValueField="TypeId" />
                    </asp:WizardStep>
                    <asp:WizardStep runat="server">
                        <h2>Zu erwartende Ergebnisse</h2>
                        <div class="table" id="divResult" runat="server">
                            <div class="tr">
                                <div class="td">
                                    <asp:Label ID="lblTypeName3" runat="server" />
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
                </WizardSteps>
            </asp:Wizard>
            <asp:Label ID="lblError" runat="server" Visible="false" CssClass="errorlabel" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
</asp:Content>

