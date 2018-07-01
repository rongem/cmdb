<%@ Page Title="" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="CreateItem.aspx.cs" Inherits="CreateItem" %>

<asp:Content ID="Content3" ContentPlaceHolderID="cphNav" runat="Server">
    <ul>
        <li>
            <asp:Hyperlink runat="server" NavigateUrl="~/HelpPages/createitem.aspx" target="help">?</asp:Hyperlink>
        </li>
    </ul>
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="cphMainHeader" runat="server">
    <h1>Neues Configuration Item erstellen</h1>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <p>
        Item-Typ auswählen:
            <asp:DropDownList ID="lstItemType" runat="server" DataTextField="TypeName" DataValueField="TypeId" />
    </p>
    <p>
        Item-Namen eingeben:
            <asp:TextBox ID="txtItemName" runat="server" Width="290px" />
    </p>
    <p>
        <asp:Button ID="btnCreateItem" runat="server" Text="Speichern" OnClick="btnCreateItem_Click" />
    </p>
    <p>
        <asp:Label ID="lblError" runat="server" CssClass="errorlabel" Visible="false" />
    </p>
    <asp:Panel ID="pnlCopy" runat="server">
        <h2>Eigenschaften zum Kopieren auswählen</h2>
        <p>
            <asp:CheckBox ID="cbAttributes" runat="server" Checked="true" AutoPostBack="true" OnCheckedChanged="cbAttributes_CheckedChanged" />Attribute</p>
        <asp:CheckBoxList ID="cblAttributes" runat="server" />
        <p>
            <asp:CheckBox ID="cbConnectionsToLower" runat="server" Checked="true" AutoPostBack="true" OnCheckedChanged="cbConnectionsToLower_CheckedChanged" />Abwärts gerichtete Verbindungen</p>
        <asp:CheckBoxList ID="cblConnectionsToLower" runat="server" />
        <p>
            <asp:CheckBox ID="cbLinks" runat="server" Checked="true" AutoPostBack="true" OnCheckedChanged="cbLinks_CheckedChanged" />Doku-Links</p>
        <asp:CheckBoxList ID="cblLinks" runat="server" />
    </asp:Panel>
</asp:Content>
