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
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <p></p>
            <asp:MultiView ID="mvContent" runat="server" ActiveViewIndex="0" OnActiveViewChanged="mvContent_ActiveViewChanged">
                <asp:View runat="server">
                    <table>
                        <tr>
                            <td>Betroffene Item-Typen:</td>
                            <td>
                                <asp:ListBox ID="lstItemTypes" runat="server" 
                                    DataTextField="TypeName" DataValueField="TypeId" Enabled="false" />
                            </td>
                        </tr>
                        <tr>
                            <td>Betroffene Configuration Items:</td>
                            <td>
                                <asp:Label ID="txtNumItems" runat="server" /></td>
                        </tr>
                        <tr>
                            <td>Betroffene Attribute:</td>
                            <td>
                                <asp:Label ID="txtNumAttributes" runat="server" /></td>
                        </tr>
                        <tr>
                            <td>Neu entstehende Configuration Items:</td>
                            <td>
                                <asp:Label ID="txtNumNewItems" runat="server" /></td>
                        </tr>
                    </table>
                    <hr />
                    <p>
                        Der neue Item-Typ soll
                        <asp:DropDownList ID="lstDirection" runat="server" AutoPostBack="true" OnSelectedIndexChanged="lstDirection_SelectedIndexChanged">
                            <asp:ListItem Selected="True" Text="oberhalb" Value="1" />
                            <asp:ListItem Text="unterhalb" Value="0" />
                        </asp:DropDownList>
                        des bisherigen Item-Typen mit dem Attribut stehen.
                    </p>
                    <p>Welcher Verbindungstyp soll verwendet werden?
                        <asp:DropDownList ID="lstConnectionType" runat="server" DataTextField="ConnTypeName" DataValueField="ConnTypeId"
                            OnPreRender="lstConnectionType_PreRender" /></p>
                    <p>Welche Attribut-Typen sollen vom alten Item-Typ zum aus dem Attribut-Typ neu erstellten Item-Typ transferiert werden?</p>
                    <asp:CheckBoxList ID="lstCorrespondingAttributeTypes" runat="server" DataTextField="TypeName" DataValueField="TypeId" />
                </asp:View>
            </asp:MultiView>
            <asp:Label ID="lblError" runat="server" Visible="false" CssClass="errorlabel" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
</asp:Content>

