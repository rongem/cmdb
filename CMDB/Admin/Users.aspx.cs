using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_Users : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            IEnumerable<UserRoleMapping> userRoles = SecurityHandler.GetRoles().OrderBy(u => u.Username);
            if (userRoles.Count() == 0)
            {
                divContent.Visible = false;
                lblLocalError.Text = "Es sind keine Benutzerkonten vorhanden. Bitte legen Sie neue an.";
                lblLocalError.Visible = true;
                return;
            }
            gvUsers.DataSource = userRoles;
            gvUsers.DataBind();
            gvUsers_SelectedIndexChanged(null, null);
        }
    }

    protected void btnDelete_Click(object sender, EventArgs e)
    {
        if (gvUsers.SelectedValue == null)
            return;
        UserRoleMapping userRoleMapping = SecurityHandler.GetRole(gvUsers.SelectedValue.ToString());
        if (userRoleMapping == null)
            return;
        SecurityHandler.RevokeRole(userRoleMapping, chkDeleteWithResponisbilities.Checked, Request.LogonUserIdentity);
        Response.Redirect("Users.aspx");
    }

    protected void gvUsers_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (gvUsers.SelectedIndex == -1) // Nichts ausgewählt
        {
            btnDelete.Enabled = false;
            lblSource.Text = string.Empty;
            lblUsername.Text = string.Empty;
            divUserDetails.Visible = false;
        }
        else
        {
            ADSHelper.UserObject user = ADSHelper.GetUserProperties(gvUsers.SelectedDataKey.Value.ToString());
            btnDelete.Enabled = true;
            divUserDetails.Visible = true;
            lblSource.CssClass = string.Empty;
            switch (user.Source)
            {
                case ADSHelper.UserObject.SourceType.Domain:
                    lblSource.Text = "Domäne";
                    chkDeleteWithResponisbilities.Enabled = true;
                    break;
                case ADSHelper.UserObject.SourceType.LocalMachine:
                    lblSource.Text = "Lokaler Computer";
                    chkDeleteWithResponisbilities.Enabled = true;
                    break;
                default:
                    lblSource.Text = "Unbekannt";
                    lblSource.CssClass = "errorlabel";
                    chkDeleteWithResponisbilities.Checked = true;
                    chkDeleteWithResponisbilities.Enabled = false;
                    break;
            }
            lblUsername.Text = user.displayname;
        }
    }
}