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
    }

    protected void btnDeleteRule_Click(object sender, ImageClickEventArgs e)
    {

    }

    protected void btnEditRule_Click(object sender, ImageClickEventArgs e)
    {
        foreach (MultiView multiView in GetAllControls(gvRules).OfType<MultiView>())
        {
            multiView.ActiveViewIndex = 0;
        }
        ((sender as ImageButton).Parent.Parent as MultiView).ActiveViewIndex = 1;
    }

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
}