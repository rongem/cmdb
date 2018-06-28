using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CMDB : System.Web.UI.MasterPage
{
    private bool canEdit;

    public bool UserCanEdit { get { return canEdit; } }

    protected void Page_Load(object sender, EventArgs e)
    {
        btnCreateItem.Visible = canEdit && CmdbAPI.BusinessLogic.MetaDataHandler.GetItemTypesCount() > 0;
        lblIdentity.Text = string.Format("Angemeldet als: {0} ({1})", Request.LogonUserIdentity.Name, canEdit ? "Editor" : "Leser");
    }

    protected void Page_Init(object sender, EventArgs e)
    {
        this.canEdit = CmdbAPI.Security.SecurityHandler.UserIsInRole(Request.LogonUserIdentity, CmdbAPI.Security.UserRole.Editor);
    }

    protected void btnCreateItem_Click(object sender, EventArgs e)
    {
        Response.Redirect("CreateItem.aspx", true);
    }
}
