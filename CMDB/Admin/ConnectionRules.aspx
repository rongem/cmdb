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
                    <p>Verbindungsregeln steuern, welche <a href="ItemTypes.aspx">Typen von Configuration Items</a> miteinander verbunden werden dürfen. Nur da, wo explizit eine Regel existiert,
                        ist eine Verbindung möglich.
                    </p>
                    <p>Neben der reinen Möglichkeit der Verbindung werden einer Regel auch erlaubte Anzahlen von Verbindungen möglich. So sind Verbindungen 1:1, 1:n oder n:m denkbar.
                        Die jeweils angegebene Zahl stellt dabei die Obergrenze dessen dar, was erlaubt ist, die Untergrenze liegt immer bei 1.
                    </p>
                </HelpContentTemplate>
            </cmdb:HelpContent>
            <asp:Label ID="lblLocalError" CssClass="errorlabel" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphAside" runat="Server">
    <asp:UpdatePanel runat="server">
        <ContentTemplate>
            <ul>
                <li>
                </li>
            </ul>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

