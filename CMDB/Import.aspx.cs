using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Import : System.Web.UI.Page
{
    private List<string> _columnNames;
    private List<ListItem> _targets;

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
        }
        ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(btnUpload);
    }

    private List<ListItem> GetPossibleColumnTargets(bool withAttributes, bool withConnectionsToLower, bool withConnectionsToUpper, bool withLinks)
    {
        Guid itemTypeId = Guid.Parse(lstItemTypes.SelectedValue);
        List<ListItem> listItems = new List<ListItem>();
        listItems.Add(new ListItem("<ignorieren>", "ignore"));
        listItems.Add(new ListItem("Name des CI", "name"));
        if (withAttributes) // Attribute
        {
            foreach (AttributeType attributeType in MetaDataHandler.GetAllowedAttributeTypesForItemType(itemTypeId))
            {
                listItems.Add(new ListItem(attributeType.TypeName, string.Format("a:{0}", attributeType.TypeId)));
            }
        }
        if (withConnectionsToLower) // Verbindungen
        {
            foreach (ConnectionRule connectionRule in MetaDataHandler.GetConnectionRulesByUpperItemType(itemTypeId))
            {
                listItems.Add(new ListItem(string.Format("{0} {1}",
                    MetaDataHandler.GetConnectionType(connectionRule.ConnType).ConnTypeName,
                    MetaDataHandler.GetItemType(connectionRule.ItemLowerType).TypeName),
                    string.Format("crtl:{0}", connectionRule.RuleId)));
            }
        }
        if (withConnectionsToUpper) // Verbindungen
        {
            foreach (ConnectionRule connectionRule in MetaDataHandler.GetConnectionRulesByLowerItemType(itemTypeId))
            {
                listItems.Add(new ListItem(string.Format("{0} {1}",
                    MetaDataHandler.GetConnectionType(connectionRule.ConnType).ConnTypeReverseName,
                    MetaDataHandler.GetItemType(connectionRule.ItemUpperType).TypeName),
                    string.Format("crtu:{0}", connectionRule.RuleId)));
            }
        }
        if (withLinks) // Hyperlinks
        {
            listItems.Add(new ListItem("Hyperlink-Adresse", "linkaddress"));
            listItems.Add(new ListItem("Beschreibung", "linkdescription"));
        }
        return listItems;
    }

    protected void btnUpload_Click(object sender, EventArgs e)
    {
        if (fuImportFile.HasFile)
        {
            try
            {
                if (fuImportFile.PostedFile.ContentType == "text/csv" ||
                    (fuImportFile.PostedFile.ContentType == "application/vnd.ms-excel" && System.IO.Path.GetExtension(fuImportFile.PostedFile.FileName) == ".csv") ||
                    fuImportFile.PostedFile.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    if (fuImportFile.PostedFile.ContentLength < 10240000)
                    {
                        List<string[]> lines = GetFileContent(fuImportFile.PostedFile.ContentType, fuImportFile.FileContent);
                        try
                        {
                            int columns = GetColumnCount(lines);
                            _columnNames = GetColumnNames(lines, chkHeadlines.Checked, columns);
                            ViewState.Add("columNames", _columnNames);
                            ViewState.Add("lines", lines);
                            _targets = GetPossibleColumnTargets(chkElements.Items[0].Selected, chkElements.Items[1].Selected, chkElements.Items[2].Selected, chkElements.Items[3].Selected);
                            //ViewState.Add("targets", _targets);
                            repColumns.DataSource = _columnNames;
                            repColumns.DataBind();
                            wzContent.ActiveStepIndex = 1;
                        }
                        catch (Exception ex)
                        {
                            lblLocalError.Text = ex.Message;
                            return;
                        }
                    }
                    else
                        lblLocalError.Text = "Die Datei darf nicht größer als 10 MB sein!";
                }
                else
                    lblLocalError.Text = "Nur Dateien vom Typ CSV oder XSLX sind erlaubt!";
            }
            catch (Exception ex)
            {
                lblLocalError.Text = "Die Datei konnte nicht hochgeladen werden. Folgender Fehler wurde erzeugt: " + ex.Message;
            }
        }
        else
        {
            lblLocalError.Text = "Sie haben keine Datei angegeben";
        }
    }

    private List<string> GetColumnNames(List<string[]> lines, bool firstLineContainsColumnNames, int columnCount)
    {
        List<string> columnNames = new List<string>(columnCount);
        if (firstLineContainsColumnNames)
        {
            if (lines.Count < 2)
                throw new Exception("Die Datei enthält zu wenige Zeilen.");
            if (lines[0].Contains(string.Empty))
                throw new Exception("Es dürfen keine leeren Spaltennamen in der Überschriftenzeile existieren");
            columnNames.AddRange(lines[0]);
            lines.RemoveAt(0);
        }
        else
        {
            if (lines.Count < 1)
                throw new Exception("Die Datei enthält zu wenige Zeilen.");
            for (int i = 0; i < columnCount; i++)
            {
                columnNames.Add(string.Format("Spalte {0}", i + 1));
            }
        }
        return columnNames;
    }

    private int GetColumnCount(List<string[]> lines)
    {
        int length = -1;
        bool hasError = false;
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        for (int i = 0; i < lines.Count; i++)
        {
            int lineLength = lines[i].Length;
            if (length == -1)
                length = lineLength;
            else if (length != lineLength)
            {
                hasError = true;
                if (length < lineLength)
                {
                    sb.AppendFormat("Fehler in Zeile {0}: Die Zeile hat {1} Spalte(n) zuviel.", i, lineLength - length);
                }
                if (length > lineLength)
                {
                    sb.AppendFormat("Fehler in Zeile {0}: Die Zeile hat {1} Spalte(n) zuwenig.", i, length - lineLength);
                }
                sb.AppendLine("<br />");
            }
        }
        if (hasError)
            throw new Exception(sb.ToString());
        return length;
    }

    /// <summary>
    /// Gibt den Inhalt in Abhängigkeit vom Typ als Liste mit String-Arrays zurück
    /// </summary>
    /// <param name="contentType">ContentType, der verarbeitet werden soll</param>
    /// <param name="contentStream">Stream mit dem Inhalt der Datei</param>
    /// <returns></returns>
    private List<string[]> GetFileContent(string contentType, System.IO.Stream contentStream)
    {
        List<string[]> lines = new List<string[]>();
        if (contentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") // XSLX
        {
            lines = CmdbHelpers.ExportHelper.ExcelHelper.GetLinesFromExcelDocument(contentStream);
        }
        else // CSV
        {
            using (System.IO.StreamReader reader = new System.IO.StreamReader(contentStream))
            {
                const string regexCsvSeparator = "[\t;,|](?=(?:[^'\"]*'[^'\"]*')*[^'\"]*$)";
                while (reader.Peek() >= 0)
                {
                    string line = reader.ReadLine();
                    lines.Add(System.Text.RegularExpressions.Regex.Split(line, regexCsvSeparator));
                }
                reader.Close();
            }
        }

        return lines;
    }

    protected void repColumns_ItemDataBound(object sender, RepeaterItemEventArgs e)
    {
        if (e.Item.ItemType == ListItemType.Item ||
         e.Item.ItemType == ListItemType.AlternatingItem)
        {
            DropDownList lst = e.Item.FindControl("lstTargets") as DropDownList;
            lst.DataSource = _targets;
            lst.DataBind();
            string lbl = (e.Item.FindControl("lblColumnName") as Label).Text;
            StringComparison cci = StringComparison.CurrentCultureIgnoreCase;
            if (lbl.Equals("Name", cci) || lbl.Equals("Item-Name", cci) || lbl.Equals("Itemname", cci) || lbl.Equals("Configuration Item", cci))
            {
                lst.SelectedValue = "name";
            }
            else
            {
                ListItem listItem = lst.Items.FindByText(lbl);
                if (listItem != null)
                {
                    lst.SelectedValue = listItem.Value;
                }
            }
        }
    }

    private bool CancelReview = false;

    protected void Columns_Deactivate(object sender, EventArgs e)
    {
        CancelReview = false;
        List<string> targets = new List<string>();
        foreach (DropDownList lst in UIHelper.GetAllControls(repColumns).OfType<DropDownList>())
        {
            if (targets.Contains(lst.SelectedValue))
            {
                lblLocalError.Text = string.Format("Das Ziel {0} wurde mehrfach angegeben", lst.SelectedItem.Text);
                wzContent.ActiveStepIndex--;
                lst.Focus();
                lst.BorderStyle = BorderStyle.Dotted;
                lst.BorderColor = System.Drawing.Color.Red;
                CancelReview = true;
                return;
            }
            if (lst.SelectedValue != "ignore")
                targets.Add(lst.SelectedValue);
        }
        if (!targets.Contains("name"))
        {
            lblLocalError.Text = "Es muss mindestens eine Spalte für den Namen des CIs gewählt werden.";
            wzContent.ActiveStepIndex--;
            CancelReview = true;
        }
    }

    protected void Review_Activate(object sender, EventArgs e)
    {
        if (CancelReview)
            return;

        Dictionary<int, string> activeColumns = new Dictionary<int, string>();
        DataTable dt = new DataTable();
        int nameColumnId = -1;
        DropDownList[] lists = UIHelper.GetAllControls(repColumns).OfType<DropDownList>().ToArray();
        for (int i = 0; i < lists.Length; i++)
        {
            if (lists[i].SelectedValue != "ignore")
            {
                activeColumns.Add(i, lists[i].SelectedItem.Text);
                dt.Columns.Add(new DataColumn(lists[i].SelectedItem.Text, typeof(string)) { Caption = lists[i].SelectedValue });
                if (lists[i].SelectedValue.Equals("name"))
                    nameColumnId = i;
            }
        }
        StringBuilder sb = new StringBuilder();
        List<string[]> lines = ViewState["lines"] as List<string[]>;
        List<string> itemNames = new List<string>();
        Guid itemTypeId = Guid.Parse(lstItemTypes.SelectedValue);

        for (int i = 0; i < lines.Count; i++)
        {
            string[] line = lines[i];
            DataRow dataRow = dt.NewRow();
            foreach (int j in activeColumns.Keys)
            {
                if (j == nameColumnId)
                {
                    if (string.IsNullOrWhiteSpace(line[j]))
                    {
                        dataRow = null;
                        sb.AppendFormat("Fehler in Zeile {0}: Der Name des Configuration Items ist leer", i + 1);
                        sb.AppendLine("<br />");
                        break;
                    }
                    if (itemNames.Contains(line[j].ToLower()))
                    {
                        dataRow = null;
                        sb.AppendFormat("Fehler in Zeile {0}: Das Configuration Item {1} taucht wiederholt auf und wird ignoriert.", i + 1, line[j]);
                        sb.AppendLine("<br />");
                        break;
                    }
                    itemNames.Add(line[j].ToLower());
                    if (chkIgnore.Checked)
                    {
                        ConfigurationItem ci = DataHandler.GetConfigurationItemByTypeIdAndName(itemTypeId, line[j]);
                        if (ci != null)
                        {
                            dataRow = null;
                            sb.AppendFormat("Zeile {0}: Das Configuration Item {1} existiert bereits und wird ignoriert.", i + 1, ci.ItemName);
                            sb.AppendLine("<br />");
                            break;
                        }
                    }
                }
                dataRow.SetField(activeColumns[j], line[j]);
            }
            if (dataRow != null)
                dt.Rows.Add(dataRow);
        }
        gvImport.DataSource = dt;
        gvImport.DataBind();
        ViewState.Add("lines", dt);
        lblLocalError.Text = sb.ToString();
    }

    protected void Import_Activate(object sender, EventArgs e)
    {
        DataTable dt = ViewState["lines"] as DataTable;
        StringBuilder sb = new StringBuilder();
        int nameColumnId = dt.Columns.IndexOf("name");
        int linkdescriptionId = dt.Columns.IndexOf("linkdescription");
        Guid itemTypeId = Guid.Parse(lstItemTypes.SelectedValue);
        foreach (DataRow dataRow in dt.Rows)
        {
            ConfigurationItem configurationItem = null;
            if (!chkIgnore.Checked)
            {
                configurationItem = DataHandler.GetConfigurationItemByTypeIdAndName(itemTypeId, dataRow[nameColumnId].ToString());
            }
            if (configurationItem == null)
            {
                configurationItem = new ConfigurationItem() { ItemId = Guid.NewGuid(), ItemType = itemTypeId, ItemName = dataRow[nameColumnId].ToString() };
                try
                {
                    DataHandler.CreateConfigurationItem(configurationItem, Request.LogonUserIdentity);
                    configurationItem = DataHandler.GetConfigurationItem(configurationItem.ItemId);
                    sb.AppendFormat("CI {0} angelegt", configurationItem.ItemName);
                }
                catch (Exception ex)
                {
                    sb.AppendFormat("Fehler beim Anlegen des CI {0}: {1}", configurationItem.ItemName, ex.Message);
                    sb.AppendLine("<br />");
                    continue;
                }
            }
            else // existiert
            {
                sb.AppendFormat("CI {0} gefunden", configurationItem.ItemName);
            }
            Dictionary<Guid, AttributeType> attributeTypes = OperationsHandler.GetAttributeTypesDictionary();
            Dictionary<Guid, ConnectionType> connectionTypes = OperationsHandler.GetConnectionTypesDictionary();
            Dictionary<Guid, ConnectionRule> connectionRules = OperationsHandler.GetConnectionRulesDictionary();

            for (int i = 0; i < dt.Columns.Count; i++)
            {
                if (i == nameColumnId)
                    continue;
                string[] caption = dt.Columns[i].Caption.Split(':');
                string value = dataRow[dt.Columns[i]].ToString().Trim();
                ConnectionRule cr;
                ConnectionType connType;
                if (string.IsNullOrEmpty(value))
                    continue;
                switch (caption[0])
                {
                    case "a": // Attribut
                        AttributeType attributeType = attributeTypes[Guid.Parse(caption[1])];
                        ChangeOrCreateAttribute(configurationItem, attributeType, value, sb);
                        break;
                    case "crtl": // Connection To Lower
                        cr = connectionRules[Guid.Parse(caption[1])];
                        connType = connectionTypes[cr.ConnType];
                        ChangeOrCreateConnection(configurationItem, connType, 
                            DataHandler.GetConfigurationItemByTypeIdAndName(cr.ItemLowerType, value), cr, sb);
                        break;
                    case "crtu": // Connection To Upper
                        cr = connectionRules[Guid.Parse(caption[1])];
                        connType = connectionTypes[cr.ConnType];
                        ChangeOrCreateConnection(DataHandler.GetConfigurationItemByTypeIdAndName(cr.ItemLowerType, value), 
                            connType, configurationItem, cr, sb);
                        break;
                    case "linkaddress": // Hyperlink, Adresse; Beschreibung suchen
                        string linkDescription = linkdescriptionId == -1 ? value : dataRow[dt.Columns[linkdescriptionId]].ToString();
                        if (string.IsNullOrEmpty(value))
                            continue;
                        CreateHyperLink(configurationItem, value, linkDescription, sb);
                        break;
                }
            }
        }
    }

    private void CreateHyperLink(ConfigurationItem configurationItem, string value, string linkDescription, StringBuilder sb)
    {
        Uri uri;
        if (!Uri.TryCreate(value, UriKind.Absolute, out uri))
        {
            sb.AppendFormat("Fehlerhafter Hyperlink: {0}", value);
            sb.AppendLine("<br />");
            return;
        }
        ItemLink link = new ItemLink()
        {
            ItemId = configurationItem.ItemId,
            LinkId = Guid.NewGuid(),
            LinkURI = value,
            LinkDescription = linkDescription,
        };
        try
        {
            DataHandler.CreateLink(link, Request.LogonUserIdentity);
            sb.AppendFormat(" Hyperlink angelegt: {0}", value);
            sb.AppendLine("<br />");
        }
        catch (Exception ex)
        {
            sb.AppendFormat("Fehler beim Anlegen des Hyperlinks auf {0}: {1}", value, ex.Message);
            sb.AppendLine("<br />");
        }
    }

    private void ChangeOrCreateConnection(ConfigurationItem upperCI, ConnectionType connType, ConfigurationItem lowerCI, ConnectionRule cr, StringBuilder sb)
    {
        if (lowerCI == null)
        {
            Connection conn = DataHandler.GetConnectionByContent(upperCI.ItemId, cr.ConnType, lowerCI.ItemId);
            if (conn == null)
            {
                conn = new Connection()
                {
                    ConnId = Guid.NewGuid(),
                    ConnUpperItem = upperCI.ItemId,
                    ConnLowerItem = lowerCI.ItemId,
                    ConnType = cr.ConnType,
                    RuleId = cr.RuleId,
                    Description = string.Empty,
                };
                try
                {
                    DataHandler.CreateConnection(conn, Request.LogonUserIdentity);
                    sb.AppendFormat("Verbindung '{0} {1} {2}' neu erstellt.", upperCI.ItemName, connType.ConnTypeName, lowerCI);
                    sb.AppendLine("<br />");
                }
                catch (Exception ex)
                {
                    sb.AppendFormat("Fehler: Verbindung '{0} {1} {2}' konnte nicht erstellt werden. Grund: {3}",
                        upperCI.ItemName, connType.ConnTypeName, lowerCI, ex.Message);
                    sb.AppendLine("<br />");
                }
            }
            else
            {
                sb.AppendFormat("Verbindung '{0} {1} {2}' existiert bereits. Keine Aktion erforderlich.", upperCI.ItemName, connType.ConnTypeName, lowerCI);
                sb.AppendLine("<br />");
            }
        }
        else
        {
            sb.AppendFormat("Fehler: Configuration Item '{0}' existiert nicht. Konnte keine Verbindung erstellen.", lowerCI);
            sb.AppendLine("<br />");
        }
    }

    private void ChangeOrCreateAttribute(ConfigurationItem configurationItem, AttributeType attributeType, string value, StringBuilder sb)
    {
        switch (OperationsHandler.ChangeOrCreateAttribute(configurationItem.ItemId, attributeType.TypeId, value, Request.LogonUserIdentity))
        {
            case ChangeResult.Changed:
                sb.AppendFormat("Attribut vom Typ '{0}' auf den Wert '{1}' gesetzt.", attributeType.TypeName, value);
                sb.AppendLine("<br />");
                break;
            case ChangeResult.Created:
                sb.AppendFormat("Attribut vom Typ '{0}' mit Wert '{1}' erzeugt.", attributeType.TypeName, value);
                sb.AppendLine("<br />");
                break;
            case ChangeResult.Deleted:
                sb.AppendFormat("Attribut vom Typ '{0}' gelöscht.", attributeType.TypeName);
                sb.AppendLine("<br />");
                break;
            case ChangeResult.Failure:
                sb.AppendFormat("Fehler beim Attribut vom Typ '{0}', Wert '{1}'", attributeType.TypeName, value);
                sb.AppendLine("<br />");
                break;
        }
    }
}