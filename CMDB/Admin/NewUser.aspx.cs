using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CmdbAPI.Security;

public partial class Admin_NewUser : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void txtSearch_TextChanged(object sender, EventArgs e)
    {
        if (txtSearch.Text.Trim().Length < 3)
            return;
        IEnumerable<ADSHelper.UserObject> users = ADSHelper.GetUsers(txtSearch.Text.Trim());
    }
}