using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        this.Title = "CMDB durchsuchen";
        (Master as CMDB).IsButtonCreateVisible = true;
        if (!IsPostBack)
        {
            DataBind();
        }
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (!ucFilter.Visible)
            {
                ErrorLabel.Text = "Es gibt noch keine Objekttypen. Führen Sie bitte zuerst die Administration durch.";
                ErrorLabel.Visible = true;
                btnSearch.Visible = false;
                return;
            }
        }
    }

    protected void btnSearch_Click(object sender, EventArgs e)
    {
        lvSearchResults.Items.Clear();
        cblSearchResults.Items.Clear();
        mvResults.ActiveViewIndex = 0;
        ErrorLabel.Text = "";
        IEnumerable<CmdbAPI.DataObjects.ConfigurationItemExtender> items;
        if (ucFilter.Search == null) // keine weiteren Filter
        {
            ErrorLabel.Text = "Es wurden keinerlei Filter angegeben.";
            ErrorLabel.Visible = true;
            return;
        }
        Search search = ucFilter.Search;
        items = SearchItems.Search(search);


        // Ergebnis-Liste sortiert ausgeben
        List<string> ids = new List<string>(items.Count());
        foreach (CmdbAPI.DataObjects.ConfigurationItemExtender item in items)
        {
            lvSearchResults.Items.Add(new ListItem(item.FullName, string.Format("~/ShowItem.aspx?id={0}", item.ConfigurationItem.ItemId)));
            cblSearchResults.Items.Add(new ListItem(item.ConfigurationItem.ItemName, item.ConfigurationItem.ItemId.ToString())
            {
                Selected = SecurityHandler.UserIsResponsible(item.ConfigurationItem.ItemId, Request.LogonUserIdentity.Name)
            });
            ids.Add(item.ConfigurationItem.ItemId.ToString());
        }
        if (lvSearchResults.Items.Count > 0) //Falls Ergebnisse vorhanden sind, anzeigen und für Mehrfacheditieren vorbereiten
        {
            lvSearchResults.Visible = true;
            lnkExportToExcel.Visible = true;
            lnkExportToCsv.Visible = true;
            ViewState.Add("Scope", string.Join(",", ids.ToArray()));
            btnShowMultiEdit.Visible = ucFilter.IsSearchItemTypeChecked && lvSearchResults.Items.Count > 1 && ((CMDB)this.Master).UserCanEdit;
            ShowAdditionalAttributesOrConnections();
        }
        else
        {
            ErrorLabel.Text = "Keine Configuration Items gefunden, die mit Ihren Suchkriterien übereinstimmen.";
            lnkExportToExcel.Visible = false;
            lnkExportToCsv.Visible = false;
            btnShowMultiEdit.Visible = false;
            lstShowAdditional.Visible = false;
        }
    }

    private void ShowAdditionalAttributesOrConnections()
    {
        lstShowAdditional.Items.Clear();
        lstShowAdditional.Visible = false;
        if (!ucFilter.IsSearchItemTypeChecked)
            return;
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

    private bool isConnectionCountCorrect(IEnumerable<Connection> connections, string selectedValue)
    {
        switch (selectedValue)
        {
            case "0":
            case "1":
                return connections.Count() == int.Parse(selectedValue);
            case "1+":
                return connections.Count() > 0;
            case "2+":
                return connections.Count() > 1;
            default:
                return false;
        }
    }

    protected void lnkExportToExcel_Click(object sender, EventArgs e)
    {
        Session.Add("scope", ViewState["Scope"].ToString());
        Response.Redirect("~/Export.aspx?app=excel", true);

    }

    protected void lnkExportToCsv_Click(object sender, EventArgs e)
    {
        Session.Add("scope", ViewState["Scope"].ToString());
        Response.Redirect("~/Export.aspx?app=csv", true);
    }

    protected void btnShowMultiEdit_Click(object sender, EventArgs e)
    {
        mvResults.ActiveViewIndex = 1;
    }

    protected void btnMultiEdit_Click(object sender, EventArgs e)
    {
        // Wenn mehrerer Datensätze editieren werden, ausgewählte Datensätze in die Session packen und Seite wechseln
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
            ErrorLabel.Text = "Sie müssen mindestens zwei Items auswählen, die Sie gemeinsam editieren wollen";
            ErrorLabel.Visible = true;
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
                string value = "|" + (iar == null ? "" : iar.AttributeValue);
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
}