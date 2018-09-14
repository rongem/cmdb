﻿using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_AttributeGroups : System.Web.UI.Page
{
    private bool listIsEmpty = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        lblLocalError.Visible = false;
        if (!IsPostBack)
        {
            IEnumerable<AttributeGroup> attributeGroups = MetaDataHandler.GetAttributeGroups();
            if (attributeGroups.Count() == 0)
            {
                listIsEmpty = true;
                ucInput.SetContent(Guid.NewGuid(), string.Empty);
                mvContent.ActiveViewIndex = 1;
                lblLocalError.Text = "Es sind keine Attributgruppen vorhanden. Bitte legen Sie neue an.";
                lblLocalError.Visible = true;
                return;
            }
            gvTypes.DataSource = attributeGroups;
            gvTypes.DataBind();
            gvTypes_SelectedIndexChanged(null, null);
        }
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
            AttributeGroup attributeGroup = MetaDataHandler.GetAttributeGroup(Guid.Parse(gvTypes.SelectedRow.Cells[2].Text));
            btnEdit.Visible = true;
            btnDelete.Visible = MetaDataHandler.CanDeleteAttributeGroup(attributeGroup.GroupId);
            divAssociations.Visible = true;
            IEnumerable<AttributeType> assignedAttributeTypes = MetaDataHandler.GetAttributeTypesForAttributeGroup(attributeGroup),
                unassignedAttributeTypes = MetaDataHandler.GetAttributeTypesWithoutGroup();
            if (assignedAttributeTypes.Count() == 0 && unassignedAttributeTypes.Count() == 0)
            {
                divAssociations.Visible = false;
                return;
            }
            gvAssociations.DataSource = assignedAttributeTypes;
            gvAssociations.DataBind();
            if (unassignedAttributeTypes.Count() == 0)
            {
                divAddType.Visible = false;
            }
            else
            {
                divAddType.Visible = true;
                lstUnassignedAttributeTypes.DataSource = unassignedAttributeTypes;
                lstUnassignedAttributeTypes.DataBind();
            }
        }
    }

    protected void ucInput_Save(object sender, EventArgs e)
    {
        Guid guid;
        string name;
        ucInput.GetContent(out guid, out name);
        AttributeGroup attGroup = MetaDataHandler.GetAttributeGroup(guid);
        if (attGroup == null) // erstellen
        {
            attGroup = new AttributeGroup() { GroupId = guid, GroupName = name };
            try
            {
                MetaDataHandler.CreateAttributeGroup(attGroup, Request.LogonUserIdentity);
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
            attGroup.GroupName = name;
            try
            {
                MetaDataHandler.UpdateAttributeGroup(attGroup, Request.LogonUserIdentity);
                ReloadPage();
            }
            catch (Exception ex)
            {
                lblLocalError.Visible = true;
                lblLocalError.Text = ex.Message;
            }
        }
    }

    private void ReloadPage()
    {
        Response.Redirect("AttributeGroups.aspx", true);
    }

    protected void ucInput_Cancel(object sender, EventArgs e)
    {
        if (!listIsEmpty)
            mvContent.ActiveViewIndex = 0;
        btnCreate.Visible = true;
        gvTypes_SelectedIndexChanged(sender, e);
    }


    protected void btnDelete_Click(object sender, EventArgs e)
    {
        AttributeGroup attributeGroup = MetaDataHandler.GetAttributeGroup(Guid.Parse(gvTypes.SelectedRow.Cells[2].Text));
        if (attributeGroup == null)
        {
            lblLocalError.Text = "Attributgruppe nicht gefunden";
            lblLocalError.Visible = true;
            return;
        }
        try
        {
            MetaDataHandler.DeleteAttributeGroup(attributeGroup, Request.LogonUserIdentity);
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
        lblEditCaption.Text = "Neue Attributgruppe anlegen";
        mvContent.ActiveViewIndex = 1;
        ucInput.SetContent(Guid.NewGuid(), string.Empty);
    }

    protected void btnEdit_Click(object sender, EventArgs e)
    {
        lblEditCaption.Text = string.Format("Attributgruppe {0} bearbeiten", Server.HtmlDecode(gvTypes.SelectedRow.Cells[0].Text));
        mvContent.ActiveViewIndex = 1;
        ucInput.SetContent(Guid.Parse(gvTypes.SelectedRow.Cells[2].Text), Server.HtmlDecode(gvTypes.SelectedRow.Cells[0].Text));
    }

    protected void mvContent_ActiveViewChanged(object sender, EventArgs e)
    {
        if (mvContent.ActiveViewIndex > 0)
        {
            btnCreate.Visible = false;
            btnDelete.Visible = false;
            btnEdit.Visible = false;
        }
    }

    protected void gvAssociations_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Delete"))
        {
            int rowId = int.Parse(e.CommandArgument.ToString());
            Guid attributeTypeId = (Guid)gvAssociations.DataKeys[rowId].Value;
            lblAssociation.Text = gvAssociations.Rows[rowId].Cells[0].Text;
            lblCount.Text = MetaDataHandler.GetItemAttributesCountForAttributeType(attributeTypeId).ToString();
            IdToDelete.Value = attributeTypeId.ToString();
            mvContent.ActiveViewIndex = 2;
            e.Handled = true;
        }
    }

    protected void btnAddAttributeType_Click(object sender, EventArgs e)
    {
        GroupAttributeTypeMapping gam = new GroupAttributeTypeMapping()
        {
            AttributeTypeId = Guid.Parse(lstUnassignedAttributeTypes.SelectedValue),
            GroupId = Guid.Parse(gvTypes.SelectedRow.Cells[2].Text),
        };
        try
        {
            MetaDataHandler.CreateGroupAttributeTypeMapping(gam, Request.LogonUserIdentity);
            gvTypes_SelectedIndexChanged(sender, e);
        }
        catch (Exception ex)
        {
            lblLocalError.Text = ex.Message;
            lblLocalError.Visible = true;
        }
    }

    protected void btnConfirmDelete_Click(object sender, EventArgs e)
    {
        try
        {
            Guid attributTypeId = Guid.Parse(IdToDelete.Value);
            GroupAttributeTypeMapping gam = MetaDataHandler.GetGroupAttributeTypeMapping(attributTypeId);
            MetaDataHandler.DeleteGroupAttributeTypeMapping(gam, Request.LogonUserIdentity);
            ReloadPage();
        }
        catch (Exception ex)
        {
            lblLocalError.Text = ex.Message;
            lblLocalError.Visible = true;
        }
    }

    protected void btnCancelDelete_Click(object sender, EventArgs e)
    {
        ReloadPage();
    }

    protected void btnMoveAttributeTypeToAnotherGroup_Click(object sender, EventArgs e)
    {
        AttributeType attributeType = MetaDataHandler.GetAttributeType(Guid.Parse((sender as ImageButton).CommandArgument));
        lblAttributTypeToMove.Text = attributeType.TypeName;
        lstGroupToMoveTo.DataSource = MetaDataHandler.GetAttributeGroups().Where(ag => ag.GroupId != MetaDataHandler.GetGroupAttributeTypeMapping(attributeType.TypeId).GroupId);
        lstGroupToMoveTo.DataBind();
        mvContent.ActiveViewIndex = 3;
        txtAttributTypeId.Value = attributeType.TypeId.ToString();
        lstGroupToMoveTo_SelectedIndexChanged(sender, e);
    }

    protected void btnConfirmMove_Click(object sender, EventArgs e)
    {
        AttributeType attributeType = MetaDataHandler.GetAttributeType(Guid.Parse(txtAttributTypeId.Value));
        AttributeGroup attributeGroupNew = MetaDataHandler.GetAttributeGroup(Guid.Parse(lstGroupToMoveTo.SelectedValue));
        ItemTypeAttributeGroupMapping itemTypeAttributeGroupMapping = new ItemTypeAttributeGroupMapping() { GroupId = attributeGroupNew.GroupId };
        try
        {
            foreach (ItemType itemType in MetaDataHandler.GetItemTypesByAttributeTypeToMoveAndTargetGroup(attributeType.TypeId, attributeGroupNew.GroupId))
            {
                itemTypeAttributeGroupMapping.ItemTypeId = itemType.TypeId;
                MetaDataHandler.CreateItemTypeAttributeGroupMapping(itemTypeAttributeGroupMapping, Request.LogonUserIdentity);
            }
            GroupAttributeTypeMapping gam = MetaDataHandler.GetGroupAttributeTypeMapping(attributeType.TypeId);
            MetaDataHandler.UpdateGroupAttributeTypeMapping(gam, attributeGroupNew.GroupId, Request.LogonUserIdentity);
            mvContent.ActiveViewIndex = 0;
            gvTypes_SelectedIndexChanged(sender, e);
        }
        catch (Exception ex)
        {
            lblLocalError.Text = ex.Message;
            lblLocalError.Visible = true;
        }
    }

    protected void btnCancelMove_Click(object sender, EventArgs e)
    {
        mvContent.ActiveViewIndex = 0;
    }

    protected void lstGroupToMoveTo_SelectedIndexChanged(object sender, EventArgs e)
    {
        AttributeType attributeType = MetaDataHandler.GetAttributeType(Guid.Parse(txtAttributTypeId.Value));
        AttributeGroup attributeGroupNew = MetaDataHandler.GetAttributeGroup(Guid.Parse(lstGroupToMoveTo.SelectedValue));
        lstChangedItemTypes.Items.Clear();
        foreach (ItemType itemType in MetaDataHandler.GetItemTypesByAttributeTypeToMoveAndTargetGroup(attributeType.TypeId, attributeGroupNew.GroupId))
        {
            lstChangedItemTypes.Items.Add(new ListItem() { Text = itemType.TypeName, Value = string.Empty });
        }
        spanItemTypesToChange.Visible = lstChangedItemTypes.Items.Count > 0;
    }
}