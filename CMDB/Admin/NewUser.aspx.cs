using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;

public partial class Admin_NewUser : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnSearchUser_Click(object sender, EventArgs e)
    {
        if (txtSearch.Text.Trim().Length < 3)
            return;
        List<ADSHelper.UserObject> users = new List<ADSHelper.UserObject>(ADSHelper.GetUsers(txtSearch.Text.Trim()));
        foreach (ADSHelper.UserObject user in users.ToArray()) // Vorhandene Accounts herausfiltern
        {
            if (SecurityHandler.UserTokenExists(user.NTAccount.Value))
                users.Remove(user);
        }
        if (users.Count == 0)
            lblError.Text = "Keine Benutzer gefunden, die mit diesem Text anfangen";
        lstUsers.DataSource = users;
        lstUsers.DataBind();
        lstRoles.Enabled = false;
        btnCreate.Visible = false;
    }

    protected void lstUsers_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (lstUsers.SelectedIndex == -1)
            return;
        if (SecurityHandler.IsNoAdminPresent())
        {
            lstRoles.SelectedIndex = 2;
            lstRoles.Enabled = false;
        }
        else
            lstRoles.Enabled = true;
        btnCreate.Visible = true;
    }

    protected void btnCreate_Click(object sender, EventArgs e)
    {
        UserRoleMapping userRoleMapping = new UserRoleMapping()
        {
            Role = (UserRole)int.Parse(lstRoles.SelectedValue),
            Username = lstUsers.SelectedValue,
            IsGroup = false,
        };
        SecurityHandler.GrantRole(userRoleMapping, Request.LogonUserIdentity);
    }
}