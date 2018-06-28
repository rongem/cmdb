using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Filter : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        lstSearchItemType.DataSource = MetaDataHandler.GetItemTypes();
        if (!IsPostBack)
        {
            DataBind();
            chkSearchItemType_CheckedChanged(sender, e);
            lstSearchItemType_SelectedIndexChanged(sender, e);
            chkSearchConnectionDownward_CheckedChanged(sender, e);
            chkSearchConnectionUpward_CheckedChanged(sender, e);
            if (txtSearchText.Visible)
            {
                txtSearchText.Focus();
                divSearch.Attributes["class"] = "indent";
            }
        }
    }

    #region Properties

    /// <summary>
    /// Legt fest, ob ein ItemTyp angegeben werden muss
    /// </summary>
    public bool IsItemTypeMandatory
    {
        get { return !chkSearchItemType.Visible; }

        set
        {
            chkSearchItemType.Visible = !value;
            chkSearchItemType.Checked = value;
            chkSearchItemType_CheckedChanged(null, null);
        }
    }

    /// <summary>
    /// Legt fest, ob am Anfang nur ein Button zu sehen ist oder gleich der ganze Filter
    /// </summary>
    public bool IsFilterButtonVisible
    {
        get { return btnShowFilter.Visible; }
        set
        {
            btnShowFilter.Visible = value;
            pnlFilter.Visible = !value;
        }
    }

    /// <summary>
    /// Legt fest, ob die Suche nach reinem Text erlaubt ist
    /// </summary>
    public bool IsSearchTextVisible
    {
        get { return pnlSearchText.Visible; }
        set { pnlSearchText.Visible = value; }
    }

    /// <summary>
    /// Gibt an, ob nach einemItemTyp gesucht werden soll
    /// </summary>
    public bool IsSearchItemTypeChecked
    {
        get { return chkSearchItemType.Checked; }
    }

    /// <summary>
    /// Gibt die GUid des Itemtyps zurück, wenn nach einem ItemTyp gesucht werden soll, andernfalls eine leere Guid
    /// </summary>
    public Guid ItemTypeToSearch
    {
        get { return chkSearchItemType.Checked ? Guid.Parse(lstSearchItemType.SelectedValue) : Guid.Empty; }
    }

    public Search Search
    {
        get
        {
            if (string.IsNullOrWhiteSpace(txtSearchText.Text) && !chkSearchItemType.Checked && !chkSearchOwn.Checked)
                return null;
            txtSearchText.Text = txtSearchText.Text.Trim();
            Search search = new Search();
            if (!string.IsNullOrWhiteSpace(txtSearchText.Text)) // Überprüfen, ob der Text im Namen oder den Attributen vorkommt
                search.NameOrValue = txtSearchText.Text;
            if (chkSearchItemType.Checked == true) // Überprüfen, ob der Typ vorkommt
            {
                Guid itemType = Guid.Parse(lstSearchItemType.SelectedValue);
                search.ItemType = (itemType);
                if (chkSearchConnectionDownward.Checked == true)
                {
                    if (chkSearchConnectionDownwardWithItemType.Checked == true)
                        search.ConnectionsToLower = new Search.SearchConnection[] { new Search.SearchConnection() { ConnectionType = Guid.Parse(lstSearchConnectionType.SelectedValue), ConfigurationItemType = Guid.Parse(lstCITypesDownward.SelectedValue), Count = lstItemsDownward.SelectedValue } };
                    else
                        search.ConnectionsToLower = new Search.SearchConnection[] { new Search.SearchConnection() { ConnectionType = Guid.Parse(lstSearchConnectionType.SelectedValue), Count = lstItemsDownward.SelectedValue } };
                }
                if (chkSearchConnectionUpward.Checked == true)
                {
                    if (chkSearchConnectionUpwardWithItemType.Checked == true)
                        search.ConnectionsToUpper = new Search.SearchConnection[] { new Search.SearchConnection() { ConnectionType = Guid.Parse(lstSearchConnectionReverseType.SelectedValue), ConfigurationItemType = Guid.Parse(lstCITypesUpward.SelectedValue), Count = lstItemsUpward.SelectedValue } };
                    else
                        search.ConnectionsToUpper = new Search.SearchConnection[] { new Search.SearchConnection() { ConnectionType = Guid.Parse(lstSearchConnectionReverseType.SelectedValue), Count = lstItemsUpward.SelectedValue } };
                }
                if (chkSearchAttributeTypes.Checked == true)
                {
                    search.Attributes = new Search.SearchAttribute[] { new Search.SearchAttribute() { AttributeTypeId = Guid.Parse(lstAttributeTypes.SelectedValue), AttributeValue = txtAttributeContent.Text } };
                }
            }

            if (chkSearchOwn.Checked == true) // Nur eigene Items suchen
            {
                search.ResponsibleToken = Request.LogonUserIdentity.Name;
            }
            return search;
        }
    }

    #endregion

    #region EventHandlers

    public event EventHandler SearchCriteriaUpdated;

    #endregion

    protected void btnShowFilter_Click(object sender, EventArgs e)
    {
        btnShowFilter.Visible = false;
        pnlFilter.Visible = true;
    }

    protected void chkSearchAttributeTypes_CheckedChanged(object sender, EventArgs e)
    {
        lstAttributeTypes.Enabled = chkSearchAttributeTypes.Checked;
        txtAttributeContent.Enabled = chkSearchAttributeTypes.Checked;
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void chkSearchConnectionDownward_CheckedChanged(object sender, EventArgs e)
    {
        lstSearchConnectionType.Enabled = chkSearchConnectionDownward.Checked;
        lstItemsDownward.Enabled = chkSearchConnectionDownward.Checked;
        if (chkSearchConnectionDownward.Checked == false)
            chkSearchConnectionDownwardWithItemType.Checked = false;
        chkSearchConnectionDownwardWithItemType_CheckedChanged(sender, e);
        chkSearchConnectionDownwardWithItemType.Enabled = chkSearchConnectionDownward.Checked;
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void chkSearchConnectionDownwardWithItemType_CheckedChanged(object sender, EventArgs e)
    {
        lstCITypesDownward.Enabled = chkSearchConnectionDownwardWithItemType.Checked;
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void chkSearchConnectionUpward_CheckedChanged(object sender, EventArgs e)
    {
        lstSearchConnectionReverseType.Enabled = chkSearchConnectionUpward.Checked;
        lstItemsUpward.Enabled = chkSearchConnectionUpward.Checked;
        if (chkSearchConnectionUpward.Checked == false)
            chkSearchConnectionUpwardWithItemType.Checked = false;
        chkSearchConnectionUpwardWithItemType_CheckedChanged(sender, e);
        chkSearchConnectionUpwardWithItemType.Enabled = chkSearchConnectionUpward.Checked;
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void chkSearchConnectionUpwardWithItemType_CheckedChanged(object sender, EventArgs e)
    {
        lstCITypesUpward.Enabled = chkSearchConnectionUpwardWithItemType.Checked;
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void chkSearchItemType_CheckedChanged(object sender, EventArgs e)
    {
        lstSearchItemType.Enabled = chkSearchItemType.Checked;
        pnlSearchConnections.Visible = lstSearchItemType.Enabled;
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void lstSearchConnectionType_SelectedIndexChanged(object sender, EventArgs e)
    {
        Guid itemUpperType = Guid.Parse(lstSearchItemType.SelectedValue), connType = Guid.Parse(lstSearchConnectionType.SelectedValue);
        lstCITypesDownward.DataSource = MetaDataHandler.GetLowerItemTypeForUpperItemTypeAndConnectionType(itemUpperType, connType);
        lstCITypesDownward.DataBind();
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void lstSearchConnectionReverseType_SelectedIndexChanged(object sender, EventArgs e)
    {
        Guid itemLowerType = Guid.Parse(lstSearchItemType.SelectedValue), connType = Guid.Parse(lstSearchConnectionReverseType.SelectedValue);
        lstCITypesUpward.DataSource = MetaDataHandler.GetUpperItemTypeForLowerItemTypeAndConnectionType(itemLowerType, connType);
        lstCITypesUpward.DataBind();
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void lstSearchItemType_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (lstSearchItemType.SelectedIndex == -1)
        {
            chkSearchItemType.Enabled = false;
            chkSearchItemType.Checked = false;
            this.Visible = false;
            return;
        }
        Guid itemType = Guid.Parse(lstSearchItemType.SelectedValue);
        // Haken herausnehmen in den Checkboxen bei Neuauswahl
        chkSearchConnectionDownward.Checked = false;
        chkSearchConnectionUpward.Checked = false;
        chkSearchAttributeTypes.Checked = false;
        chkSearchAttributeTypes_CheckedChanged(sender, e);
        chkSearchConnectionDownward_CheckedChanged(sender, e);
        chkSearchConnectionUpward_CheckedChanged(sender, e);
        // erst die abwärts gerichteten Regeln durchsuchen
        IEnumerable<ConnectionType> connectionTypes = MetaDataHandler.GetAllowedDownwardConnnectionTypesForItemType(itemType);
        if (connectionTypes.Count() == 0) // Nur wenn Verbindungen vorhanden sind, aktivieren
        {
            chkSearchConnectionDownward.Enabled = false;
            lstSearchConnectionType.Items.Clear();
            lstCITypesDownward.Items.Clear();
        }
        else
        {
            chkSearchConnectionDownward.Enabled = true;
            lstSearchConnectionType.DataSource = connectionTypes.OrderBy(a => a.ConnTypeName);
            lstSearchConnectionType.DataBind();
            lstSearchConnectionType_SelectedIndexChanged(sender, e);
        }
        // dann die aufwärts gerichteten Regeln durchsuchen
        connectionTypes = MetaDataHandler.GetAllowedUpwardConnnectionTypesForItemType(itemType);
        if (connectionTypes.Count() == 0) // Nur wenn Verbindungen vorhanden sind, aktivieren
        {
            chkSearchConnectionUpward.Enabled = false;
            lstSearchConnectionReverseType.Items.Clear();
            lstCITypesUpward.Items.Clear();
        }
        else
        {
            chkSearchConnectionUpward.Enabled = true;
            lstSearchConnectionReverseType.DataSource = connectionTypes.OrderBy(a => a.ConnTypeReverseName);
            lstSearchConnectionReverseType.DataBind();
            lstSearchConnectionReverseType_SelectedIndexChanged(sender, e);
        }
        // Attribute überprüfen
        IEnumerable<AttributeType> attributeTypes = MetaDataHandler.GetAllowedAttributeTypesForItemType(itemType);
        if (attributeTypes.Count() == 0)
        {
            chkSearchAttributeTypes.Enabled = false;
            lstAttributeTypes.Items.Clear();
        }
        else
        {
            chkSearchAttributeTypes.Enabled = true;
            lstAttributeTypes.DataSource = attributeTypes;
            lstAttributeTypes.DataBind();
        }
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }


    protected void lstAttributeTypes_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void lstCITypesDownward_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void lstItemsUpward_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void lstCITypesUpward_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void chkSearchOwn_CheckedChanged(object sender, EventArgs e)
    {
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }

    protected void txtAttributeContent_TextChanged(object sender, EventArgs e)
    {
        if (SearchCriteriaUpdated != null)
            SearchCriteriaUpdated(sender, e);
    }
}