using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CreateItem : System.Web.UI.Page
{
    private Guid itemId;
    private ConfigurationItem item;

    protected void Page_Load(object sender, EventArgs e)
    {
        string idQueryString = Request.QueryString["id"];
        if (!((CMDB)this.Master).UserCanEdit || MetaDataHandler.GetItemTypesCount() == 0)
        {
            Response.Redirect("~/Default.aspx", true);
            return;
        }
        if (!string.IsNullOrWhiteSpace(idQueryString))
        {
            if (!Guid.TryParse(idQueryString, out itemId))
            {
                Response.Redirect("~/Default.aspx", true);
                return;
            }
            item = DataHandler.GetConfigurationItem(itemId);
            if (item == null)
            {
                Response.Redirect("~/Default.aspx", true);
                return;
            }
            this.Title = string.Format("Configuration Item {0}: {1} kopieren", item.TypeName, item.ItemName);
            if (!IsPostBack)
            {
                cblAttributes.Items.Clear();
                foreach (ItemAttribute ar in DataHandler.GetAttributesForConfigurationItem(itemId).OrderBy(a => a.AttributeTypeName))
                {
                    cblAttributes.Items.Add(new ListItem(string.Format("{0}: {1}", ar.AttributeTypeName, ar.AttributeValue), ar.AttributeId.ToString())
                    {
                        Selected = true
                    });
                }
                if (cblAttributes.Items.Count == 0)
                {
                    cbAttributes.Checked = false;
                    cbAttributes.Enabled = false;
                    cbAttributes_CheckedChanged(sender, e);
                }

                cblLinks.Items.Clear();
                foreach (ItemLink lr in DataHandler.GetLinksForConfigurationItem(itemId).OrderBy(l => l.LinkDescription))
                {
                    cblLinks.Items.Add(new ListItem(string.Format("{0}: {1}", lr.LinkDescription, lr.LinkURI), lr.LinkId.ToString())
                    {
                        Selected = true
                    });
                }
                if (cblLinks.Items.Count == 0)
                {
                    cbLinks.Checked = false;
                    cbLinks.Enabled = false;
                    cbLinks_CheckedChanged(sender, e);
                }

                cblConnectionsToLower.Items.Clear();
                foreach (Connection cr in DataHandler.GetConnectionsToLowerForItem(itemId).OrderBy(c => MetaDataHandler.GetConnectionType(c.ConnType).ConnTypeName))
                {
                    ConfigurationItem lowerItem = DataHandler.GetConfigurationItem(cr.ConnLowerItem);
                    cblConnectionsToLower.Items.Add(new ListItem(string.Format("{0} {1}: {2}", MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeName, lowerItem.TypeName, lowerItem.ItemName), cr.ConnId.ToString())
                    {
                        Selected = true
                    });
                }
                if (cblConnectionsToLower.Items.Count == 0)
                {
                    cbConnectionsToLower.Checked = false;
                    cbConnectionsToLower.Enabled = false;
                    cbConnectionsToLower_CheckedChanged(sender, e);
                }
            }

        }
        else
        {
            this.Title = "Neues Configuration Item erstellen";
            pnlCopy.Visible = false;
        }
        lblError.Visible = false;
        if (!IsPostBack)
        {
            lstItemType.DataSource = MetaDataHandler.GetItemTypes();
            lstItemType.DataBind();
            if (item != null)
            {
                lstItemType.SelectedValue = item.ItemType.ToString();
                lstItemType.Enabled = false;
            }
        }
    }

    protected void btnCreateItem_Click(object sender, EventArgs e)
    {
        txtItemName.Text = txtItemName.Text.Trim();
        if (string.IsNullOrEmpty(txtItemName.Text))
        {
            lblError.Text = "Sie müssen einen Namen eingeben";
            lblError.Visible = true;
            txtItemName.Focus();
            return;
        }
        Guid newItemId = Guid.NewGuid();
        try
        {
            Guid itemType = Guid.Parse(lstItemType.SelectedValue);
            if (DataHandler.GetConfigurationItemByTypeIdAndName(itemType, txtItemName.Text) != null)
            {
                lblError.Text = "Es existiert bereits ein Configuration Item mit diesem Namen und diesem Typ. Bitte ändern Sie die Daten entsprechend.";
                lblError.Visible = true;
                txtItemName.Focus();
                return;
            }
            ConfigurationItem newItem = new ConfigurationItem() { ItemId = newItemId, ItemType = itemType, ItemName = txtItemName.Text };
            try
            {
                DataHandler.CreateConfigurationItem(newItem, Request.LogonUserIdentity);
            }
            catch (Exception ex)
            {
                lblError.Text = ex.Message;
                lblError.Visible = true;
                return;
            }
            if (item != null)
            {
                if (cbAttributes.Checked)
                {
                    for (int i = 0; i < cblAttributes.Items.Count; i++)
                    {
                        if (cblAttributes.Items[i].Selected)
                        {
                            ItemAttribute ar = DataHandler.GetAttribute(Guid.Parse(cblAttributes.Items[i].Value));
                            try
                            {
                                DataHandler.CreateAttribute(new ItemAttribute() { AttributeId = Guid.NewGuid(), ItemId = newItemId, AttributeTypeId = ar.AttributeTypeId, AttributeValue = ar.AttributeValue }, Request.LogonUserIdentity);
                            }
                            catch (Exception ex) { lblError.Text += ex.Message; }
                        }
                    }
                }
                if (cbConnectionsToLower.Checked)
                {
                    for (int i = 0; i < cblConnectionsToLower.Items.Count; i++)
                    {
                        if (cblConnectionsToLower.Items[i].Selected)
                        {
                            Connection cr = DataHandler.GetConnection(Guid.Parse(cblConnectionsToLower.Items[i].Value));
                            try
                            {
                                DataHandler.CreateConnection(new Connection() { ConnId = Guid.NewGuid(), ConnType = cr.ConnType, ConnUpperItem = newItemId, ConnLowerItem = cr.ConnLowerItem, RuleId = cr.RuleId, Description = cr.Description }, Request.LogonUserIdentity);
                            }
                            catch (Exception ex) { lblError.Text += ex.Message; }
                        }
                    }
                }
                if (cbLinks.Checked)
                {
                    for (int i = 0; i < cblLinks.Items.Count; i++)
                    {
                        if (cblLinks.Items[i].Selected)
                        {
                            try
                            {
                                ItemLink lr = DataHandler.GetLink(Guid.Parse(cblLinks.Items[i].Value));
                                DataHandler.CreateLink(new ItemLink() { LinkId = Guid.NewGuid(), ItemId = newItemId, LinkURI = lr.LinkURI, LinkDescription = lr.LinkDescription }, Request.LogonUserIdentity);
                            }
                            catch (Exception ex) { lblError.Text += ex.Message; }
                        }
                    }
                }
            }
            if (!string.IsNullOrWhiteSpace(lblError.Text))
                Session.Add("ErrorsFromCreation", lblError.Text);
            Response.Redirect(string.Format("EditItem.aspx?id={0}", newItemId), true);
        }
        catch (Exception ex)
        {
            lblError.Text = "Es ist ein Fehler beim Erstellen aufgetreten: " + ex.Message;
            lblError.Visible = true;
            txtItemName.Focus();
            return;
        }
    }

    protected void cbAttributes_CheckedChanged(object sender, EventArgs e)
    {
        cblAttributes.Visible = cbAttributes.Checked;
    }

    protected void cbConnectionsToLower_CheckedChanged(object sender, EventArgs e)
    {
        cblConnectionsToLower.Visible = cbConnectionsToLower.Checked;
    }

    protected void cbLinks_CheckedChanged(object sender, EventArgs e)
    {
        cblLinks.Visible = cbLinks.Checked;
    }

}