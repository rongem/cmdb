<%@ Page Title="" Language="C#" MasterPageFile="~/CMDB.master" AutoEventWireup="true" CodeFile="Import.aspx.cs" Inherits="Import" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Importieren von Configuration Items</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
<script type="text/javascript">
    window.onload = function () {
        document.getElementById("<%=txtCopied.ClientID %>").onpaste = function () {
            var txt = this;
            setTimeout(function () {
                __doPostBack(txt.name, '');
            }, 0);
        }
    };
</script>
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <cmdb:HelpContent runat="server">
                <HelpContentTemplate>
                    <p>Über die Zwischenablage können Configuration Items inklusive Attributen, Verbindungen und Links importiert werden. Die CIs werden über ihren Namen eindeutig bestimmt.</p>
                    <p>Dabei kann als Trennzeichen sowohl der Tabulator (wie in Excel) oder ein Semikolon (wie bei CSV-Dateien verwendet werden.</p>
                </HelpContentTemplate>
            </cmdb:HelpContent>
            <h2>Einstellungen</h2>
            <p>
                Von welchem Typ werden CIs importiert?
                <asp:DropDownList ID="lstItemTypes" runat="server" AutoPostBack="true" DataValueField="TypeId" DataTextField="TypeName" OnSelectedIndexChanged="lstItemTypes_SelectedIndexChanged" />
            </p>
            <p>
                Welche Elemente sollen importiert werden?
                <asp:CheckBoxList ID="chkElements" runat="server" AutoPostBack="true" OnSelectedIndexChanged="chkElements_SelectedIndexChanged">
                    <asp:ListItem Text="Attribute" Value="attributes" Selected="True" />
                    <asp:ListItem Text="Verbindungen" Value="connections" />
                    <asp:ListItem Text="Hyperlinks" Value="links" Enabled="false" />
                </asp:CheckBoxList>
            </p>
            <p>
                <asp:CheckBox ID="chkIgnore" runat="server" Text="Bereits vorhandene CIs werden ignoriert" Checked="true" />
            </p>
            <asp:GridView ID="gvImport" runat="server" ShowHeaderWhenEmpty="true" />
            <asp:TextBox ID="txtCopied" runat="server" TextMode="MultiLine" AutoPostBack="true"
                OnTextChanged="PasteToGridView" Height="2" Width="2" />
            <asp:Label ID="lblLocalError" CssClass="errorlabel" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
</asp:Content>

