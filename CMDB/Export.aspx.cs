using CmdbAPI.BusinessLogic;
using CmdbAPI.BusinessLogic.Helpers;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

public partial class Export : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace(Request.QueryString["app"]) || ((Session["scope"] == null || string.IsNullOrWhiteSpace(Session["scope"].ToString())) && string.IsNullOrWhiteSpace(Request.QueryString["scope"])))
            Response.Redirect("~/Default.aspx", true);
        Guid guid;
        ConfigurationItem r;
        switch (Request.QueryString["app"].ToLower())
        {
            case "word":
                List<string> lines = new List<string>();
                foreach (ItemType it in MetaDataHandler.GetItemTypes())
                {
                    lines.Add(it.TypeName);
                    lines.Add("Attribute");
                    foreach (AttributeGroup ag in MetaDataHandler.GetAttributeGroupsAssignedToItemType(it.TypeId))
                    {
                        foreach (AttributeType at in MetaDataHandler.GetAttributeTypesForAttributeGroup(ag))
                        {
                            lines.Add(string.Format("{1} ({0})", ag.GroupName, at.TypeName));
                        }
                    }

                    lines.Add("Verbindungen");

                    foreach (ConnectionRule cr in MetaDataHandler.GetConnectionRulesByUpperItemType(it.TypeId))
                    {
                        lines.Add(string.Format("{0} {1}", MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeName, MetaDataHandler.GetItemType(cr.ItemLowerType).TypeName));
                    }
                }

                WriteWordDocument(lines.ToArray());
                break;
            case "excel":
            case "csv":
                System.Data.DataTable t = new System.Data.DataTable("ConfigurationItems");
                if (!string.IsNullOrWhiteSpace(Request.QueryString["type"]) && !string.IsNullOrWhiteSpace(Request.QueryString["scope"])) // Liste der Verbindungen/Links/Verantwortlichkeiten eines Objekts
                {
                    if (!Guid.TryParse(Request.QueryString["scope"], out guid))
                    {
                        Response.Write(string.Format("'{0}' ist keine g&uuml;ltige Guid", Request.QueryString["scope"]));
                        Response.End();
                        return;
                    }
                    r = DataHandler.GetConfigurationItem(guid);
                    if (r == null)
                    {
                        Response.Write(string.Format("Datensatz f&uuml;r '{0}' nicht gefunden", Request.QueryString["scope"]));
                        Response.End();
                        return;
                    }
                    switch (Request.QueryString["type"].ToLower())
                    {
                        case "connections":
                            t.Columns.Add("Item-Typ (oben)");
                            t.Columns.Add("Item-Name (oben)");
                            t.Columns.Add("Verbindungstyp");
                            t.Columns.Add("Item-Typ (unten)");
                            t.Columns.Add("Item-Name (unten)");

                            foreach (Connection cr in DataHandler.GetConnectionsToLowerForItem(guid))
                            {
                                ConfigurationItem lowerItem = DataHandler.GetConfigurationItem(cr.ConnLowerItem);
                                ConnectionType connType = MetaDataHandler.GetConnectionType(cr.ConnType);
                                t.Rows.Add(r.TypeName, r.ItemName, connType.ConnTypeName, lowerItem.TypeName, lowerItem.ItemName);
                            }
                            foreach (Connection cr in DataHandler.GetConnectionsToUpperForItem(guid))
                            {
                                ConfigurationItem upperItem = DataHandler.GetConfigurationItem(cr.ConnUpperItem);
                                ConnectionType connType = MetaDataHandler.GetConnectionType(cr.ConnType);
                                t.Rows.Add(upperItem.TypeName, upperItem.ItemName, connType.ConnTypeName, r.TypeName, r.ItemName);
                            }
                            break;
                        case "links":
                            t.Columns.Add("Item-Typ");
                            t.Columns.Add("Item-Name");
                            t.Columns.Add("Link-Adresse");
                            t.Columns.Add("Link-Beschreibung");
                            foreach (ItemLink link in DataHandler.GetLinksForConfigurationItem(guid))
                            {
                                t.Rows.Add(r.TypeName, r.ItemType, link.LinkURI, link.LinkDescription);
                            }
                            break;
                        case "responsibilities":
                            break;
                        default:
                            Response.Write(string.Format("Type '{0}' ist unbekannt", Request.QueryString["type"]));
                            Response.End();
                            return;
                    }
                }
                else if (Session["Scope"] != null && !string.IsNullOrWhiteSpace(Session["scope"].ToString())) // Scope wird im Session-Objekt übergeben -> Item-Liste mit Attributen erzeugen
                {
                    t.Columns.Add("Item-Name");
                    t.Columns.Add("Item-Typ");
                    string[] ids = Session["scope"].ToString().Split(',');
                    Session.Remove("scope");
                    foreach (string id in ids)
                    {
                        guid = Guid.NewGuid();
                        if (!Guid.TryParse(id, out guid))
                        {
                            Response.Write(string.Format("'{0}' ist keine g&uuml;ltige Guid", id));
                            Response.End();
                            return;
                        }
                        r = DataHandler.GetConfigurationItem(guid);
                        if (r == null)
                        {
                            Response.Write(string.Format("Datensatz f&uuml;r '{0}' nicht gefunden", id));
                            Response.End();
                            return;
                        }
                        System.Data.DataRow rx = t.Rows.Add(r.ItemName, r.TypeName);
                        // Attribute hinzufügen
                        foreach (ItemAttribute attr in DataHandler.GetAttributesForConfigurationItem(r.ItemId))
                        {
                            string attType = attr.AttributeTypeName;
                            if (!t.Columns.Contains(attType)) // Attributspalte hinzufügen, falls noch nicht geschehen
                                t.Columns.Add(attType);
                            rx[attType] = attr.AttributeValue;
                        }
                        // Einzel-Verbindungen hinzufügen
                        // zuerst abwärts
                        foreach (ConnectionRule crr in MetaDataHandler.GetConnectionRulesByUpperItemType(r.ItemType).Where(c => c.MaxConnectionsToLower == 1))
                        {
                            string s = string.Format("{0} {1}", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName, MetaDataHandler.GetItemType(crr.ItemLowerType).TypeName);
                            if (!t.Columns.Contains(s)) // Verbindungsspalte hinzufügen, falls noch nicht geschehen
                                t.Columns.Add(s);
                            try
                            {
                                rx[s] = DataHandler.GetConfigurationItem(DataHandler.GetConnectionsToLowerForItemAndRule(r.ItemId, crr.RuleId).First().ConnLowerItem).ItemName;
                            }
                            catch { }
                        }
                        // dann aufwärts
                        foreach (ConnectionRule crr in MetaDataHandler.GetConnectionRulesByLowerItemType(r.ItemType).Where(c => c.MaxConnectionsToUpper == 1))
                        {
                            string s = string.Format("{0} {1}", MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeReverseName, MetaDataHandler.GetItemType(crr.ItemUpperType).TypeName);
                            if (!t.Columns.Contains(s)) // Verbindungsspalte hinzufügen, falls noch nicht geschehen
                                t.Columns.Add(s);
                            try
                            {
                                rx[s] = DataHandler.GetConfigurationItem(DataHandler.GetConnectionsToUpperForItemAndRule(r.ItemId, crr.RuleId).First().ConnUpperItem).ItemName;
                            }
                            catch { }
                        }
                    }
                }
                else
                {
                    Response.Write("Falsche Parameterkombination.");
                    Response.End();
                    return;
                }
                if (Request.QueryString["app"].Equals("excel", StringComparison.CurrentCultureIgnoreCase))
                    this.WriteExcelXml(t);
                else if (Request.QueryString["app"].Equals("csv", StringComparison.CurrentCultureIgnoreCase))
                    this.WriteCsv(t);

                break;
            case "yed":
            case "graphml":
                GraphMLhelper h = new GraphMLhelper(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", "GraphMLBase.xml"));
                List<Guid> itemTypes = new List<Guid>(),
                    connectionTypes = new List<Guid>();
                guid = Guid.NewGuid();
                int levels;
                string xml;
                if (Request.QueryString["scope"].Equals("all", StringComparison.CurrentCultureIgnoreCase))
                {
                    xml = h.GraphMLExportAll().OuterXml;
                }
                else if (Request.QueryString["scope"].Equals("meta", StringComparison.CurrentCultureIgnoreCase))
                {
                    xml = h.GraphMLExportMeta(MetaDataHandler.GetConnectionTypes().Select(a => a.ConnTypeId).ToList()).OuterXml;
                }
                else
                {
                    if (!Guid.TryParse(Request.QueryString["scope"], out guid))
                    {
                        Response.Write(string.Format("'{0}' ist keine g&uuml;ltige Guid", Request.QueryString["scope"]));
                        Response.End();
                        return;
                    }
                    r = DataHandler.GetConfigurationItem(guid);
                    if (r == null)
                    {
                        Response.Write(string.Format("Datensatz f&uuml;r '{0}' nicht gefunden", Request.QueryString["scope"]));
                        Response.End();
                        return;
                    }
                    if (Request.QueryString["levels"].Equals("all", StringComparison.InvariantCultureIgnoreCase))
                        levels = int.MaxValue;
                    else
                        if (!int.TryParse(Request.QueryString["levels"], out levels))
                    {
                        Response.Write(string.Format("'{0}' ist keine gültige Anzahl für levels", Request.QueryString["levels"]));
                        Response.End();
                        return;
                    }
                    itemTypes.AddRange(MetaDataHandler.GetItemTypes().Select(a => a.TypeId));
                    connectionTypes.AddRange(MetaDataHandler.GetConnectionTypes().Select(a => a.ConnTypeId));
                    xml = h.GraphMLExportPartial(r, itemTypes, connectionTypes, levels, levels, false).OuterXml;
                }
                Response.ContentType = "application/graphml+xml; charset=Windows-1252";
                Response.AddHeader("Content-Disposition", "attachment; filename=GraphMLexport.graphml");
                Response.AddHeader("Content-Length", xml.Length.ToString());
                this.Response.ContentEncoding = System.Text.Encoding.Default;
                Response.Write(xml);
                Response.Flush();
                Response.End();
                break;
            default:
                Response.Write(string.Format("Applikation '{0}' nicht gefunden", Request.QueryString["app"]));
                Response.End();
                break;
        }
    }

    private void WriteWordDocument(string[] lines)
    {
        using (MemoryStream memStream = new MemoryStream())
        {
            WordHelper wh = new WordHelper();
            wh.CreateAndWordDocumentToStream(memStream, lines);
            Response.AppendHeader("content-length", memStream.Length.ToString());
            Response.AppendHeader("Content-Disposition", "attachment;filename=WordExport.docx");
            Response.ContentType = "application/vnd.ms-word.document";
            memStream.WriteTo(Response.OutputStream);
            Response.End();
        }
    }

    private void WriteCsv(System.Data.DataTable t)
    {
        const string separator = ";";
        Response.ContentType = "text/comma-separated-values";
        Response.AppendHeader("Content-Disposition", "attachment; filename = Export.csv");
        // Überschriften
        List<string> line = new List<string>(t.Columns.Count);
        foreach (System.Data.DataColumn col in t.Columns)
        {
            line.Add(col.Caption);
        }
        Response.Write(string.Join(separator, line.ToArray()) + "\n");

        // Zeilen hinzufügen
        for (int i = 0; i < t.Rows.Count; i++)
        {
            line = new List<string>(t.Columns.Count);
            for (int j = 0; j < t.Columns.Count; j++)
            {
                line.Add(t.Rows[i][j].ToString());
            }
            Response.Write(string.Join(separator, line.ToArray()) + "\n");
        }
        // Ausgabe abschliessen
        Response.End();
    }

    private void WriteExcelXml(System.Data.DataTable t)
    {
        Response.ContentType = "application/octet-stream";
        Response.AppendHeader("Content-Disposition", "attachment; filename = ExcelExport.xlsx");
        Response.Charset = "";
        Response.Buffer = true;
        using (MemoryStream memStream = new MemoryStream())
        {
            ExcelHelper.CreateExcelDocumentFromDataTable(memStream, new List<System.Data.DataTable>() { t });
            Response.AppendHeader("content-length", memStream.Length.ToString());
            memStream.WriteTo(Response.OutputStream);
            Response.End();
        }
        return;
    }

    /// <summary>
    /// Überladen: Erstellt ein Excel-Cell-element mit dem angegebenen Inhalt und Stil
    /// </summary>
    /// <param name="xdoc">XML-Document, mit dem gearbeitet wird</param>
    /// <param name="content">Inhalt der Zelle</param>
    /// <param name="style">Style-ID, wie sie in der Vorlage definiert ist</param>
    private static XmlNode CreateCell(XmlDocument xdoc, string content, string style)
    {
        XmlNode cell = CreateCell(xdoc, content);
        XmlAttribute xattr = xdoc.CreateAttribute("ss:StyleID", "urn:schemas-microsoft-com:office:spreadsheet");
        xattr.Value = style;
        cell.Attributes.Append(xattr);
        return cell;
    }

    /// <summary>
    /// Überladen: Erstellt ein Excel-Cell-element mit dem angegebenen Inhalt
    /// </summary>
    /// <param name="xdoc">XML-Document, mit dem gearbeitet wird</param>
    /// <param name="content">Inhalt der Zelle</param>
    private static XmlNode CreateCell(XmlDocument xdoc, string content)
    {
        XmlNode cell = xdoc.CreateElement("ss:Cell", "urn:schemas-microsoft-com:office:spreadsheet");
        XmlNode data = xdoc.CreateElement("ss:Data", "urn:schemas-microsoft-com:office:spreadsheet");
        XmlAttribute xattr = xdoc.CreateAttribute("ss:Type", "urn:schemas-microsoft-com:office:spreadsheet");
        xattr.Value = "String";
        data.Attributes.Append(xattr);
        data.AppendChild(xdoc.CreateTextNode(content));
        cell.AppendChild(data);
        XmlNode namedCell = xdoc.CreateElement("ss:NamedCell", "urn:schemas-microsoft-com:office:spreadsheet");
        xattr = xdoc.CreateAttribute("ss:Name", "urn:schemas-microsoft-com:office:spreadsheet");
        xattr.Value = "_FilterDatabase";
        namedCell.Attributes.Append(xattr);
        cell.AppendChild(namedCell);
        return cell;
    }
}