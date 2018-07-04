using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class EditItem : System.Web.UI.Page
{
    private Guid itemId;
    private ConfigurationItem item;
    private bool isResponsible;
    private ItemAttribute itemAttribute;
    private ItemLink itemLink;

    protected void Page_Load(object sender, EventArgs e)
    {
        lnkCopyItem.Visible = ((CMDB)this.Master).UserCanEdit;
        // Überprüfen, ob eine gültige Id in der URL übergeben wurde
        string idQueryString = Request.QueryString["id"];
        if (string.IsNullOrWhiteSpace(idQueryString) || !Guid.TryParse(idQueryString, out itemId) || !((CMDB)this.Master).UserCanEdit)
        {
            Response.Redirect("~/Default.aspx", true);
            return;
        }

        item = DataHandler.GetConfigurationItem(this.itemId);
        if (item == null)
        {
            Response.Redirect("~/Default.aspx", true);
            return;
        }

        if (!IsPostBack)
        {
            lnkViewItem.NavigateUrl = string.Format("~/ShowItem.aspx?id={0}", idQueryString);
            lnkSearchNeighbor.NavigateUrl = string.Format("~/SearchNeighbor.aspx?id={0}", idQueryString);
            lnkCopyItem.NavigateUrl = string.Format("~/CreateItem.aspx?id={0}", idQueryString);
        }

        // Verantwortlichkeit prüfen
        this.isResponsible = SecurityHandler.UserIsResponsible(itemId, Request.LogonUserIdentity.Name);
        lblError.Visible = !this.isResponsible;
        lblError.Text = this.isResponsible ? "" : "Sie sind nicht als Verantwortlicher eingetragen. Übernehmen Sie zuerst die Verantwortung, dann können Sie editieren.";
        btnTakeResponsibility.Visible = !this.isResponsible;
        btnSaveItem.Visible = this.isResponsible;
        txtItemName.Enabled = this.isResponsible;
        btnDeleteItem.Visible = this.isResponsible;

        this.Title = GetTitle() + " editieren";

        // Felder befüllen
        if (!IsPostBack)
        {
            txtItemName.Text = item.ItemName;
            btnEditAttributes_Click(sender, e);
            if (Session["ErrorsFromCreation"] != null) // wurden bei der Erstellung Fehler gemacht, werden diese hier angezeigt.
            {
                lblError.Text += string.Format("Fehler bei der Erstellung: {0}", Session["ErrorsFromCreation"]);
                Session.Remove("ErrorsFromCreation");
                lblError.Visible = true;
            }
        }
        else
        {
            if (ViewState["AttributeId"] != null)
                this.itemAttribute = DataHandler.GetAttribute(Guid.Parse(ViewState["AttributeId"].ToString()));
            if (ViewState["LinkId"] != null)
                this.itemLink = DataHandler.GetLink(Guid.Parse(ViewState["LinkId"].ToString()));
        }
        lblItemID.Text = item.ItemId.ToString();
        lblItemLastChange.Text = item.ItemLastChange.ToString();
        lblItemVersion.Text = item.ItemVersion.ToString();
        lblItemType.Text = item.TypeName;

    }

    protected string GetTitle()
    {
        return string.Format("{0}: {1}", item.TypeName, item.ItemName);
    }

    protected void btnTakeResponsibility_Click(object sender, EventArgs e)
    {
        SecurityHandler.TakeResponsibility(this.itemId, Request.LogonUserIdentity);
        Page.Response.Redirect(HttpContext.Current.Request.Url.ToString(), true);
    }

    protected void btnSaveItem_Click(object sender, EventArgs e)
    {
        txtItemName.Text = txtItemName.Text.Trim();
        if (string.IsNullOrWhiteSpace(txtItemName.Text))
        {
            lblError.Text = "Sie müssen einen Namen für das Configuration Item angeben.";
            lblError.Visible = true;
            return;
        }
        if (txtItemName.Text.Equals(item.ItemName, StringComparison.CurrentCulture))
        {
            lblError.Text = "Sie haben nichts geändert.";
            lblError.Visible = true;
            return;
        }
        try
        {
            item.ItemName = txtItemName.Text;
            DataHandler.UpdateConfigurationItem(item, Request.LogonUserIdentity);
        }
        catch (Exception ex)
        {
            lblError.Text = ex.Message;
            lblError.Visible = true;
            return;
        }
        Page.Response.Redirect(HttpContext.Current.Request.Url.ToString(), true);
    }

    protected void btnEditAttributes_Click(object sender, EventArgs e)
    {
        this.ResetTabs();
        btnEditAttributes.CssClass = "selectedTab";
        mvContent.ActiveViewIndex = 0;
        List<Guid> attributes = this.getAttributesForItem(this.item.ItemId);
        IEnumerable<AttributeGroup> dt = MetaDataHandler.GetAttributeGroupsAssignedToItemType(this.item.ItemType);
        grAttributes.Columns[3].Visible = this.isResponsible;
        System.Data.DataTable t = CreateAttributeViewTable();
        foreach (AttributeGroup agr in dt)
        {
            foreach (GroupAttributeTypeMapping gar in MetaDataHandler.GetGroupAttributeTypeMappings().Where(ga => ga.GroupId.Equals(agr.GroupId)))
            {
                ItemAttribute attr = DataHandler.GetAttributeForConfigurationItemByAttributeType(itemId, gar.AttributeTypeId);
                object attId = "",
                    attValue = "",
                    attTypeId = gar.AttributeTypeId,
                    attTypeName = MetaDataHandler.GetAttributeType(gar.AttributeTypeId).TypeName;
                if (attr != null) // Attribut vorhanden
                {
                    attValue = attr.AttributeValue;
                    attId = attr.AttributeId;
                    attributes.RemoveAt(attributes.IndexOf(attr.AttributeId));
                }
                t.Rows.Add(agr.GroupName, attId, attTypeId, attTypeName, attValue);
            }
        }
        if (attributes.Count > 0) // Noch Attribute vorhanden, die keiner dem ItemType zugeordneten Gruppe angehören, was eigentlich nicht sein darf
        {
            for (int i = 0; i < attributes.Count; i++)
            {
                ItemAttribute attr = DataHandler.GetAttribute(attributes[i]);
                t.Rows.Add("Nicht erlaubte Attribute", attr.AttributeId, attr.AttributeTypeId, attr.AttributeTypeName, attr.AttributeValue);
            }
        }
        grAttributes.DataSource = t;
        grAttributes.DataBind();

    }

    private static System.Data.DataTable CreateAttributeViewTable()
    {
        System.Data.DataTable t = new System.Data.DataTable("Attributes");
        t.Columns.Add("GroupName");
        t.Columns.Add("AttributeId");
        t.Columns.Add("AttributeTypeId");
        t.Columns.Add("AttributeTypeName");
        t.Columns.Add("AttributeValue");
        return t;
    }

    private void ResetTabs()
    {
        btnEditAttributes.CssClass = "notSelectedTab";
        btnEditConnections.CssClass = "notSelectedTab";
        btnEditLinks.CssClass = "notSelectedTab";
        btnEditResponsibility.CssClass = "notSelectedTab";
    }
    /// <summary>
    /// Gibt eine Liste mit Attributen zu einem Item zurück
    /// </summary>
    /// <param name="itemId">Guid des Items</param>
    /// <returns>Liste</returns>
    private List<Guid> getAttributesForItem(Guid itemId)
    {
        IEnumerable<ItemAttribute> dt = DataHandler.GetAttributesForConfigurationItem(itemId);
        List<Guid> attributes = new List<Guid>(dt.Count());
        foreach (ItemAttribute iar in dt)
        {
            attributes.Add(iar.AttributeId);
        }
        return attributes;
    }

    protected void btnEditLinks_Click(object sender, EventArgs e)
    {
        this.ResetTabs();
        btnEditLinks.CssClass = "selectedTab";
        grLinks.Columns[2].Visible = this.isResponsible;
        btnInsertLink.Visible = this.isResponsible;
        mvContent.ActiveViewIndex = 1;
        grLinks.DataSource = DataHandler.GetLinksForConfigurationItem(this.itemId);
        grLinks.DataBind();
    }

    protected void btnEditResponsibility_Click(object sender, EventArgs e)
    {
        this.ResetTabs();
        btnEditResponsibility.CssClass = "selectedTab";
        mvContent.ActiveViewIndex = 2;
        System.Data.DataTable t = new System.Data.DataTable();
        t.Columns.Add("UserId");
        t.Columns.Add("UserFullName");
        t.Columns.Add("UserPhone");
        t.Columns.Add("UserMail");
        foreach (ItemResponsibility rr in DataHandler.GetResponsibilitesForConfigurationItem(item.ItemId))
        {
            ADSHelper.UserObject user = ADSHelper.GetUserProperties(rr.ResponsibleToken);
            t.Rows.Add(rr.ResponsibleToken, user.displayname, user.telephonenumber, user.mail);
        }
        grResponsible.DataSource = t;
        grResponsible.DataBind();
    }

    protected void btnEditConnections_Click(object sender, EventArgs e)
    {
        this.ResetTabs();
        btnEditConnections.CssClass = "selectedTab";
        mvContent.ActiveViewIndex = 3;
        grConnections.Columns[3].Visible = this.isResponsible;
        System.Data.DataTable t = new System.Data.DataTable();
        t.Columns.Add("ConnId");
        t.Columns.Add("ConnRuleId");
        t.Columns.Add("ConnTypeId");
        t.Columns.Add("ConnTypeName");
        t.Columns.Add("ItemTypeId");
        t.Columns.Add("ItemTypeName");
        t.Columns.Add("ItemId");
        t.Columns.Add("ItemName");
        t.Columns.Add("Description");
        IEnumerable<ConnectionRule> dt = MetaDataHandler.GetConnectionRulesByUpperItemType(this.item.ItemType);
        IEnumerable<Connection> connectionsToLower = DataHandler.GetConnectionsToLowerForItem(itemId).OrderBy(a => DataHandler.GetConfigurationItem(a.ConnLowerItem).ItemName);
        foreach (ConnectionRule crr in dt.OrderBy(a => string.Format("{0} - {1}",
            MetaDataHandler.GetConnectionType(a.ConnType).ConnTypeName, MetaDataHandler.GetItemType(a.ItemLowerType).TypeName)))
        {
            // Sortiert die Tabelle nach Item-Namen
            List<Connection> dtconn = connectionsToLower.Where(c => c.RuleId.Equals(crr.RuleId)).ToList();
            bool addConnectionDisplayed = false;
            for (int i = 0; i < crr.MaxConnectionsToLower; i++)
            {
                if (dtconn.Count() > i) // Objekte entsprechend Mindestregel vorhanden
                {
                    t.Rows.Add(dtconn[i].ConnId, crr.RuleId, crr.ConnType, MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName,
                        crr.ItemLowerType, string.Format("{0} ({1} / {2})", MetaDataHandler.GetItemType(crr.ItemLowerType).TypeName,
                        crr.MaxConnectionsToUpper, crr.MaxConnectionsToLower), dtconn[i].ConnLowerItem,
                        DataHandler.GetConfigurationItem(dtconn[i].ConnLowerItem).ItemName, dtconn[i].Description);
                }
                else // weniger Objekte als Maximum enthalten
                {
                    if (addConnectionDisplayed) // Mindestanzahl erfüllt
                        break;
                    // Hinzufügen anzeigen
                    addConnectionDisplayed = true;
                    if (this.isResponsible)
                        t.Rows.Add(string.Empty, crr.RuleId, crr.ConnType, MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName,
                            crr.ItemLowerType, string.Format("{0} ({1} / {2})", MetaDataHandler.GetItemType(crr.ItemLowerType).TypeName,
                        crr.MaxConnectionsToUpper, crr.MaxConnectionsToLower), string.Empty, string.Empty, string.Empty);
                }
            }
        }
        grConnections.DataSource = t;
        grConnections.DataBind();
    }

    protected string OpenWindowUrl(string url, string id)
    {
        return string.Format("windowOpenAndWaitForClose('{0}?id={1}');",
            VirtualPathUtility.ToAbsolute(url), id);
    }

    protected void btnUpdateAttribute_Click(object sender, EventArgs e)
    {
        if (!CheckAttributeValue(txtAttributeUpdateValue, lblAttributeUpdateError))
            return;
        if (this.itemAttribute == null) // Insert
        {
            try
            {
                ItemAttribute att = new ItemAttribute()
                {
                    AttributeId = Guid.NewGuid(),
                    ItemId = this.itemId,
                    AttributeTypeId = Guid.Parse(ViewState["AttributeTypeId"].ToString()),
                    AttributeValue = txtAttributeUpdateValue.Text
                };
                DataHandler.CreateAttribute(att, Request.LogonUserIdentity);
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
                lblError.Visible = true;
            }
            ViewState.Remove("AttributeTypeId");
        }
        else // Update
        {
            if (!txtAttributeUpdateValue.Text.Equals(itemAttribute.AttributeValue, StringComparison.CurrentCulture))
            {
                try
                {
                    itemAttribute.AttributeValue = txtAttributeUpdateValue.Text.Trim();
                    DataHandler.UpdateAttribute(itemAttribute, Request.LogonUserIdentity);
                }
                catch (Exception ex)
                {
                    lblError.Text = ex.Message;
                    lblError.Visible = true;
                }
            }
            ViewState.Remove("AttributeId");
        }
        mvAttributes.ActiveViewIndex = 0;
        btnEditAttributes_Click(sender, e);

    }

    private bool CheckAttributeValue(TextBox txt, Label err)
    {
        txt.Text = txt.Text.Trim();
        if (string.IsNullOrWhiteSpace(txt.Text))
        {
            err.Text = "Sie müssen einen Wert angeben.";
            err.Visible = true;
            txt.Focus();
            return false;
        }
        return true;
    }

    protected void btnCancelAttribute_Click(object sender, EventArgs e)
    {
        ViewState.Remove("AttributeId");
        ViewState.Remove("AttributeTypeId");
        mvAttributes.ActiveViewIndex = 0;
    }

    protected void btnAttribute_Command(object sender, EventArgs e)
    {
        ImageButton btn = (ImageButton)sender;
        string CommandName = btn.CommandName;
        string CommandArgument = btn.CommandArgument;

        switch (CommandName)
        {
            case "EditAttribute":
                ViewState.Add("AttributeId", CommandArgument);
                this.itemAttribute = DataHandler.GetAttribute(Guid.Parse(CommandArgument));
                lblAttributeHeadline.Text = string.Format("Attribut '{0}' ändern", itemAttribute.AttributeTypeName);
                txtAttributeUpdateValue.Text = itemAttribute.AttributeValue;
                mvAttributes.ActiveViewIndex = 1;
                break;
            case "CreateAttribute":
                ViewState.Add("AttributeTypeId", CommandArgument);
                AttributeType r = MetaDataHandler.GetAttributeType(Guid.Parse(CommandArgument));
                lblAttributeHeadline.Text = string.Format("Attribut '{0}' hinzufügen", r.TypeName);
                txtAttributeUpdateValue.Text = string.Empty;
                mvAttributes.ActiveViewIndex = 1;
                break;
            case "DeleteAttribute":
                this.itemAttribute = DataHandler.GetAttribute(Guid.Parse(CommandArgument));
                try
                {
                    DataHandler.DeleteAttribute(itemAttribute, Request.LogonUserIdentity);
                    btnEditAttributes_Click(sender, e);

                }
                catch (Exception ex)
                {
                    lblError.Text = ex.Message;
                    lblError.Visible = true;
                }
                break;
        }
    }

    protected void btnLink_Command(object sender, EventArgs e)
    {
        ImageButton btn = (ImageButton)sender;
        string CommandName = btn.CommandName;
        string CommandArgument = btn.CommandArgument;

        switch (CommandName)
        {
            case "EditLink":
                ViewState.Add("LinkId", CommandArgument);
                this.itemLink = DataHandler.GetLink(Guid.Parse(CommandArgument));
                txtEditLinkDescription.Text = this.itemLink.LinkDescription;
                txtEditLinkURI.Text = this.itemLink.LinkURI;
                mvLinks.ActiveViewIndex = 1;
                break;
            case "CreateLink":
                mvLinks.ActiveViewIndex = 1;
                txtEditLinkDescription.Text = string.Empty;
                txtEditLinkURI.Text = string.Empty;
                break;
            case "DeleteLink":
                this.itemLink = DataHandler.GetLink(Guid.Parse(CommandArgument));
                try
                {
                    DataHandler.DeleteLink(itemLink, Request.LogonUserIdentity);
                }
                catch (Exception ex)
                {
                    lblError.Text = ex.Message;
                    lblError.Visible = true;
                }
                btnEditLinks_Click(sender, e);
                break;
        }
    }

    protected void btnUpdateLink_Click(object sender, EventArgs e)
    {
        if (!CheckAttributeValue(txtEditLinkURI, lblLinkUpdateError) || !CheckAttributeValue(txtEditLinkDescription, lblLinkUpdateError))
            return;
        try
        {
            if (this.itemLink == null) // Insert
            {
                ItemLink il = new ItemLink() { LinkId = Guid.NewGuid(), ItemId = this.itemId, LinkURI = txtEditLinkURI.Text.Trim(), LinkDescription = txtEditLinkDescription.Text.Trim() };
                DataHandler.CreateLink(il, Request.LogonUserIdentity);
            }
            else // Update
            {
                itemLink.LinkDescription = txtEditLinkDescription.Text.Trim();
                itemLink.LinkURI = txtEditLinkURI.Text.Trim();
                DataHandler.UpdateLink(itemLink, Request.LogonUserIdentity);
                ViewState.Remove("LinkId");
            }

        }
        catch (Exception ex)
        {
            lblError.Text = ex.Message;
            lblError.Visible = true;
        }
        mvLinks.ActiveViewIndex = 0;
        btnEditLinks_Click(sender, e);
    }

    protected void btnCancelLink_Click(object sender, EventArgs e)
    {
        ViewState.Remove("LinkId");
        mvLinks.ActiveViewIndex = 0;
    }

    /// <summary>
    /// Ersetzt in langen Pfaden den mittleren Teil mit drei Punkten
    /// </summary>
    /// <param name="path">Pfad, der gekürzt werden soll</param>
    protected string PathShortener(string path)
    {
        const string pattern = @"^(\w+:/|\w+:///)(/[^/]+/[^/]+/).*([/:][^/]+[/:][^/]*)$";
        const string replacement = "$1$2...$3";
        if (System.Text.RegularExpressions.Regex.IsMatch(path, pattern))
        {
            return System.Text.RegularExpressions.Regex.Replace(path, pattern, replacement);
        }
        else
        {
            return path;
        }
    }

    protected void btnResponsibility_Command(object sender, EventArgs e)
    {
        try
        {
            SecurityHandler.AbandonResponsibility(itemId, Request.LogonUserIdentity);
        }
        catch (Exception ex)
        {
            lblError.Text = ex.Message;
            lblError.Visible = true;
        }
        Response.Redirect(Request.RawUrl, true);
    }

    protected void btnConnection_Command(object sender, EventArgs e)
    {
        ImageButton btn = (ImageButton)sender;
        string CommandName = btn.CommandName;
        string CommandArgument = btn.CommandArgument;

        switch (CommandName)
        {
            case "CreateConnection":
                mvConnections.ActiveViewIndex = 1;
                ConnectionRule crr = MetaDataHandler.GetConnectionRule(Guid.Parse(CommandArgument));
                lblConnectionAndItemTypeName.Text = string.Format("{0} {1}:", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName,
                    MetaDataHandler.GetItemType(crr.ItemLowerType).TypeName);
                lblConnectionAndItemTypeNameMulti.Text = lblConnectionAndItemTypeName.Text;
                txtConnectionDescription.Text = string.Empty;
                txtConnDescriptionMulti.Text = string.Empty;
                ViewState.Add("ConnectionRule", crr);
                IEnumerable<ConfigurationItem> ts = DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, crr.RuleId);
                lstItemsToConnectTo.DataSource = ts;
                lstItemsToConnectTo.DataBind();
                if (crr.MaxConnectionsToLower > DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, crr.RuleId).Count() + 1)
                {
                    lstItemsToConnectToMulti.DataSource = ts;
                    lstItemsToConnectToMulti.DataBind();
                    btnAddMultipleConnections.Visible = true;
                }
                else
                {
                    btnAddMultipleConnections.Visible = false;
                }
                break;
            case "DeleteConnection":
                Connection conn = DataHandler.GetConnection(Guid.Parse(CommandArgument));
                try
                {
                    DataHandler.DeleteConnection(conn, Request.LogonUserIdentity);
                }
                catch (Exception ex)
                {
                    lblError.Text = ex.Message;
                    lblError.Visible = true;
                }
                btnEditConnections_Click(sender, e);
                break;
        }
    }

    protected void btnCreateConnection_Click(object sender, EventArgs e)
    {
        ConnectionRule crr = (ConnectionRule)ViewState["ConnectionRule"];
        Guid itemToConnect = Guid.Parse(lstItemsToConnectTo.SelectedValue);
        ViewState.Remove("ConnectionRule");
        Connection conn = new Connection()
        {
            ConnId = Guid.NewGuid(),
            ConnType = crr.ConnType,
            ConnUpperItem = this.itemId,
            ConnLowerItem = itemToConnect,
            RuleId = crr.RuleId,
            Description = txtConnectionDescription.Text.Trim(),
        };
        try
        {
            DataHandler.CreateConnection(conn, Request.LogonUserIdentity);
        }
        catch (Exception ex)
        {
            lblError.Text = ex.Message;
            lblError.Visible = true;
        }
        btnEditConnections_Click(sender, e);
        mvConnections.ActiveViewIndex = 0;
    }

    protected void btnCreateConnections_Click(object sender, EventArgs e)
    {
        ConnectionRule crr = (ConnectionRule)ViewState["ConnectionRule"];
        int ctr = 0;
        for (int i = 0; i < lstItemsToConnectToMulti.Items.Count; i++)
        {
            if (lstItemsToConnectToMulti.Items[i].Selected)
            {
                if (crr.MaxConnectionsToLower <= DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, crr.RuleId).Count())
                    break; //Abbruch, wenn Maximum der Verbindungsobjekte erreicht wurde
                Guid itemToConnect = Guid.Parse(lstItemsToConnectToMulti.Items[i].Value);
                Connection conn = new Connection()
                {
                    ConnId = Guid.NewGuid(),
                    ConnType = crr.ConnType,
                    ConnUpperItem = this.itemId,
                    ConnLowerItem = itemToConnect,
                    RuleId = crr.RuleId,
                    Description = txtConnDescriptionMulti.Text.Trim(),
                };
                try
                {
                    DataHandler.CreateConnection(conn, Request.LogonUserIdentity);
                }
                catch (Exception ex)
                {
                    lblError.Text = ex.Message;
                    lblError.Visible = true;
                }
                ctr++;
            }
        }
        if (ctr > 0) // prüfen, ob überhaupt ein Item ausgewählt wurde; wenn  nicht Fehlermeldung
        {
            btnEditConnections_Click(sender, e);
            btnCancelCreateConnection_Click(sender, e);
        }
        else
            lblConnectMultiError.Visible = true;
    }

    protected void btnAddMultipleConnections_Click(object sender, EventArgs e)
    {
        mvConnections.ActiveViewIndex = 2;
    }

    protected void btnCancelCreateConnection_Click(object sender, EventArgs e)
    {
        ViewState.Remove("ConnectionRule");
        mvConnections.ActiveViewIndex = 0;
    }

    protected void btnDeleteItem_Click(object sender, EventArgs e)
    {
        try
        {
            DataHandler.DeleteConfigurationItem(item, Request.LogonUserIdentity);
            Response.Redirect("Default.aspx", true);
        }
        catch (Exception ex)
        {
            lblError.Text = ex.Message;
            lblError.Visible = true;
        }
    }
}