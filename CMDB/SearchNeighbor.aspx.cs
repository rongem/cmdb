using CmdbAPI.BusinessLogic;
using CmdbAPI.DataObjects;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class SearchNeighbor : System.Web.UI.Page
{
    private Guid itemId;
    private ConfigurationItem originItem;


    protected void Page_Load(object sender, EventArgs e)
    {
        // Überprüfen, ob eine gültige Id in der URL übergeben wurde
        string idQueryString = Request.QueryString["id"];
        if (string.IsNullOrWhiteSpace(idQueryString) || !Guid.TryParse(idQueryString, out itemId))
            Response.Redirect("~/Default.aspx", true);

        // Datensatz finden
        originItem = DataHandler.GetConfigurationItem(itemId);
        if (originItem == null)
            Response.Redirect("~/Default.aspx", true);

        lblOrigin.Text = string.Format("{0}: {1}", originItem.TypeName, originItem.ItemName);

        lblError.Text = string.Empty;

        if (!IsPostBack)
        {
            //lstTypeToSearch.DataSource = MetaDataHandler.GetItemTypes();
            //lstTypeToSearch.DataBind();
        }

    }
    protected void btnSearch_Click(object sender, EventArgs e)
    {
        int maxLevel;
        if (!int.TryParse(txtMaxLevels.Text, out maxLevel))
        {
            return; // Error
        }
        NeighborSearch n = new NeighborSearch()
        {
            ItemType = ucFilter.ItemTypeToSearch,
            SourceItem = itemId,
            MaxLevels = maxLevel,
            ExtraSearch = new Search()
            {
                ItemType = ucFilter.ItemTypeToSearch,
                Attributes = ucFilter.Search.Attributes,
                ConnectionsToLower = ucFilter.Search.ConnectionsToLower,
                ConnectionsToUpper = ucFilter.Search.ConnectionsToUpper,
                NameOrValue = ucFilter.Search.NameOrValue,
                ResponsibleToken = ucFilter.Search.ResponsibleToken,
            },
        };
        switch (lstDirection.SelectedValue)
        {
            case "up":
                n.SearchDirection = Direction.Upward;
                break;
            case "down":
                n.SearchDirection = Direction.Downward;
                break;
            case "both":
                n.SearchDirection = Direction.Both;
                break;
        }
        IEnumerable<NeighborItem> result = DataHandler.SearchNeighbors(n);

        lvSearchResults.Items.Clear();
        cblSearchResults.Items.Clear();
        mvResults.ActiveViewIndex = 0;
        if (result == null || result.Count() == 0)
        {
            lblError.Text = "Keine Items entsprechend Ihrer Suchkriterien gefunden. Bitte suchen Sie erneut.";
            lnkExportToExcel.Visible = false;
            lnkExportToCsv.Visible = false;
            btnShowMultiEdit.Visible = false;
            lstShowAdditional.Visible = false;
        }
        else
        {
            List<string> ids = new List<string>(result.Count());
            foreach (NeighborItem i in result.OrderBy(a => a.Item.ItemName))
            {
                lvSearchResults.Items.Add(new ListItem(string.Format("{0}: {1} ({2} Verbindungen)", i.Item.TypeName, i.Item.ItemName, i.Level),
                    string.Format("~/ShowItem.aspx?id={0}", i.Item.ItemId)));
                cblSearchResults.Items.Add(new ListItem(i.Item.ItemName, i.Item.ItemId.ToString())
                {
                    Selected = SecurityHandler.UserIsResponsible(i.Item.ItemId, Request.LogonUserIdentity.Name)
                });
                ids.Add(i.Item.ItemId.ToString());
            }
            lvSearchResults.Visible = true;
            lnkExportToExcel.Visible = true;
            lnkExportToCsv.Visible = true;
            ViewState.Add("Scope", string.Join(",", ids.ToArray()));
            if (cblSearchResults.Items.Count > 1)
            {
                btnShowMultiEdit.Visible = ((CMDB)this.Master).UserCanEdit;
                ShowAdditionalAttributesOrConnections();
            }
        }
    }


    protected void lnkExportToExcel_Click(object sender, EventArgs e)
    {
        Session.Add("scope", ViewState["Scope"].ToString());
        Response.Redirect(VirtualPathUtility.ToAbsolute("~/Export.aspx?app=excel"), true);

    }

    protected void lnkExportToCsv_Click(object sender, EventArgs e)
    {
        Session.Add("scope", ViewState["Scope"].ToString());
        Response.Redirect(VirtualPathUtility.ToAbsolute("~/Export.aspx?app=csv"), true);
    }

    protected void btnShowMultiEdit_Click(object sender, EventArgs e)
    {
        mvResults.ActiveViewIndex = 1;
    }

    protected void btnMultiEdit_Click(object sender, EventArgs e)
    {
        List<Guid> ids = new List<Guid>();
        for (int i = 0; i < cblSearchResults.Items.Count; i++)
        {
            if (cblSearchResults.Items[i].Selected)
                ids.Add(Guid.Parse(cblSearchResults.Items[i].Value));
        }
        if (ids.Count > 1)
        {
            Session.Add("scope", ids);
            Response.Redirect("~/EditMultipleItems.aspx", true);
        }
        else
        {
            lblError.Text = "Sie müssen mindestens zwei Items auswählen, die Sie gemeinsam editieren wollen";
            lblError.Visible = true;
        }
    }

    protected void lstSelectItems_SelectedIndexChanged(object sender, EventArgs e)
    {
        for (int i = 0; i < cblSearchResults.Items.Count; i++)
        {
            switch (lstSelectItems.SelectedValue)
            {
                case "all":
                    cblSearchResults.Items[i].Selected = true;
                    break;
                case "none":
                    cblSearchResults.Items[i].Selected = false;
                    break;
                case "owned":
                    cblSearchResults.Items[i].Selected = SecurityHandler.UserIsResponsible(Guid.Parse(cblSearchResults.Items[i].Value), Request.LogonUserIdentity.Name);
                    break;
                case "unowned":
                    cblSearchResults.Items[i].Selected = SecurityHandler.UserIsResponsible(Guid.Parse(cblSearchResults.Items[i].Value), Request.LogonUserIdentity.Name);
                    break;
                default:
                    break;
            }

        }
        lstSelectItems.SelectedIndex = 0;
    }
    protected void lstShowAdditional_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (lstShowAdditional.SelectedValue.StartsWith("a:")) // Attribut hinzufügen
        {
            Guid attTypeId = Guid.Parse(lstShowAdditional.SelectedValue.Substring(2));
            for (int i = 0; i < cblSearchResults.Items.Count; i++)
            {
                Guid itemId = Guid.Parse(cblSearchResults.Items[i].Value);
                ItemAttribute iar = DataHandler.GetAttributeForConfigurationItemByAttributeType(itemId, attTypeId);
                string value = "|" + iar == null ? "" : iar.AttributeValue;
                cblSearchResults.Items[i].Text += value;
                lvSearchResults.Items[i].Text += value;
            }
        }
        else if (lstShowAdditional.SelectedValue.StartsWith("cl:")) // Verbindung abwärts hinzufügen
        {
            ConnectionRule crr = MetaDataHandler.GetConnectionRule(Guid.Parse(lstShowAdditional.SelectedValue.Substring(3)));

            for (int i = 0; i < cblSearchResults.Items.Count; i++)
            {
                Guid itemId = Guid.Parse(cblSearchResults.Items[i].Value);
                List<string> values = new List<string>();
                int ctr = 0;
                foreach (Connection cr in DataHandler.GetConnectionsToLowerForItemAndRule(itemId, crr.RuleId))
                {
                    if (ctr++ > 2) // abbrechen, wenn mehr als 2 Items gefunden wurden.
                    {
                        values.Add("...");
                        break;
                    }
                    values.Add(DataHandler.GetConfigurationItem(cr.ConnLowerItem).ItemName);
                }
                string value = string.Format("|({0} {1}: {2})", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName, MetaDataHandler.GetItemType(crr.ItemLowerType).TypeName, string.Join(", ", values.ToArray()));
                cblSearchResults.Items[i].Text += value;
                lvSearchResults.Items[i].Text += value;
            }
        }
        else if (lstShowAdditional.SelectedValue.StartsWith("cu:")) // Verbindung aufwärts hinzufügen
        {
            ConnectionRule crr = MetaDataHandler.GetConnectionRule(Guid.Parse(lstShowAdditional.SelectedValue.Substring(3)));

            for (int i = 0; i < cblSearchResults.Items.Count; i++)
            {
                Guid itemId = Guid.Parse(cblSearchResults.Items[i].Value);
                List<string> values = new List<string>();
                int ctr = 0;
                foreach (Connection cr in DataHandler.GetConnectionsToUpperForItemAndRule(itemId, crr.RuleId))
                {
                    if (ctr++ > 2) // abbrechen, wenn mehr als 2 Items gefunden wurden.
                    {
                        values.Add("...");
                        break;
                    }
                    values.Add(DataHandler.GetConfigurationItem(cr.ConnUpperItem).ItemName);
                }
                string value = string.Format("|({0} {1}: {2})", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeReverseName, MetaDataHandler.GetItemType(crr.ItemUpperType).TypeName, string.Join(", ", values.ToArray()));
                cblSearchResults.Items[i].Text += value;
                lvSearchResults.Items[i].Text += value;
            }
        }
        lstShowAdditional.Items.RemoveAt(lstShowAdditional.SelectedIndex);
        lstShowAdditional.SelectedIndex = 0;
    }

    private void ShowAdditionalAttributesOrConnections()
    {
        lstShowAdditional.Items.Clear();
        lstShowAdditional.Visible = false;
        System.Data.DataTable t = new System.Data.DataTable();
        t.Columns.Add("ID");
        t.Columns.Add("Text");
        t.Rows.Add("null", "(zusätzliche Information anzeigen)");

        Guid itemType = ucFilter.ItemTypeToSearch;
        foreach (AttributeType air in MetaDataHandler.GetAllowedAttributeTypesForItemType(itemType))
        {
            t.Rows.Add(string.Format("a:{0}", air.TypeId), string.Format("Attribut: {0}", air.TypeName));
        }

        foreach (ConnectionRule crr in MetaDataHandler.GetConnectionRulesForItemType(itemType))
        {
            if (crr.ItemUpperType.Equals(itemType) && crr.MaxConnectionsToLower < 3)
            {
                t.Rows.Add(string.Format("cl:{0}", crr.RuleId), string.Format("Verbindung abwärts {0} {1}", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName, MetaDataHandler.GetItemType(crr.ItemLowerType).TypeName));
            }
            else if (crr.ItemLowerType.Equals(itemType) && crr.MaxConnectionsToUpper < 3)
            {
                t.Rows.Add(string.Format("cu:{0}", crr.RuleId), string.Format("Verbindung aufwärts {0} {1}", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeReverseName, MetaDataHandler.GetItemType(crr.ItemUpperType).TypeName));
            }
        }

        lstShowAdditional.DataSource = t;
        lstShowAdditional.DataBind();
        lstShowAdditional.Visible = lstShowAdditional.Items.Count > 1;
    }

}