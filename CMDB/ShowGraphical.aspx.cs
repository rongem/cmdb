using CmdbAPI.BusinessLogic;
using CmdbHelpers.ExportHelper;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CmdbAPI.Security;

public partial class ShowGraphical : System.Web.UI.Page
{
    private const string objects = "graphObjects";
    private List<GraphItem> lstGraph;
    private Guid id;
    private ConfigurationItem item;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace(Request.QueryString["id"]) || !Guid.TryParse(Request.QueryString["id"], out id))
        {
            Response.Redirect("~/Default.aspx", true);
            return;
        }
        item = DataHandler.GetConfigurationItem(id);
        if (item == null)
        {
            Response.Redirect("~/Default.aspx", true);
            return;
        }
        Title = string.Format("Grafische Ansicht für {0}: {1}", item.TypeName, item.ItemName);
        headLine.InnerText = string.Format("{0}: {1}", item.TypeName, item.ItemName);
        if (ViewState[objects] != null)
        {
            lstGraph = (List<GraphItem>)ViewState[objects];
        }
        else
        {
            lstGraph = new List<GraphItem>();
            GraphItem graph = new GraphItem(item.ItemId, item.TypeName, item.ItemName, MetaDataHandler.GetItemType(this.item.ItemType).TypeBackColor, GraphDirection.Both, 0, false);
            lstGraph.Add(graph);
            List<ADSHelper.UserObject> users = new List<ADSHelper.UserObject>();
            foreach (ItemResponsibility rr in DataHandler.GetResponsibilitesForConfigurationItem(id))
            {
                users.Add(ADSHelper.GetUserProperties(rr.ResponsibleToken));
            }
            foreach (Connection cr in DataHandler.GetConnectionsToLowerForItem(id))
            {
                ConfigurationItem r = DataHandler.GetConfigurationItem(cr.ConnLowerItem);
                GraphItem subgraph = createGraphObject(r, 1, GraphDirection.Downward);
                lstGraph.Add(subgraph);
                GraphLine gl = new GraphLine(cr.ConnId, graph, subgraph, MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeName);

            }
            foreach (Connection cr in DataHandler.GetConnectionsToUpperForItem(id))
            {
                ConfigurationItem r = DataHandler.GetConfigurationItem(cr.ConnUpperItem);
                GraphItem subgraph = createGraphObject(r, -1, GraphDirection.Upward);
                lstGraph.Add(subgraph);
                GraphLine gl = new GraphLine(cr.ConnId, subgraph, graph, MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeName);
            }
            ViewState.Add(objects, lstGraph);
        }
        CreateChart();
    }

    private GraphItem createGraphObject(ConfigurationItem ci, int level, GraphDirection direction)
    {
        bool hasMoreConnectionsInThisDirection = direction == GraphDirection.Upward ?
            (DataHandler.GetConnectionsToUpperForItem(ci.ItemId).Count() > 0) : (DataHandler.GetConnectionsToLowerForItem(ci.ItemId).Count() > 0);
        GraphItem subgraph = new GraphItem(ci.ItemId, ci.TypeName, ci.ItemName, MetaDataHandler.GetItemType(ci.ItemType).TypeBackColor, direction, level, hasMoreConnectionsInThisDirection);
        return subgraph;
    }

    private void CreateChart()
    {
        int minLevel = lstGraph.Aggregate((a, b) => a.Level < b.Level ? a : b).Level,
            maxLevel = lstGraph.Aggregate((a, b) => a.Level > b.Level ? a : b).Level;

        double[] maximumHeights = new double[maxLevel - minLevel + 1],
            levelWidths = new double[maxLevel - minLevel + 1];
        double xOffset = GraphItem.Margin, yOffset = GraphItem.Margin, maxLevelWidth = 0, overallHeight = 0;

        // Höhe und Breite ermitteln
        for (int i = 0; i <= maxLevel - minLevel; i++)
        {
            maximumHeights[i] = Math.Ceiling(lstGraph.Where(a => a.Level == i + minLevel).Aggregate((a, b) => a.Height > b.Height ? a : b).Height);
            overallHeight += maximumHeights[i] + 8 * GraphItem.Margin;
            levelWidths[i] = Math.Ceiling(lstGraph.Where(a => a.Level == i + minLevel).Sum(a => a.Width)
                + (6 * GraphItem.Margin * lstGraph.Where(a => a.Level == i + minLevel).Count()));

            if (maxLevelWidth < levelWidths[i])
                maxLevelWidth = levelWidths[i];

        }
        overallHeight += 40; // Überschrift hinzufügen

        // Writer für die Aggregierung der Inhalte nutzen
        System.IO.StringWriter swDiv = new System.IO.StringWriter(),
            swLine = new System.IO.StringWriter();
        HtmlTextWriter writerDiv = new HtmlTextWriter(swDiv);

        // JavaScript für die Linien vorbereiten
        swLine.WriteLine("<script type=\"text/javascript\">");
        swLine.WriteLine("function drawShape() {");
        swLine.WriteLine("  var canvas = document.getElementById('cnv');");
        swLine.WriteLine("  if (canvas.getContext) {");
        swLine.WriteLine(string.Format("    canvas.width={0};", maxLevelWidth));
        swLine.WriteLine(string.Format("    canvas.height={0};", overallHeight));
        swLine.WriteLine("    var ctx = canvas.getContext('2d');");

        // Levelweise die Kästchen zeichnen und jeweils oberhalb die Linien ziehen
        for (int i = 0; i <= maxLevel - minLevel; i++)
        {
            // Jeweilige Zeile zentrieren
            xOffset = Math.Ceiling((maxLevelWidth - levelWidths[i]) / 2);
            foreach (GraphItem g in lstGraph.Where(a => a.Level == i + minLevel))
            {
                g.SetPosition(xOffset, yOffset);
                g.Height = maximumHeights[i];
                //GetHtmlGraphObject(writerDiv, g, xOffset, yOffset, g.Width, maximumHeights[i]);
                LinkButton b = new LinkButton();
                b.Text = g.Caption.Replace("\r\n", "<br/>");
                b.Style.Add(HtmlTextWriterStyle.Top, string.Format("{0}px", yOffset));
                b.Style.Add(HtmlTextWriterStyle.Left, string.Format("{0}px", xOffset));
                b.Style.Add(HtmlTextWriterStyle.Width, string.Format("{0}px", Math.Ceiling(g.Width)));
                b.Style.Add("height", string.Format("{0}px", Math.Ceiling(maximumHeights[i])));
                b.Style.Add(HtmlTextWriterStyle.BackgroundColor, g.ColorHtml);
                b.CssClass = "graphItem";
                b.CommandArgument = g.GetHashCode().ToString();
                b.Click += btnGraph_Click;
                pnlContent.Controls.Add(b);
                xOffset += Math.Ceiling(g.Width + 6 * GraphItem.Margin);
                foreach (GraphLine line in g.ConnectionsToUpper) // Linien ziehen
                {
                    double topX = Math.Round(line.OriginObject.Left + line.OriginObject.Width * (line.OriginPosition + 1) / (line.OriginObject.ConnectionsToLower.Count() + 1)),
                        topY = Math.Round(line.OriginObject.Top + line.OriginObject.Height),
                        bottomX = Math.Round(g.Left + g.Width * (line.TargetPosition + 1) / (g.ConnectionsToUpper.Count() + 1)),
                        bottomY = Math.Round(g.Top);
                    swLine.WriteLine("    ctx.beginPath();");
                    swLine.WriteLine(string.Format("    ctx.moveTo({0},{1});", topX, topY));
                    swLine.WriteLine(string.Format("    ctx.lineTo({0},{1});", topX, Math.Round(topY + Math.Abs(topY - bottomY) / 2 - (1.5 * GraphItem.Margin))));
                    swLine.WriteLine(string.Format("    ctx.lineTo({0},{1});", bottomX, Math.Round(topY + Math.Abs(topY - bottomY) / 2 + (1.5 * GraphItem.Margin))));
                    swLine.WriteLine(string.Format("    ctx.lineTo({0},{1});", bottomX, bottomY));
                    swLine.WriteLine("    ctx.stroke();");
                }
            }
            yOffset += Math.Ceiling(maximumHeights[i] + 8 * GraphItem.Margin);
        }
        // Javascript beenden
        swLine.WriteLine("  } else {");
        swLine.WriteLine("    alert('You need a HTML5-capable browser to see the lines');");
        swLine.WriteLine("  }");
        swLine.WriteLine("}");
        swLine.WriteLine("</script>");

        // Script schreiben
        headLiteral.Text = swLine.ToString();



    }

    protected void btnGraph_Click(object sender, EventArgs e)
    {
        //Guid id = Guid.Parse(((LinkButton)sender).CommandArgument);
        int id = int.Parse(((LinkButton)sender).CommandArgument);
        try
        {
            GraphItem g = ((List<GraphItem>)ViewState[objects]).Single(a => a.GetHashCode().Equals(id)); // Objekt holen, das den Click ausgelöst hat
            mContext.Items.Clear();
            MenuItem miAttributes = new MenuItem("Attribute ansehen");
            foreach (ItemAttribute attr in DataHandler.GetAttributesForConfigurationItem(g.OwnId))
            {
                miAttributes.ChildItems.Add(new MenuItem(string.Format("{0}: {1}", attr.AttributeTypeName, attr.AttributeValue)) { Enabled = false });
            }
            if (miAttributes.ChildItems.Count > 0)
                mContext.Items.Add(miAttributes);
            MenuItem miLinks = new MenuItem("Links verfolgen");
            foreach (ItemLink lr in DataHandler.GetLinksForConfigurationItem(g.OwnId))
            {
                miLinks.ChildItems.Add(new MenuItem(lr.LinkDescription, string.Empty, string.Empty, lr.LinkURI, "_blank"));
            }
            if (miLinks.ChildItems.Count > 0)
                mContext.Items.Add(miLinks);
            MenuItem miResponsible = new MenuItem("Verantwortliche anschreiben");
            foreach (ItemResponsibility rr in DataHandler.GetResponsibilitesForConfigurationItem(g.OwnId))
            {
                ADSHelper.UserObject user = ADSHelper.GetUserProperties(rr.ResponsibleToken);
                if (user.mail == "unknown" || user.mail == "(unbekannt)")
                {
                    miResponsible.ChildItems.Add(new MenuItem(user.displayname) { Enabled = false });
                }
                else
                    miResponsible.ChildItems.Add(new MenuItem(user.displayname, string.Empty, string.Empty,
                        string.Format("mailto:{0}?subject={1}", user.mail,
                        g.Caption.Replace("\r\n", " "))));
            }
            if (miResponsible.ChildItems.Count > 0)
                mContext.Items.Add(miResponsible);

            if (g.Direction != GraphDirection.Both)
            {
                mContext.Items.Add(new MenuItem("Item in neuem Fenster zentrieren", string.Empty, string.Empty,
                    VirtualPathUtility.ToAbsolute(string.Format("~/ShowGraphical.aspx?id={0}", g.OwnId)), "_blank"));
                if (g.HasFollowers)
                    mContext.Items.Add(new MenuItem("Verbundene CIs ansehen " + (g.Direction == GraphDirection.Upward ? "(aufwärts)" : "(abwärts)"), g.OwnId.ToString()));
            }
            mContext.Style.Add(HtmlTextWriterStyle.Top, string.Format("{0}px", Math.Ceiling(g.Top + g.Height)));
            mContext.Style.Add(HtmlTextWriterStyle.Left, string.Format("{0}px", Math.Ceiling(g.Left)));

        }
        catch (Exception)
        {
            foreach (GraphItem g in ((List<GraphItem>)ViewState[objects]))
            {
                System.Diagnostics.Debug.WriteLine(g.GetHashCode());
            }
        }
    }

    protected void mContext_MenuItemClick(object sender, MenuEventArgs e)
    {
        Guid id;
        if (!Guid.TryParse(e.Item.Value, out id))
            return;
        GraphItem graph = lstGraph.Single(a => a.OwnId.Equals(id)); // Objekt holen, das den Click ausgelöst hat
        switch (graph.Direction)
        {
            case GraphDirection.Downward:
                foreach (Connection cr in DataHandler.GetConnectionsToLowerForItem(graph.OwnId))
                {
                    ConfigurationItem r = DataHandler.GetConfigurationItem(cr.ConnLowerItem);
                    GraphItem subgraph = this.createGraphObject(r, graph.Level + 1, GraphDirection.Downward);
                    lstGraph.Add(subgraph);
                    GraphLine gl = new GraphLine(cr.ConnId, graph, subgraph, MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeName);
                }
                break;
            case GraphDirection.Upward:
                foreach (Connection cr in DataHandler.GetConnectionsToUpperForItem(graph.OwnId))
                {
                    ConfigurationItem r = DataHandler.GetConfigurationItem(cr.ConnUpperItem);
                    GraphItem subgraph = this.createGraphObject(r, graph.Level - 1, GraphDirection.Upward);
                    lstGraph.Add(subgraph);
                    GraphLine gl = new GraphLine(cr.ConnId, subgraph, graph, MetaDataHandler.GetConnectionType(cr.ConnType).ConnTypeName);
                }
                break;
        }
        graph.HasFollowers = false;
        ViewState.Add(objects, lstGraph);
        while (pnlContent.Controls.Count > 1)
            pnlContent.Controls.RemoveAt(1);
        CreateChart();
        ClientScript.RegisterStartupScript(this.GetType(), "RedrawLines", "drawShape();", true);
    }
}