using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ShowHistory : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string idQueryString = Request.QueryString["id"];
        Guid id = new Guid();
        if (string.IsNullOrWhiteSpace(idQueryString) || !Guid.TryParse(idQueryString, out id))
            Response.Redirect("~/Default.aspx", true);

        (Master as CMDB).IsButtonCreateVisible = true;

        ConfigurationItem item = DataHandler.GetConfigurationItem(id);
        if (item == null)
            Response.Redirect("~/Default.aspx", true);

        lblName.Text = string.Format("{0}: {1}", item.TypeName, item.ItemName);

        this.Title = string.Format("Veränderungen an {0}: {1} anzeigen", item.TypeName, item.ItemName);


    }
}