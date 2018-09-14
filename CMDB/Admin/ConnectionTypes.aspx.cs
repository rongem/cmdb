using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_ConnectionTypes : System.Web.UI.Page
{
    private bool listIsEmpty = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        lblLocalError.Visible = false;
        if (!IsPostBack)
        {
            IEnumerable<ConnectionType> connectionTypes = MetaDataHandler.GetConnectionTypes();
            if (connectionTypes.Count() == 0)
            {
                listIsEmpty = true;
                SetContent(Guid.NewGuid(), string.Empty, string.Empty);
                mvContent.ActiveViewIndex = 1;
                lblLocalError.Text = "Es sind keine Verbindungstypen vorhanden. Bitte legen Sie neue an.";
                lblLocalError.Visible = true;
                return;
            }
            gvTypes.DataSource = connectionTypes;
            gvTypes.DataBind();
            gvTypes_SelectedIndexChanged(null, null);
        }
    }

    /// <summary>
    /// Setzt die Textfelder für die Eingabemaske
    /// </summary>
    /// <param name="guid">Guid</param>
    /// <param name="name">Name der Verbindung</param>
    /// <param name="reverseName">Rückwärts-Name der Verbindung</param>
    private void SetContent(Guid guid, string name, string reverseName)
    {
        txtId.Text = guid.ToString();
        txtName.Text = name;
        txtReverseName.Text = reverseName;
    }

    protected void gvTypes_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (gvTypes.SelectedRow == null)
        {
            btnEdit.Visible = false;
            btnDelete.Visible = false;
        }
        else
        {
            btnEdit.Visible = true;
            btnDelete.Visible = MetaDataHandler.CanDeleteConnectionType(Guid.Parse(gvTypes.SelectedRow.Cells[3].Text));
        }
    }

    protected void btnOK_Click(object sender, EventArgs e)
    {
        txtName.Text = txtName.Text.Trim();
        txtReverseName.Text = txtReverseName.Text.Trim();
        if (string.IsNullOrEmpty(txtName.Text) || txtName.Text.Length < 2)
        {
            lblLocalError.Text = "Bitte geben Sie einen Namen ein";
            lblLocalError.Visible = true;
            txtName.Focus();
            return;
        }
        if (string.IsNullOrEmpty(txtReverseName.Text) || txtReverseName.Text.Length < 2)
        {
            lblLocalError.Text = "Bitte geben Sie einen Rückwärts-Namen ein";
            lblLocalError.Visible = true;
            txtReverseName.Focus();
            return;
        }
        Guid guid = Guid.Parse(txtId.Text);
        string name = txtName.Text,
            reverseName = txtReverseName.Text;
        ConnectionType connType = MetaDataHandler.GetConnectionType(guid);
        if (connType == null) // erstellen
        {
            connType = new ConnectionType() { ConnTypeId = guid, ConnTypeName = name, ConnTypeReverseName = reverseName };
            try
            {
                MetaDataHandler.CreateConnectionType(connType, Request.LogonUserIdentity);
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
            connType.ConnTypeName = name;
            connType.ConnTypeReverseName = reverseName;
            try
            {
                MetaDataHandler.UpdateConnectionType(connType, Request.LogonUserIdentity);
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
        Response.Redirect("ConnectionTypes.aspx", true);
    }

    protected void btnDelete_Click(object sender, EventArgs e)
    {
        ConnectionType connectionType = MetaDataHandler.GetConnectionType(Guid.Parse(gvTypes.SelectedRow.Cells[3].Text));
        if (connectionType == null)
        {
            lblLocalError.Text = "Verbindungstyp nicht gefunden";
            lblLocalError.Visible = true;
            return;
        }
        try
        {
            MetaDataHandler.DeleteConnectionType(connectionType, Request.LogonUserIdentity);
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
        lblEditCaption.Text = "Neuen Verbindungstyp anlegen";
        mvContent.ActiveViewIndex = 1;
        SetContent(Guid.NewGuid(), string.Empty, string.Empty);
    }

    protected void btnEdit_Click(object sender, EventArgs e)
    {
        lblEditCaption.Text = string.Format("Verbindungstyp {0} bearbeiten", Server.HtmlDecode(gvTypes.SelectedRow.Cells[0].Text));
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
}