<%@ Page Title="" Language="C#" MasterPageFile="~/Admin/Admin.master" AutoEventWireup="true" CodeFile="AttributeType.aspx.cs" Inherits="Admin_AttributeType" %>

<asp:Content ID="Content1" ContentPlaceHolderID="cphNav" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphMainHeader" runat="Server">
    <h1>Attribut-Typen</h1>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphMainArticle" runat="Server">
    <asp:ScriptManager runat="server" />
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <p>Attribute sind Textinformationen, die zu einem Configuration Item gespeichert werden.</p>
            <p>Attribute werden in <a href="AttributeGroups.aspx">Attributgruppen</a> zusammengefasst.</p>
            <p>Jedes Attribut in einer Gruppe kann nur einmal pro Configuration Item vergeben werden.</p>
            <div id="divContent" runat="server">
                <asp:GridView ID="gvAttributeTypes" runat="server"
                    EnablePersistedSelection="true"
                    DataKeyNames="Username"
                    AllowPaging="false"
                    AutoGenerateSelectButton="true"
                    AutoGenerateColumns="false"
                    OnSelectedIndexChanged="gvAttributeTypes_SelectedIndexChanged">
                    <AlternatingRowStyle />
                    <SelectedRowStyle />
                    <HeaderStyle />
                    <Columns>
                        <asp:BoundField DataField="TypeName" HeaderText="Attribut-Typ" />
                    </Columns>
                </asp:GridView>
            </div>
            <asp:Label ID="lblLocalError" CssClass="errorlabel" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>

</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
    <ul>
        <li>
            <a href="NewAttributeType.aspx">Neuen Attributtypen anlegen</a>
        </li>
    </ul>
</asp:Content>

