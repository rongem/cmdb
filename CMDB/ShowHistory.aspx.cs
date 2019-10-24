using CmdbAPI.BusinessLogic;
using CmdbAPI.DataObjects;
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

        IEnumerable<HistoryEntry> historyEntries = HistoryHandler.GetAllHistoryEntriesForItem(id);

        ConfigurationItem item = DataHandler.GetConfigurationItem(id);
        if (item == null && historyEntries.Count() == 0)
            Response.Redirect("~/Default.aspx", true);

        if (item == null)
        {
            lblName.Text = historyEntries.Last().Subject;
            Title = string.Format("Veränderungen an {0} anzeigen", historyEntries.Last().Subject);
        }
        else
        {
            lblName.Text = string.Format("{0}: {1}", item.TypeName, item.ItemName);
            Title = string.Format("Veränderungen an {0}: {1} anzeigen", item.TypeName, item.ItemName);
        }
        rpHistory.DataSource = historyEntries;
        rpHistory.DataBind();
    }
}