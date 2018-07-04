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
            foreach (UserRoleMapping urm in userRoles)
            {
                // Gruppen werden mit vorangestelltem Stern dargestellt
                lstUsers.Items.Add(new ListItem(string.Format("{0}{1} ({2})",
                    urm.IsGroup ? "*" : "", urm.Username, urm.Role), urm.Username));
            }
            lstUsers_SelectedIndexChanged(null, null);
        }
    }

    protected void lstUsers_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (lstUsers.SelectedIndex == -1) // Nichts ausgewählt
        {
            btnDelete.Enabled = false;
            lblGroupOrUser.Text = string.Empty;
            lblSource.Text = string.Empty;
            lblUsername.Text = string.Empty;
            divUserDetails.Visible = false;
        }
        else
        {
            ADSHelper.UserObject user = ADSHelper.GetUserProperties(lstUsers.SelectedValue);
            btnDelete.Enabled = true;
            divUserDetails.Visible = true;
            lblGroupOrUser.Text = lstUsers.SelectedItem.Text.StartsWith("*") ? "Gruppe" : "Benutzer";
            switch (user.Source)
            {
                case ADSHelper.UserObject.SourceType.Domain:
                    lblSource.Text = "Domäne";
                    break;
                case ADSHelper.UserObject.SourceType.LocalMachine:
                    lblSource.Text = "Lokaler Computer";
                    break;
                default:
                    lblSource.Text = "Unbekannt";
                    break;
            }
            lblUsername.Text = user.displayname;
        }
    }

    protected void btnDelete_Click(object sender, EventArgs e)
    {

    }
}