using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_Admin : System.Web.UI.MasterPage
{
    protected void Page_Init(object sender, EventArgs e)
    {
        if (!(Master as CMDB).UserIsAdmin)
            Response.Redirect("~/Default.aspx");
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        (Master as CMDB).IsButtonCreateVisible = false;
    }
}
