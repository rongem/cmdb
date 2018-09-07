using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_AttributeTypes : System.Web.UI.Page
{
    private bool listIsEmpty = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        lblLocalError.Visible = false;
        if(!IsPostBack)
        {
            IEnumerable<AttributeType> attributeTypes = MetaDataHandler.GetAttributeTypes();
            if (attributeTypes.Count() == 0)
            {
                listIsEmpty = true;
                ucInput.SetContent(Guid.NewGuid(), string.Empty);
                mvContent.ActiveViewIndex = 1;
                lblLocalError.Text = "Es sind keine Attribut-Typen vorhanden. Bitte legen Sie neue an.";
                lblLocalError.Visible = true;
                return;
            }
            gvTypes.DataSource = attributeTypes;
            gvTypes.DataBind();
            gvTypes_SelectedIndexChanged(null, null);
        }
    }

    protected void gvTypes_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (gvTypes.SelectedRow == null)
        {
            btnEdit.Visible = false;
            btnConvert.Visible = false;
            btnDelete.Visible = false;
        }
        else
        {
            btnEdit.Visible = true;
            btnConvert.Visible = true;
            btnDelete.Visible = MetaDataHandler.CanDeleteAttributeType(Guid.Parse(gvTypes.SelectedRow.Cells[2].Text));
        }
    }

    protected void ucInput_Save(object sender, EventArgs e)
    {
        Guid guid;
        string name;
        ucInput.GetContent(out guid, out name);
        AttributeType attType = MetaDataHandler.GetAttributeType(guid);
        if (attType == null) // erstellen
        {
            attType = new AttributeType() { TypeId = guid, TypeName = name };
            try
            {
                MetaDataHandler.CreateAttributeType(attType, Request.LogonUserIdentity);
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
            attType.TypeName = name;
            try
            {
                MetaDataHandler.UpdateAttributeType(attType, Request.LogonUserIdentity);
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
        Response.Redirect("AttributeTypes.aspx", true);
    }

    protected void ucInput_Cancel(object sender, EventArgs e)
    {
        if (!listIsEmpty)
        {
            mvContent.ActiveViewIndex = 0;
            btnCreate.Visible = true;
            gvTypes_SelectedIndexChanged(sender, e);
        }
    }


    protected void btnDelete_Click(object sender, EventArgs e)
    {
        AttributeType attributeType = MetaDataHandler.GetAttributeType(Guid.Parse(gvTypes.SelectedRow.Cells[2].Text));
        if (attributeType == null)
        {
            lblLocalError.Text = "Attribut-Typ nicht gefunden";
            lblLocalError.Visible = true;
            return;
        }
        try
        {
            MetaDataHandler.DeleteAttributeType(attributeType, Request.LogonUserIdentity);
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
        lblEditCaption.Text = "Neuen Attribut-Typ anlegen";
        mvContent.ActiveViewIndex = 1;
        ucInput.SetContent(Guid.NewGuid(), string.Empty);
    }

    protected void btnEdit_Click(object sender, EventArgs e)
    {
        lblEditCaption.Text = string.Format("Attribut-Typ {0} bearbeiten", gvTypes.SelectedRow.Cells[0].Text);
        mvContent.ActiveViewIndex = 1;
        ucInput.SetContent(Guid.Parse(gvTypes.SelectedRow.Cells[2].Text), gvTypes.SelectedRow.Cells[0].Text);
    }

    protected void mvContent_ActiveViewChanged(object sender, EventArgs e)
    {
        if (mvContent.ActiveViewIndex > 0)
        {
            btnCreate.Visible = false;
            btnEdit.Visible = false;
            btnConvert.Visible = false;
            btnDelete.Visible = false;
        }
    }

    protected void btnConvert_Click(object sender, EventArgs e)
    {
        Response.Redirect(string.Format("~/Admin/ConvertAttributeToItem.aspx?ID={0}", gvTypes.SelectedRow.Cells[2].Text), true);
    }
}