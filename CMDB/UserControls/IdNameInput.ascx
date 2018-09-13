<%@ Control Language="C#" AutoEventWireup="true" CodeFile="IdNameInput.ascx.cs" Inherits="UserControls_IdNameInput" %>
<div class="table">
    <div class="tr">
        <div class="td">ID:</div>
        <div class="td">
            <asp:TextBox ID="txtId" runat="server" Enabled="false" />
        </div>
    </div>
    <div class="tr">
        <div class="td">Bezeichnung:</div>
        <div class="td">
            <asp:TextBox ID="txtName" runat="server" />
        </div>
    </div>
    <div class="tr">
        <div class="td">
            <asp:Button ID="btnOK" runat="server" Text="Speichern" OnClick="btnOK_Click" />
        </div>
        <div class="td">
            <asp:Button ID="btnCancel" runat="server" Text="Abbrechen" OnClick="btnCancel_Click" />
        </div>
    </div>
</div>
<asp:Label ID="lblError" runat="server" CssClass="errorLabel" Visible="false" />