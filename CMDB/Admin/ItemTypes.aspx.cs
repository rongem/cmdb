using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_ItemTypes : System.Web.UI.Page
{
    private bool listIsEmpty = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        lblLocalError.Visible = false;
        if (!IsPostBack)
        {
            IEnumerable<ItemType> itemTypes = MetaDataHandler.GetItemTypes();
            if (itemTypes.Count() == 0)
            {
                listIsEmpty = true;
                SetContent(Guid.NewGuid(), string.Empty, string.Empty);
                mvContent.ActiveViewIndex = 1;
                lblLocalError.Text = "Es sind keine Item-Typen vorhanden. Bitte legen Sie neue an.";
                lblLocalError.Visible = true;
                return;
            }
            gvTypes.DataSource = itemTypes;
            gvTypes.DataBind();
            gvTypes_SelectedIndexChanged(null, null);
        }
    }

    /// <summary>
    /// Setzt die Textfelder für die Eingabemaske
    /// </summary>
    /// <param name="guid">Guid</param>
    /// <param name="name">Name des Item-Typs</param>
    /// <param name="colorCode">Farbwert des Item-Typs</param>
    private void SetContent(Guid guid, string name, string colorCode)
    {
        txtId.Text = guid.ToString();
        txtName.Text = name;
        txtColor.Text = colorCode;
    }

    protected void gvTypes_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (gvTypes.SelectedRow == null)
        {
            btnEdit.Visible = false;
            btnDelete.Visible = false;
            divAssociations.Visible = false;
        }
        else
        {
            btnEdit.Visible = true;
            Guid itemType = Guid.Parse(gvTypes.SelectedRow.Cells[3].Text);
            btnDelete.Visible = MetaDataHandler.CanDeleteItemType(itemType);
            lstUnassignedAttributeGroups.DataSource = MetaDataHandler.GetAttributeGroupsNotAssignedToItemType(itemType);
            lstUnassignedAttributeGroups.DataBind();
            gvAssociations.DataSource = MetaDataHandler.GetAttributeGroupsAssignedToItemType(itemType);
            gvAssociations.DataBind();
            divAssociations.Visible = !(gvAssociations.Rows.Count == 0 && lstUnassignedAttributeGroups.Items.Count == 0);
            divAddGroup.Visible = !(lstUnassignedAttributeGroups.Items.Count == 0);

        }
    }

    protected void btnOK_Click(object sender, EventArgs e)
    {
        txtName.Text = txtName.Text.Trim();
        if (string.IsNullOrEmpty(txtName.Text) || txtName.Text.Length < 2)
        {
            lblLocalError.Text = "Bitte geben Sie einen Namen ein";
            lblLocalError.Visible = true;
            txtName.Focus();
            return;
        }
        Guid guid = Guid.Parse(txtId.Text);
        string name = txtName.Text,
            colorCode = txtColor.Text;
        ItemType itemType = MetaDataHandler.GetItemType(guid);
        if (itemType == null) // erstellen
        {
            itemType = new ItemType() { TypeId = guid, TypeName = name, TypeBackColor = colorCode };
            try
            {
                MetaDataHandler.CreateItemType(itemType, Request.LogonUserIdentity);
                ReloadPage();
            }
            catch (Exception ex)
            {
                lblLocalError.Visible = true;
                lblLocalError.Text = ex.Message;
            }
        }
        else // bearbeiten
        {
            itemType.TypeName = name;
            itemType.TypeBackColor = colorCode;
            try
            {
                MetaDataHandler.UpdateItemType(itemType, Request.LogonUserIdentity);
                ReloadPage();
            }
            catch (Exception ex)
            {
                lblLocalError.Visible = true;
                lblLocalError.Text = ex.Message;
            }
        }
    }

    protected void btnCancel_Click(object sender, EventArgs e)
    {
        if (!listIsEmpty)
        {
            mvContent.ActiveViewIndex = 0;
            btnCreate.Visible = true;
            gvTypes_SelectedIndexChanged(sender, e);
        }
    }

    private void ReloadPage()
    {
        Response.Redirect("ItemTypes.aspx", true);
    }

    protected void btnDelete_Click(object sender, EventArgs e)
    {
        ItemType itemType = MetaDataHandler.GetItemType(Guid.Parse(gvTypes.SelectedRow.Cells[3].Text));
        if (itemType == null)
        {
            lblLocalError.Text = "Item-Typ nicht gefunden";
            lblLocalError.Visible = true;
            return;
        }
        try
        {
            MetaDataHandler.DeleteItemType(itemType, Request.LogonUserIdentity);
            ReloadPage();
        }
        catch (Exception ex)
        {
            lblLocalError.Text = ex.Message;
            lblLocalError.Visible = true;
            return;
        }
    }

    protected void btnCreate_Click(object sender, EventArgs e)
    {
        lblEditCaption.Text = "Neuen Item-Typ anlegen";
        mvContent.ActiveViewIndex = 1;
        SetContent(Guid.NewGuid(), string.Empty, string.Empty);
    }

    protected void btnEdit_Click(object sender, EventArgs e)
    {
        lblEditCaption.Text = string.Format("Item-Typ {0} bearbeiten", Server.HtmlDecode(gvTypes.SelectedRow.Cells[0].Text));
        mvContent.ActiveViewIndex = 1;
        SetContent(Guid.Parse(gvTypes.SelectedRow.Cells[3].Text), Server.HtmlDecode(gvTypes.SelectedRow.Cells[0].Text), Server.HtmlDecode(gvTypes.SelectedRow.Cells[1].Text));
    }

    protected void mvContent_ActiveViewChanged(object sender, EventArgs e)
    {
        if (mvContent.ActiveViewIndex > 0)
        {
            btnCreate.Visible = false;
            btnEdit.Visible = false;
            btnDelete.Visible = false;
        }
    }

    protected void btnAddAttributeGroup_Click(object sender, EventArgs e)
    {
        Guid itemType = Guid.Parse(gvTypes.SelectedRow.Cells[3].Text),
            groupId = Guid.Parse(lstUnassignedAttributeGroups.SelectedValue);
        ItemTypeAttributeGroupMapping igm = new ItemTypeAttributeGroupMapping() { GroupId = groupId, ItemTypeId = itemType };
        try
        {
            MetaDataHandler.CreateItemTypeAttributeGroupMapping(igm, Request.LogonUserIdentity);
            gvTypes_SelectedIndexChanged(sender, e);
        }
        catch (Exception ex)
        {
            lblLocalError.Text = ex.Message;
            lblLocalError.Visible = true;
        }
    }

    protected void btnDeleteMapping_Click(object sender, EventArgs e)
    {
        ItemTypeAttributeGroupMapping igm = new ItemTypeAttributeGroupMapping()
        {
            GroupId = Guid.Parse((sender as ImageButton).CommandArgument),
            ItemTypeId = Guid.Parse(gvTypes.SelectedDataKey.Value.ToString())
        };
        MetaDataHandler.DeleteItemTypeAttributeGroupMapping(igm, Request.LogonUserIdentity);
        gvTypes_SelectedIndexChanged(sender, e);
    }
}