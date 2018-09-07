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
            if (connectionTypes.Count() == 0)
            {
                ReportFatalError("Es existieren keine Verbindungstypen. Bitte legen Sie zuerst Verbindungstypen an.");
                return;
            }

            if (MetaDataHandler.ItemTypeNameExists(attributeType.TypeName))
                divNameExists.Visible = true;
            else
                divNameExists.Visible = false;

            RetrieveInformation();
        }
    }

    private void ReportFatalError(string message)
    {
        lblError.Text = message;
        lblError.Visible = true;
        mvContent.Visible = false;
    }

    private void RetrieveInformation()
    {
        lblTypeName.Text = attributeType.TypeName;
        lblTypeName2.Text = attributeType.TypeName;
        lblTypeName3.Text = attributeType.TypeName;
        lblTypeName4.Text = attributeType.TypeName;

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
        cblCorrespondingAttributeTypes.DataSource = correspondingAttributeTypes;
        cblCorrespondingAttributeTypes.DataBind();
        lstDirection_SelectedIndexChanged(null, null);
    }

    protected void lstDirection_SelectedIndexChanged(object sender, EventArgs e)
    {
        string val = lstConnectionType.SelectedValue; // Ausgewählten Wert beibehalten, falls möglich
        lstConnectionType.DataSource = connectionTypes;
        lstConnectionType.DataBind();
        divResult.Attributes["class"] = lstDirection.SelectedValue.Equals("above") ? "table" : "tablertl";
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
                case "above": //oberhalb
                    item.Text = string.Format("{0} ({1})", ct.ConnTypeName, ct.ConnTypeReverseName);
                    lblConnType.Text = ct.ConnTypeName;
                    break;
                case "below": //unterhalb
                    item.Text = string.Format("{0} ({1})", ct.ConnTypeReverseName, ct.ConnTypeName);
                    lblConnType.Text = ct.ConnTypeReverseName;
                    break;
                default:
                    throw new Exception("Falscher Wert ausgewählt.");
            }
        }
    }

    protected void rblChangeOrRename_SelectedIndexChanged(object sender, EventArgs e)
    {
        pNewName.Visible = rblChangeOrRename.SelectedValue == "rename";
        if (pNewName.Visible)
            txtNewName.Focus();
    }

    protected void SummaryStep_Activate(object sender, EventArgs e)
    {
        if (divNameExists.Visible)
        {
            if (rblChangeOrRename.SelectedValue.Equals("rename"))
            {
                List<string> itemTypeNames = new List<string>(MetaDataHandler.GetItemTypes().Select(i => i.TypeName));
                if (itemTypeNames.Contains(txtNewName.Text))
                {
                    lblError.Text = "Der Name " + txtNewName.Text + " existiert schon als Configuration Item Typ. Bitte ändern Sie den neuen Namen.";
                    mvContent.ActiveStepIndex = 0;
                    txtNewName.Focus();
                    return;
                }
            }

        }
    }

    protected void FinalStep_Activate(object sender, EventArgs e)
    {
        Position position = lstDirection.SelectedValue.Equals("above") ? Position.Above : Position.Below;
        List<AttributeType> attributeTypesToTransfer = new List<AttributeType>();
        foreach (ListItem item in cblCorrespondingAttributeTypes.Items)
        {
            if (item.Selected)
            {
                attributeTypesToTransfer.Add(MetaDataHandler.GetAttributeType(Guid.Parse(item.Value)));
            }
        }
        OperationResult or = OperationsHandler.ConvertAttributeTypeToCIType(attributeType, divNameExists.Visible ? txtNewName.Text : attributeType.TypeName, txtColor.Text,
            MetaDataHandler.GetConnectionType(Guid.Parse(lstConnectionType.SelectedValue)), position,
            attributeTypesToTransfer, Request.LogonUserIdentity);
        txtResult.Text = or.Message;
        if (!or.Success)
        {
            lblError.Text = ("Es sind Fehler aufgetreten. Bitte überprüfen Sie das Protokoll.");
            lblError.Visible = true;
        }
    }
}