using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ShowItem : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Überprüfen, ob eine gültige Id in der URL übergeben wurde
        string idQueryString = Request.QueryString["id"];
        Guid id = new Guid();
        if (string.IsNullOrWhiteSpace(idQueryString) || !Guid.TryParse(idQueryString, out id))
            Response.Redirect("~/Default.aspx", true);

        if ((Master as CMDB).UserCanEdit)
        {
            lnkEdit.Visible = true;
            lnkCopyItem.Visible = true;
            lnkEdit.NavigateUrl = "~/EditItem.aspx?id=" + idQueryString;
            lnkCopyItem.NavigateUrl = string.Format("~/CreateItem.aspx?id={0}", idQueryString);
        }

        // Datensatz finden
        ConfigurationItem item = DataHandler.GetConfigurationItem(id);
        if (item == null)
            Response.Redirect("~/Default.aspx", true);

        lblName.Text = string.Format("{0}: {1}", item.TypeName, item.ItemName);

        this.Title = string.Format("{0}: {1} anzeigen", item.TypeName, item.ItemName);

        // Attribute schreiben
        System.Data.DataTable t = new System.Data.DataTable();
        t.Columns.Add("Attribut-Typ");
        t.Columns.Add("Inhalt");
        foreach (ItemAttribute attr in DataHandler.GetAttributesForConfigurationItem(id))
        {
            t.Rows.Add(attr.AttributeTypeName, attr.AttributeValue);
        }
        cgAttributes.Table = t;
        // Verantwortliche schreiben
        t = new System.Data.DataTable();
        t.Columns.Add("Name");
        t.Columns.Add("Mail");
        t.Columns.Add("Telefon");
        t.Columns.Add("Büro");
        foreach (ItemResponsibility ir in DataHandler.GetResponsibilitesForConfigurationItem(item.ItemId))
        {
            Dictionary<string, string> users = CmdbAPI.Security.ADSHelper.GetUserProperties(CmdbAPI.Security.ADSHelper.GetBase64SIDFromUserName(ir.ResponsibleToken));
            t.Rows.Add(users["displayname"], users["mail"], users["telephonenumber"], users["physicaldeliveryofficename"]);
        }
        cgResponsibilites.Table = t;

        // Verbindungen
        // zuerst nach unten
        IEnumerable<Connection> ct = DataHandler.GetConnectionsToLowerForItem(item.ItemId);
        if (ct.Count() > 0)
        {
            TreeNode tn = new TreeNode("Abwärts gerichtete Verbindungen");
            hgConnections.Nodes.Add(tn);
            Guid oldConnType = Guid.NewGuid(),
                oldItemType = Guid.NewGuid();
            TreeNode connNode = null;
            foreach (Connection cr in ct)
            {
                if (!cr.ConnType.Equals(oldConnType))
                {
                    connNode = new TreeNode(MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeName);
                    tn.ChildNodes.Add(connNode);
                    oldConnType = cr.ConnType;
                }
                ConfigurationItem subItem = DataHandler.GetConfigurationItem(cr.ConnLowerItem);
                connNode.ChildNodes.Add(new TreeNode(string.Format("{0}: {1} ({2})",
                    subItem.TypeName, subItem.ItemName, cr.Description), subItem.ItemId.ToString(),
                    "", string.Format("~/ShowItem.aspx?id={0}", subItem.ItemId), ""));
            }
        }

        ct = DataHandler.GetConnectionsToUpperForItem(item.ItemId);
        if (ct.Count() > 0)
        {
            TreeNode tn = new TreeNode("Aufwärts gerichtete Verbindungen");
            hgConnections.Nodes.Add(tn);
            Guid oldConnType = Guid.NewGuid(),
                oldItemType = Guid.NewGuid();
            TreeNode connNode = null, itemTypeNode = null;
            foreach (Connection cr in ct)
            {
                if (!cr.ConnType.Equals(oldConnType))
                {
                    connNode = new TreeNode(MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeReverseName);
                    tn.ChildNodes.Add(connNode);
                    oldConnType = cr.ConnType;
                }
                ConfigurationItem upperItem = DataHandler.GetConfigurationItem(cr.ConnUpperItem);
                if (!upperItem.ItemType.Equals(oldItemType))
                {
                    oldItemType = upperItem.ItemType;
                    itemTypeNode = new TreeNode(upperItem.TypeName);
                    connNode.ChildNodes.Add(itemTypeNode);
                }
                itemTypeNode.ChildNodes.Add(new TreeNode(string.Format("{0}: {1} ({2})",
                    upperItem.TypeName, upperItem.ItemName, cr.Description), upperItem.ItemId.ToString(),
                    "", string.Format("~/ShowItem.aspx?id={0}", upperItem.ItemId), ""));
            }
        }

        if (hgConnections.Nodes.Count > 0)
            lblHeaderConnections.Text = "Verbindungen zu anderen Configuration Items";

        // Links hinzufügen
        foreach (ItemLink ilr in DataHandler.GetLinksForConfigurationItem(item.ItemId))
        {
            lstLinks.Items.Add(new ListItem(ilr.LinkDescription, ilr.LinkURI));
        }
        if (lstLinks.Items.Count > 0)
            lblHeaderLinks.Text = "Weiterführende Links";
    }
}