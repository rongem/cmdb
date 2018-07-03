using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CMDB : System.Web.UI.MasterPage
{
    /// <summary>
    /// Gibt an, ob der Benutzer Daten bearbeiten kann
    /// </summary>
    public bool UserCanEdit { get; private set; }

    /// <summary>
    /// Gibt an, ob der Benutzer Administrator ist
    /// </summary>
    public bool UserIsAdmin { get; private set; }

    /// <summary>
    /// Stellt die Sichtbarkeit der Erzeugung neuer Items bereit
    /// </summary>
    public bool IsButtonCreateVisible { get; set; }

    protected void Page_Load(object sender, EventArgs e)
    {
        btnCreateItem.Visible = IsButtonCreateVisible && UserCanEdit && CmdbAPI.BusinessLogic.MetaDataHandler.GetItemTypesCount() > 0;
        lblIdentity.Text = string.Format("Angemeldet als: {0} ({1})", Request.LogonUserIdentity.Name, UserIsAdmin ? "Administrator" : UserCanEdit ? "Editor" : "Leser");
    }

    protected void Page_Init(object sender, EventArgs e)
    {
        UserCanEdit = CmdbAPI.Security.SecurityHandler.UserIsInRole(Request.LogonUserIdentity, CmdbAPI.Security.UserRole.Editor);
        UserIsAdmin = CmdbAPI.Security.SecurityHandler.UserIsInRole(Request.LogonUserIdentity, CmdbAPI.Security.UserRole.Administrator);
    }

    protected void btnCreateItem_Click(object sender, EventArgs e)
    {
        Response.Redirect("~/CreateItem.aspx", true);
    }
}
