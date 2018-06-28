<%@ Page Language="C#" MasterPageFile="~/HelpPages/help.master" AutoEventWireup="true" %>
<asp:Content ID="cSectionHeader" ContentPlaceHolderID="cphSectionHeader" runat="server">
    Nachbarschaftssuche
</asp:Content>
<asp:Content ID="cSectionArticle" ContentPlaceHolderID="cphSectionArticle" runat="server">
    <p>
        Manchmal m&ouml;chte man ausgehend von einem CI andere CIs finden, die nicht direkt 
        benachbart sind, sondern &uuml;ber mehrere Verbindungen zu erreichen sind. Beispiel: 
        Ein Server l&auml;uft in einer Server-Hardware, die in einem Blade Enclosure eingebaut 
        ist, das in ein Rack eingebaut ist, das in einem Raum steht. M&ouml;chte man zu dem Raum 
        alle Server finden, die dort laufen, ben&ouml;tigt man die Nachbarschaftssuche.
    </p>
    <p>
        F&uuml;r die Nachbarschaftssuche gibt man zuerst an, welchen CI-Typ man sucht. Zudem 
        k&ouml;nnen wie bei der allgemeinen Suche weitere <a href="Default.aspx">Suchkriterien</a> 
        definiert werden. Am Ende legt man fest, wie viele Verbindungsebenen man maximal durchlaufen
        m&ouml;chte (im obigen Beispiel w&auml;ren das mindestens 3) und in welche Richtung gesucht 
        werden soll (im obigen Beispiel w&auml;re das nach oben).
    </p>
    <p>
        Danach erh&auml;lt man eine Liste, die sich genau wie in der 
        <a href="Default.aspx">regul&auml;ren Suche</a> 
        exportieren und gemeinsam bearbeiten l&auml;sst.
    </p>
</asp:Content>
