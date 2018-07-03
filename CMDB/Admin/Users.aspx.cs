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
            foreach (UserRoleMapping urm in SecurityHandler.GetRoles().OrderBy(u => u.Username))
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
        }
        else
        {
            ADSHelper.UserObject user = ADSHelper.GetUserProperties(ADSHelper.GetSIDFromUserName(lstUsers.SelectedValue));
            btnDelete.Enabled = true;
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