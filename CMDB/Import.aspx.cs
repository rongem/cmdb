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
            lstItemTypes_SelectedIndexChanged(sender, e);
        }
        ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(btnUpload);
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
        gvImport.DataSource = CreateDataTable(chkElements.Items[0].Selected, chkElements.Items[1].Selected, chkElements.Items[2].Selected, chkElements.Items[3].Selected);
        gvImport.DataBind();
    }

    private DataTable CreateDataTable(bool withAttributes, bool withConnectionsToLower, bool withConnectionsToUpper, bool withLinks)
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
        if (withConnectionsToLower) // Verbindungen
        {
            foreach (ConnectionRule connectionRule in MetaDataHandler.GetConnectionRulesByUpperItemType(itemTypeId))
            {
                dt.Columns.Add(new DataColumn(string.Format("{0} {1}",
                    MetaDataHandler.GetConnectionType(connectionRule.ConnType).ConnTypeName,
                    MetaDataHandler.GetItemType(connectionRule.ItemLowerType).TypeName), typeof(string)));
            }
        }
        if (withConnectionsToUpper) // Verbindungen
        {
            foreach (ConnectionRule connectionRule in MetaDataHandler.GetConnectionRulesByLowerItemType(itemTypeId))
            {
                dt.Columns.Add(new DataColumn(string.Format("{0} {1}",
                    MetaDataHandler.GetConnectionType(connectionRule.ConnType).ConnTypeReverseName,
                    MetaDataHandler.GetItemType(connectionRule.ItemUpperType).TypeName), typeof(string)));
            }
        }
        if (withLinks) // Hyperlinks
        {
            dt.Columns.Add(new DataColumn("Hyperlink", typeof(string)));
            dt.Columns.Add(new DataColumn("Beschreibung", typeof(string)));
        }
        return dt;
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

    protected void PasteToGridView(object sender, EventArgs e)
    {
        DataTable dt = CreateDataTable(chkElements.Items[0].Selected, chkElements.Items[1].Selected, chkElements.Items[2].Selected, chkElements.Items[3].Selected);
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

    protected void btnUpload_Click(object sender, EventArgs e)
    {
        if (fuImportFile.HasFile)
        {
            try
            {
                if (fuImportFile.PostedFile.ContentType == "text/csv" ||
                    (fuImportFile.PostedFile.ContentType == "application/vnd.ms-excel" && System.IO.Path.GetExtension(fuImportFile.PostedFile.FileName) == ".csv")||
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
                    sb.AppendFormat("Fehler in Zeile {0}: Die Zeile hat {1} Spalten zuviel.", i, lineLength - length);
                }
                if (length > lineLength)
                {
                    sb.AppendFormat("Fehler in Zeile {0}: Die Zeile hat {1} Spalten zuwenig.", i, lineLength - length);
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
        }
    }
}