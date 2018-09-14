using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Import : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!((CMDB)this.Master).UserCanEdit || MetaDataHandler.GetItemTypesCount() == 0)
        {
            Response.Redirect("~/Default.aspx", true);
            return;
        }
        if (!IsPostBack)
        {
            lstItemTypes.DataSource = MetaDataHandler.GetItemTypes();
            lstItemTypes.DataBind();
            if (lstItemTypes.Items.Count == 0)
                Response.Redirect("~/Default.aspx", true);
            lstItemTypes_SelectedIndexChanged(sender, e);
        }

    }

    protected void lstItemTypes_SelectedIndexChanged(object sender, EventArgs e)
    {
        SetDataGridColumns();
    }

    protected void chkElements_SelectedIndexChanged(object sender, EventArgs e)
    {
        SetDataGridColumns();
    }

    private void SetDataGridColumns()
    {
        gvImport.DataSource = CreateDataTable(chkElements.Items[0].Selected, chkElements.Items[1].Selected, chkElements.Items[2].Selected);
        gvImport.DataBind();
    }

    private DataTable CreateDataTable(bool withAttributes, bool withConnections, bool withLinks)
    {
        Guid itemTypeId = Guid.Parse(lstItemTypes.SelectedValue);
        DataTable dt = new DataTable();
        dt.Columns.Add(new DataColumn("Name", typeof(string)));
        if (withAttributes) // Attribute
        {
            foreach (AttributeType attributeType in MetaDataHandler.GetAllowedAttributeTypesForItemType(itemTypeId))
            {
                dt.Columns.Add(new DataColumn(attributeType.TypeName, typeof(string)));
            }
        }
        if (withConnections) // Verbindungen
        {
            foreach (ConnectionRule connectionRule in MetaDataHandler.GetConnectionRulesByUpperItemType(itemTypeId))
            {
                dt.Columns.Add(new DataColumn(string.Format("{0} {1}", 
                    MetaDataHandler.GetConnectionType(connectionRule.ConnType).ConnTypeName,
                    MetaDataHandler.GetItemType(connectionRule.ItemLowerType).TypeName), typeof(string)));
            }
            foreach (ConnectionRule connectionRule in MetaDataHandler.GetConnectionRulesByLowerItemType(itemTypeId))
            {
                dt.Columns.Add(new DataColumn(string.Format("{0} {1}",
                    MetaDataHandler.GetConnectionType(connectionRule.ConnType).ConnTypeReverseName,
                    MetaDataHandler.GetItemType(connectionRule.ItemUpperType).TypeName), typeof(string)));
            }
        }
        if (withLinks) // Hyperlinks
        {

        }
        return dt;
    }

    protected void PasteToGridView(object sender, EventArgs e)
    {
        DataTable dt = CreateDataTable(chkElements.Items[0].Selected, chkElements.Items[1].Selected, chkElements.Items[2].Selected);
        string copiedContent = Request.Form[txtCopied.UniqueID];
        foreach (string row in copiedContent.Split('\n'))
        {
            if (!string.IsNullOrEmpty(row))
            {
                //dt.Rows.Add();
                int i = 0;
                foreach (string cell in row.Split('\t'))
                {
                    //dt.Rows[dt.Rows.Count - 1][i] = cell;
                    i++;
                }
            }
        }
        //gvImport.DataSource = dt;
        gvImport.DataBind();
        txtCopied.Text = "";
    }

}