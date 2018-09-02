<%@ Control Language="C#" AutoEventWireup="true" CodeFile="HelpContent.ascx.cs" Inherits="UserControls_HelpContent" %>
<div style="float:right;">
    <asp:Button ID="btnOpen" runat="server" Text="?" OnClick="btnOpen_Click" ToolTip="Hilfetext einblenden" />
    <asp:Button ID="btnClose" runat="server" Text="^" Visible="false" OnClick="btnClose_Click" ToolTip="Hilfetext ausblenden" />
</div>
<div id="divContent" runat="server" visible="false" class="help">
    <asp:PlaceHolder ID="htmlSpace" runat="server" />
</div>