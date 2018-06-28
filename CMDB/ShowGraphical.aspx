<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ShowGraphical.aspx.cs" Inherits="ShowGraphical" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" media="screen" href="css/graphStyle.css" />
    <asp:Literal ID="headLiteral" runat="server" />
</head>
<body onload="drawShape();">
    <form id="form1" runat="server">
        <h1 id="headLine" runat="server" style="text-align: center;" />
        <div style="position: absolute; z-index: 1">
            <asp:Panel ID="pnlContent" runat="server">
                <asp:Menu ID="mContext" runat="server" CssClass="graphMenu" OnMenuItemClick="mContext_MenuItemClick" />
            </asp:Panel>
        </div>
        <canvas id="cnv" runat="server" style="z-index: 2;" />
        <p>Erstellt: <%: DateTime.Now.ToString() %></p>
    </form>
</body>
</html>
