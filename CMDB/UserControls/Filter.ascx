<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Filter.ascx.cs" Inherits="Filter" %>
<asp:Button ID="btnShowFilter" runat="server" OnClick="btnShowFilter_Click" CssClass="filterbutton" Text="Filter hinzufügen" />
<asp:Panel ID="pnlFilter" runat="server" CssClass="filter" Visible="false">
    <asp:UpdatePanel ID="upSearchCriteria" runat="server">
        <ContentTemplate>
            <asp:Panel ID="pnlSearchText" runat="server">
                <div class="table">
                    <div class="tr">
                        <div class="td" style="text-align: center;">
                            <asp:TextBox ID="txtSearchText" runat="server" ToolTip="Item-Name oder Attributwert eingeben" placeholder="Item-Name oder Attribut..." CssClass="searchtextbox" />
                        </div>
                    </div>
                </div>
            </asp:Panel>
            <div ID="divSearch" runat="server">
                <div class="table">
                    <div class="tr">
                        <div class="td">
                            <asp:CheckBox ID="chkSearchItemType" runat="server" Width="15px" AutoPostBack="true" OnCheckedChanged="chkSearchItemType_CheckedChanged" />
                            Item-Typ:&nbsp;
                        </div>
                        <div class="td">
                            <asp:DropDownList ID="lstSearchItemType" runat="server" DataValueField="TypeId" DataTextField="TypeName" AutoPostBack="True" OnSelectedIndexChanged="lstSearchItemType_SelectedIndexChanged" />
                        </div>
                    </div>
                </div>
                <asp:Panel ID="pnlSearchConnections" runat="server" Visible="false">
                    <div class="table">
                        <div class="tr">
                            <div class="td">
                                &nbsp;&nbsp;&nbsp;<asp:CheckBox ID="chkSearchAttributeTypes" runat="server" AutoPostBack="true" OnCheckedChanged="chkSearchAttributeTypes_CheckedChanged" />
                                Attribute
                            </div>
                            <div class="td">
                                <asp:DropDownList ID="lstAttributeTypes" runat="server" DataValueField="TypeID" DataTextField="TypeName" AutoPostBack="true" OnSelectedIndexChanged="lstAttributeTypes_SelectedIndexChanged" />
                            </div>
                            <div class="td">
                                <asp:TextBox ID="txtAttributeContent" runat="server" AutoPostBack="true" OnTextChanged="txtAttributeContent_TextChanged" />
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                &nbsp;&nbsp;&nbsp;<asp:CheckBox ID="chkSearchConnectionDownward" runat="server" Width="15px" AutoPostBack="true" OnCheckedChanged="chkSearchConnectionDownward_CheckedChanged" ToolTip="abwärts gerichtete Verbindungen" />
                            </div>
                            <div class="td">
                                <asp:DropDownList ID="lstSearchConnectionType" runat="server" DataValueField="ConnTypeId" DataTextField="ConnTypeName" AutoPostBack="True" OnSelectedIndexChanged="lstSearchConnectionType_SelectedIndexChanged" ToolTip="abwärts gerichtete Verbindungen" />
                            </div>
                            <div class="td">
                                <asp:DropDownList ID="lstItemsDownward" runat="server" ToolTip="Anzahl von abwärts gerichteten Verbindungen">
                                    <asp:ListItem Selected="True" Value="0" />
                                    <asp:ListItem Value="1+" Text="> 0" />
                                    <asp:ListItem Value="1" />
                                    <asp:ListItem Value="2+" Text="> 1" />
                                </asp:DropDownList>
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td">&nbsp;</div>
                            <div class="td">
                                <asp:CheckBox ID="chkSearchConnectionDownwardWithItemType" runat="server" AutoPostBack="true" Width="15px" OnCheckedChanged="chkSearchConnectionDownwardWithItemType_CheckedChanged" ToolTip="abwärts gerichtete Verbindungen" />
                                zum Typ
                            </div>
                            <div class="td">
                                &nbsp;&nbsp;&nbsp;<asp:DropDownList ID="lstCITypesDownward" runat="server" DataValueField="TypeId" DataTextField="TypeName" AutoPostBack="True" OnSelectedIndexChanged="lstCITypesDownward_SelectedIndexChanged"></asp:DropDownList>
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                &nbsp;&nbsp;&nbsp;<asp:CheckBox ID="chkSearchConnectionUpward" runat="server" Width="15px" AutoPostBack="true" OnCheckedChanged="chkSearchConnectionUpward_CheckedChanged" ToolTip="aufwärts gerichtete Verbindungen" />
                            </div>
                            <div class="td">
                                <asp:DropDownList ID="lstSearchConnectionReverseType" runat="server" DataValueField="ConnTypeId" DataTextField="ConnTypeReverseName" AutoPostBack="True" OnSelectedIndexChanged="lstSearchConnectionReverseType_SelectedIndexChanged" ToolTip="aufwärts gerichtete Verbindungen" />
                            </div>
                            <div class="td">
                                <asp:DropDownList ID="lstItemsUpward" runat="server" ToolTip="Anzahl von aufwärts gerichteten Verbindungen" AutoPostBack="true" OnSelectedIndexChanged="lstItemsUpward_SelectedIndexChanged">
                                    <asp:ListItem Selected="True" Value="0" />
                                    <asp:ListItem Value="1+" Text="> 0" />
                                    <asp:ListItem Value="1" />
                                    <asp:ListItem Value="2+" Text="> 1" />
                                </asp:DropDownList>
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td">&nbsp;</div>
                            <div class="td">
                                <asp:CheckBox ID="chkSearchConnectionUpwardWithItemType" runat="server" AutoPostBack="true" Width="15px" OnCheckedChanged="chkSearchConnectionUpwardWithItemType_CheckedChanged" ToolTip="aufwärts gerichtete Verbindungen" />
                                zum Typ
                            </div>
                            <div class="td">
                                <asp:DropDownList ID="lstCITypesUpward" runat="server" DataValueField="TypeId" DataTextField="TypeName" AutoPostBack="True" OnSelectedIndexChanged="lstCITypesUpward_SelectedIndexChanged" />
                            </div>
                        </div>
                    </div>
                </asp:Panel>
                <div class="table">
                    <div class="tr">
                        <div class="td">
                            <asp:CheckBox ID="chkSearchOwn" runat="server" Width="15px" AutoPostBack="true" OnCheckedChanged="chkSearchOwn_CheckedChanged" />
                            Nur Items anzeigen, für die ich verantwortlich bin
                        </div>
                    </div>
                </div>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Panel>
