using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_ConnectionRules : System.Web.UI.Page
{
    private const string showAll = "<alle anzeigen>";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            divAddRule.Visible = false;
            List<ItemType> itemTypes = new List<ItemType>();
            itemTypes.Add(new ItemType() { TypeId = Guid.Empty, TypeName = showAll });
            itemTypes.AddRange(MetaDataHandler.GetItemTypes());
            lstUpperItemType.DataSource = itemTypes;
            lstLowerItemType.DataSource = itemTypes;
            List<ConnectionType> connectionTypes = new List<ConnectionType>();
            connectionTypes.Add(new ConnectionType() { ConnTypeId = Guid.Empty, ConnTypeName = showAll, ConnTypeReverseName = showAll });
            connectionTypes.AddRange(MetaDataHandler.GetConnectionTypes());
            lstConnectionType.DataSource = connectionTypes;
            DataBind();
            lstFilter_SelectedIndexChanged(sender, e);
        }
    }

    protected void lstFilter_SelectedIndexChanged(object sender, EventArgs e)
    {
        // Filter anhand der ausgewählten Einträge erstellen
        Guid? itemUpperType = null, itemLowerType = null, connType = null;

        IEnumerable<ConnectionRule> rules = MetaDataHandler.GetConnectionRules();

        if (lstUpperItemType.SelectedIndex > 0)
            itemUpperType = Guid.Parse(lstUpperItemType.SelectedValue);
        if (lstLowerItemType.SelectedIndex > 0)
            itemLowerType = Guid.Parse(lstLowerItemType.SelectedValue);
        if (lstConnectionType.SelectedIndex > 0)
            connType = Guid.Parse(lstConnectionType.SelectedValue);

        gvRules.DataSource = MetaDataHandler.FilterConnectionRules(itemUpperType, connType, itemLowerType);
        gvRules.DataBind();

        btnAddRule.Visible = (lstUpperItemType.SelectedIndex > 0 && lstLowerItemType.SelectedIndex > 0 && lstConnectionType.SelectedIndex > 0 &&
            gvRules.Rows.Count == 0);
    }

    protected void btnDeleteRule_Click(object sender, ImageClickEventArgs e)
    {
        Guid guid = Guid.Parse((sender as ImageButton).CommandArgument);
        ConnectionRule cr = MetaDataHandler.GetConnectionRule(guid);
        MetaDataHandler.DeleteConnectionRule(cr, Request.LogonUserIdentity);
        for (int i = 0; i < gvRules.DataKeys.Count; i++)
        {
            if (gvRules.DataKeys[i].Value.ToString().Equals(guid.ToString()))
            {
                lstFilter_SelectedIndexChanged(sender, null);
                break;
            }
        }
    }

    protected void btnEditRule_Click(object sender, ImageClickEventArgs e)
    {
        // erst alle vorhandenen Editor-Zellen zurück auf Ansicht setzen
        foreach (MultiView multiView in GetAllControls(gvRules).OfType<MultiView>())
        {
            multiView.ActiveViewIndex = 0;
        }
        ChangeView(sender, 1);
    }

    private static void ChangeView(object sender, int activeViewIndex)
    {
        ((sender as Control).Parent.Parent as MultiView).ActiveViewIndex = activeViewIndex;
    }

    /// <summary>
    /// Liefert alle Kindelemente rekursiv zurück
    /// </summary>
    /// <param name="parent">Control, ab dem gesucht wird</param>
    /// <returns></returns>
    public static IEnumerable<Control> GetAllControls(Control parent)
    {
        foreach (Control control in parent.Controls)
        {
            yield return control;
            foreach (Control descendant in GetAllControls(control))
            {
                yield return descendant;
            }
        }
    }

    protected void btnSave_Click(object sender, EventArgs e)
    {
        Guid guid = Guid.Parse((sender as Button).CommandArgument);
        ConnectionRule connectionRule = MetaDataHandler.GetConnectionRule(guid);
        TextBox textBox = ((sender as Control).Parent as View).FindControl("txtToLower") as TextBox;
        int maxConnectionsToLower = int.Parse(textBox.Text);
        textBox = ((sender as Control).Parent as View).FindControl("txtToUpper") as TextBox;
        int maxConnectionsToUpper = int.Parse(textBox.Text);
        bool changed = false;
        if (connectionRule.MaxConnectionsToLower != maxConnectionsToLower)
        {
            changed = true;
            connectionRule.MaxConnectionsToLower = maxConnectionsToLower;
        }
        if (connectionRule.MaxConnectionsToUpper != maxConnectionsToUpper)
        {
            changed = true;
            connectionRule.MaxConnectionsToUpper = maxConnectionsToUpper;
        }
        if (changed)
            MetaDataHandler.UpdateConnectionRule(connectionRule, Request.LogonUserIdentity);
        lstFilter_SelectedIndexChanged(sender, e);
    }

    protected void btnCancel_Click(object sender, EventArgs e)
    {
        ChangeView(sender, 0);
    }

    protected void btnAddRule_Click(object sender, EventArgs e)
    {
        divAddRule.Visible = true;
        btnAddRule.Visible = false;
    }

    protected void btnCancelCreate_Click(object sender, EventArgs e)
    {
        txtNewToLower.Text = string.Empty;
        txtNewToUpper.Text = string.Empty;
        divAddRule.Visible = false;
    }

    protected void btnCreate_Click(object sender, EventArgs e)
    {

        btnCancelCreate_Click(sender, e);
    }
}