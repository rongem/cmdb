using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Admin_ConvertAttributeToItem : System.Web.UI.Page
{
    private AttributeType attributeType;
    private List<ItemType> itemTypes = new List<ItemType>();
    private IEnumerable<ConfigurationItem> items;
    private IEnumerable<ItemAttribute> attributes;
    private IEnumerable<AttributeType> correspondingAttributeTypes;
    private IEnumerable<ConnectionType> connectionTypes;
    private Dictionary<string, List<Guid>> attributeValueItemsMapper = new Dictionary<string, List<Guid>>();
    private Dictionary<string, ConnectionType> connTypes = new Dictionary<string, ConnectionType>();

    protected void Page_Load(object sender, EventArgs e)
    {
        string guidString = Request.QueryString["ID"];
        Guid guid;
        if (string.IsNullOrWhiteSpace(guidString) || !Guid.TryParse(guidString, out guid))
        {
            Response.Redirect("~/Admin/AttributeTypes.aspx", true);
            return;
        }
        attributeType = MetaDataHandler.GetAttributeType(guid);
        if (attributeType == null)
            Response.Redirect("~/Admin/AttributeTypes.aspx", true);

        connectionTypes = MetaDataHandler.GetConnectionTypes();
        foreach (ConnectionType connectionType in connectionTypes)
        {
            connTypes.Add(connectionType.ConnTypeId.ToString(), connectionType);
        }

        if (!IsPostBack)
        {
            List<string> itemTypeNames = new List<string>(MetaDataHandler.GetItemTypes().Select(i => i.TypeName));
            if (itemTypeNames.Contains(attributeType.TypeName))
            {
                lblError.Text = "Ein gleichnamiger Item-Typ ist bereits vorhanden. Sie müssen den Namen des Attribut-Typs ändern.";
                lblError.Visible = true;
                mvContent.Visible = false;
            }

            RetrieveInformation();
        }
    }

    private void RetrieveInformation()
    {
        lblTypeName.Text = attributeType.TypeName;
        itemTypes.AddRange(MetaDataHandler.GetItemTypesByAllowedAttributeType(attributeType.TypeId));
        items = DataHandler.GetConfigurationItemsByType(itemTypes.Select(t => t.TypeId).ToArray());
        txtNumItems.Text = items.Count().ToString();
        attributes = DataHandler.GetAttributeForAttributeType(attributeType.TypeId);
        correspondingAttributeTypes = MetaDataHandler.GetAttributeTypesForCorrespondingValuesOfType(attributeType.TypeId);

        string[] vals = attributes.Select(a => a.AttributeValue).Distinct().ToArray();
        for (int i = 0; i < vals.Length; i++)
        {
            attributeValueItemsMapper.Add(vals[i], new List<Guid>());
        }

        txtNumAttributes.Text = attributes.Count().ToString();
        txtNumNewItems.Text = vals.Length.ToString();
        lstItemTypes.DataSource = itemTypes;
        lstItemTypes.DataBind();
        lstCorrespondingAttributeTypes.DataSource = correspondingAttributeTypes;
        lstCorrespondingAttributeTypes.DataBind();
        lstDirection_SelectedIndexChanged(null, null);
    }

    protected void mvContent_ActiveViewChanged(object sender, EventArgs e)
    {

    }

    protected void lstDirection_SelectedIndexChanged(object sender, EventArgs e)
    {
        string val = lstConnectionType.SelectedValue; // Ausgewählten Wert beibehalten, falls möglich
        lstConnectionType.DataSource = connectionTypes;
        lstConnectionType.DataBind();
        if (!string.IsNullOrEmpty(val))
            lstConnectionType.SelectedValue = val;
    }

    protected void lstConnectionType_PreRender(object sender, EventArgs e)
    {
        // Hilfsfunktion, die die DropDownList-Einträge neu schreibt, da Verbindungstypen in eine richtung gleich und die
        // andere unterschiedlich heißen können.
        foreach (ListItem item in lstConnectionType.Items)
        {
            ConnectionType ct = connTypes[item.Value];
            switch (lstDirection.SelectedValue)
            {
                case "1": //oberhalb
                    item.Text = string.Format("{0} ({1})", ct.ConnTypeName, ct.ConnTypeReverseName);
                    break;
                case "0": //unterhalb
                    item.Text = string.Format("{0} ({1})", ct.ConnTypeReverseName, ct.ConnTypeName);
                    break;
                default:
                    throw new Exception("Falscher Wert ausgewählt.");
            }
        }
    }
}