using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using CmdbDataAccess;
using CmdbAPI.ExportHelper;

namespace CmdbEditor
{
    /// <summary>
    /// Interaktionslogik für NavigatorWindow.xaml
    /// </summary>
    public partial class NavigatorWindow : Window
    {
        private CMDBDataSet.ConfigurationItemsRow itemRow;
        private CmdbDataAccessComponent da = CmdbDataAccessComponent.GetInstance();
        private List<GraphItemWpf> lstGraph = new List<GraphItemWpf>();

        public NavigatorWindow(CMDBDataSet.ConfigurationItemsRow r)
        {
            this.itemRow = r;
            InitializeComponent();
            showItemDependenciesGraphic();
        }

        public NavigatorWindow(Guid itemId)
        {
            this.itemRow = this.da.Dataset.ConfigurationItems.FindByItemId(itemId);
            if (this.itemRow == null)
                throw new Exception(string.Format("Kein Configuration Item mit der ID {0} gefunden", itemId));
            InitializeComponent();
            showItemDependenciesGraphic();
        }

        /// <summary>
        /// Erzeugt die Ansicht für die Abhängigkeiten des aktuellen Items von anderen Items, bezogen auf die Regeln
        /// </summary>
        /// <param name="itemRow"></param>
        private void showItemDependenciesGraphic()
        {
            this.Title = string.Format("Grafische Ansicht für {0}: {1}", this.itemRow.TypeName, this.itemRow.ItemName);
            GraphItemWpf graph = new GraphItemWpf(this.itemRow, getBackgroundColor(this.itemRow), GraphDirection.Both, 0, false);
            lstGraph.Add(graph);
            List<Dictionary<string, string>> users = new List<Dictionary<string, string>>();
            foreach (CMDBDataSet.ResponsibilityRow rr in this.da.Dataset.Responsibility.Where(a => a.ItemId.Equals(this.itemRow.ItemId)))
            {
                users.Add(ADSHelper.GetUserProperties(ADSHelper.GetBase64SIDFromUserName(rr.ResponsibleToken)));
            }
            graph.AddAttributesAndLinksAndResponsible(createAttributeList(this.da.getAttributesForItem(this.itemRow.ItemId)), this.da.getItemLinksForItem(this.itemRow.ItemId), users.ToArray());
            foreach (CMDBDataSet.ConnectionsRow cr in da.Dataset.Connections.Select(string.Format("ConnUpperItem = '{0}'", this.itemRow.ItemId)))
            {
                CMDBDataSet.ConfigurationItemsRow r = this.da.Dataset.ConfigurationItems.FindByItemId(cr.ConnLowerItem);
                GraphItemWpf subgraph = this.createGraphObject(r, 1, GraphDirection.Downward);
                lstGraph.Add(subgraph);
                GraphLineWpf gl = new GraphLineWpf(cr.ConnId, graph, subgraph, this.da.Dataset.ConnectionTypes.FindByConnTypeId(cr.ConnType).ConnTypeName);

            }
            foreach (CMDBDataSet.ConnectionsRow cr in da.Dataset.Connections.Select(string.Format("ConnLowerItem = '{0}'", this.itemRow.ItemId)))
            {
                CMDBDataSet.ConfigurationItemsRow r = this.da.Dataset.ConfigurationItems.FindByItemId(cr.ConnUpperItem);
                GraphItemWpf subgraph = createGraphObject(r, -1, GraphDirection.Upward);
                lstGraph.Add(subgraph);
                GraphLineWpf gl = new GraphLineWpf(cr.ConnId, subgraph, graph, this.da.Dataset.ConnectionTypes.FindByConnTypeId(cr.ConnType).ConnTypeName);
            }
            CreateChart();
        }

        private GraphItemWpf createGraphObject(CMDBDataSet.ConfigurationItemsRow r, int level, GraphDirection direction)
        {
            bool hasMoreConnectionsInThisDirection = direction == GraphDirection.Upward ? 
                (da.Dataset.Connections.Where(a => a.ConnLowerItem == r.ItemId).Count() > 0) : (da.Dataset.Connections.Where(a => a.ConnUpperItem == r.ItemId).Count() > 0);
            GraphItemWpf subgraph = new GraphItemWpf(r, this.getBackgroundColor(r), direction, level, hasMoreConnectionsInThisDirection);
            if (hasMoreConnectionsInThisDirection) // Objekt erweiterbar?
            {
                subgraph.ExpandAll += GraphObject_ExpandAll;
                subgraph.Expand += GraphObject_Expand;
                subgraph.CenterNewWindow += GraphObject_CenterNewWindow;
            }
            List<Dictionary<string, string>> users = new List<Dictionary<string, string>>();
            foreach (CMDBDataSet.ResponsibilityRow rr in this.da.Dataset.Responsibility.Where(a => a.ItemId.Equals(r.ItemId)))
            {
                users.Add(ADSHelper.GetUserProperties(ADSHelper.GetBase64SIDFromUserName(rr.ResponsibleToken)));
            }
            subgraph.AddAttributesAndLinksAndResponsible(createAttributeList(this.da.getAttributesForItem(r.ItemId)), this.da.getItemLinksForItem(r.ItemId), users.ToArray());
            return subgraph;
        }

        private void GraphObject_CenterNewWindow(object sender, EventArgs e)
        {
            NavigatorWindow w = new NavigatorWindow(((GraphItemWpf)sender).OwnId);
            w.Show();
        }

        private void GraphObject_ExpandAll(object sender, EventArgs e)
        {
            GraphItemWpf graph = (GraphItemWpf)sender;
            switch (graph.Direction)
            {
                case GraphDirection.Downward:
                    foreach (CMDBDataSet.ConnectionsRow cr in da.Dataset.Connections.Select(string.Format("ConnUpperItem = '{0}'", graph.OwnId)))
                    {
                        CMDBDataSet.ConfigurationItemsRow r = this.da.Dataset.ConfigurationItems.FindByItemId(cr.ConnLowerItem);
                        bool hasMoreConnectionsInThisDirection = da.Dataset.Connections.Where(a => a.ConnUpperItem == r.ItemId).Count() > 0;
                        GraphItemWpf subgraph = this.createGraphObject(r, graph.Level + 1, graph.Direction);
                        this.lstGraph.Add(subgraph);
                        GraphLineWpf gl = new GraphLineWpf(cr.ConnId, graph, subgraph, this.da.Dataset.ConnectionTypes.FindByConnTypeId(cr.ConnType).ConnTypeName);
                        subgraph.ExpandAllSubs();
                    }
                    break;
                case GraphDirection.Upward:
                    foreach (CMDBDataSet.ConnectionsRow cr in da.Dataset.Connections.Select(string.Format("ConnLowerItem = '{0}'", graph.OwnId)))
                    {
                        CMDBDataSet.ConfigurationItemsRow r = this.da.Dataset.ConfigurationItems.FindByItemId(cr.ConnUpperItem);
                        bool hasMoreConnectionsInThisDirection = da.Dataset.Connections.Where(a => a.ConnLowerItem == r.ItemId).Count() > 0;
                        GraphItemWpf subgraph = this.createGraphObject(r, graph.Level - 1, graph.Direction);
                        this.lstGraph.Add(subgraph);
                        GraphLineWpf gl = new GraphLineWpf(cr.ConnId, subgraph, graph, this.da.Dataset.ConnectionTypes.FindByConnTypeId(cr.ConnType).ConnTypeName);
                        subgraph.ExpandAllSubs();
                    }
                    break;
            }
            CreateChart();
        }

        private void GraphObject_Expand(object sender, EventArgs e)
        {
            GraphItemWpf graph = (GraphItemWpf)sender;
            switch (graph.Direction)
            {
                case GraphDirection.Downward:
                    foreach (CMDBDataSet.ConnectionsRow cr in da.Dataset.Connections.Select(string.Format("ConnUpperItem = '{0}'", graph.OwnId)))
                    {
                        CMDBDataSet.ConfigurationItemsRow r = this.da.Dataset.ConfigurationItems.FindByItemId(cr.ConnLowerItem);
                        bool hasMoreConnectionsInThisDirection = da.Dataset.Connections.Where(a => a.ConnUpperItem == r.ItemId).Count() > 0;
                        GraphItemWpf subgraph = this.createGraphObject(r, graph.Level + 1, GraphDirection.Downward);
                        this.lstGraph.Add(subgraph);
                        GraphLineWpf gl = new GraphLineWpf(cr.ConnId, graph, subgraph, this.da.Dataset.ConnectionTypes.FindByConnTypeId(cr.ConnType).ConnTypeName);

                    }
                    break;
                case GraphDirection.Upward:
                    foreach (CMDBDataSet.ConnectionsRow cr in da.Dataset.Connections.Select(string.Format("ConnLowerItem = '{0}'", graph.OwnId)))
                    {
                        CMDBDataSet.ConfigurationItemsRow r = this.da.Dataset.ConfigurationItems.FindByItemId(cr.ConnUpperItem);
                        bool hasMoreConnectionsInThisDirection = da.Dataset.Connections.Where(a => a.ConnLowerItem == r.ItemId).Count() > 0;
                        GraphItemWpf subgraph = this.createGraphObject(r, graph.Level - 1, GraphDirection.Upward);
                        this.lstGraph.Add(subgraph);
                        GraphLineWpf gl = new GraphLineWpf(cr.ConnId, subgraph, graph, this.da.Dataset.ConnectionTypes.FindByConnTypeId(cr.ConnType).ConnTypeName);
                    }
                    break;
            }
            CreateChart();
        }

        /// <summary>
        /// Erzeugt ein String-Array mit den Attributen aus den Datenzeilen
        /// </summary>
        /// <param name="l">Liste der Attribute</param>
        /// <returns>String-Array</returns>
        private string[] createAttributeList(IEnumerable<CMDBDataSet.ItemAttributesRow> l)
        {
            List<string> lstAttributes = new List<string>(l.Count());
            foreach (CMDBDataSet.ItemAttributesRow r in l)
            {
                lstAttributes.Add(string.Format("{0}: {1}", r.AttributeTypeName, r.AttributeValue));
            }
            return lstAttributes.ToArray(); ;
        }

        /// <summary>
        /// Gibt die Hintergrundfarbe zu einem angegebenen Configuration Item zurück
        /// </summary>
        /// <param name="r">Configuration Item-Datensatz</param>
        /// <returns>Farbe</returns>
        private string getBackgroundColor(CMDBDataSet.ConfigurationItemsRow r)
        {
            return da.Dataset.ItemTypes.FindByTypeId(r.ItemType).TypeBackColor;
        }

        private void CreateChart()
        {
            int minLevel = lstGraph.Aggregate((a, b) => a.Level < b.Level ? a : b).Level,
                maxLevel = lstGraph.Aggregate((a, b) => a.Level > b.Level ? a : b).Level;

            double[] maximumHeights = new double[maxLevel - minLevel + 1],
                maximumWidths = new double[maxLevel - minLevel + 1],
                levelWidths = new double[maxLevel - minLevel + 1];
            double xOffset = GraphItemWpf.Margin, yOffset = GraphItemWpf.Margin, maxLevelWidth = 0, overallHeight = 0;

            // Höhe und Breite ermitteln
            for (int i = 0; i <= maxLevel - minLevel; i++)
            {
                maximumHeights[i] = lstGraph.Where(a => a.Level == i + minLevel).Aggregate((a, b) => a.Height > b.Height ? a : b).Height;
                maximumWidths[i] = lstGraph.Where(a => a.Level == i + minLevel).Aggregate((a, b) => a.Width > b.Width ? a : b).Width;
                overallHeight += maximumHeights[i] + 4 * GraphItemWpf.Margin;
                //IEnumerable<double> widths = (from g in lstGraph where g.Level == i + minLevel select g.Width);
                levelWidths[i] = (maximumWidths[i] + 3 * GraphItemWpf.Margin) * lstGraph.Where(a => a.Level == i + minLevel).Count(); // widths.Sum() + 3 * widths.Count() * GraphObject.Margin;

                if (maxLevelWidth < levelWidths[i])
                    maxLevelWidth = levelWidths[i];

            }


            // Leinwand löschen vor Neubeginn
            cnvDependencies.Children.Clear();

            // Levelweise die Kästchen zeichnen und jeweils oberhalb die Linien ziehen
            for (int i = 0; i <= maxLevel - minLevel; i++)
            {
                // Jeweilige Zeile zentrieren
                xOffset = (maxLevelWidth - levelWidths[i]) / 2;
                foreach (GraphItemWpf g in lstGraph.Where(a => a.Level == i + minLevel))
                {
                    g.AddToCanvas(cnvDependencies, xOffset, yOffset, maximumWidths[i], maximumHeights[i]);
                    xOffset += g.Width + 3 * GraphItemWpf.Margin;
                    foreach (GraphLineWpf line in g.ConnectionsToUpper)
                    {
                        line.SetPosition(line.OriginObject.Left + line.OriginObject.Width * (line.OriginPosition + 1) / (line.OriginObject.ConnectionsToLower.Count() + 1),
                            line.OriginObject.Top + line.OriginObject.Height,
                            g.Left + g.Width * (line.TargetPosition + 1) / (g.ConnectionsToUpper.Count() + 1), g.Top);
                        line.AddToCanvas(cnvDependencies);
                    }
                }
                yOffset += maximumHeights[i] + 5 * GraphItemWpf.Margin;
            }

            cnvDependencies.Width = maxLevelWidth + 2 * GraphItemWpf.Margin;
            cnvDependencies.Height = overallHeight;
            this.Height = cnvDependencies.Height + 100;
            if (this.Height > System.Windows.SystemParameters.PrimaryScreenHeight - 50)
                this.Height = System.Windows.SystemParameters.PrimaryScreenHeight - 50;
            this.Width = cnvDependencies.Width + 50;
            if (this.Width > System.Windows.SystemParameters.PrimaryScreenWidth - 50)
                this.Width = System.Windows.SystemParameters.PrimaryScreenWidth - 50;
            

        }

        private void btnPrint_Click(object sender, RoutedEventArgs e)
        {
            PrintDialog p = new PrintDialog();
            if (p.ShowDialog() == false)
                return;
            double pagemargin = 20;
            DockPanel dp = new DockPanel();
            dp.LastChildFill = true;
            TextBlock tb = WpfHelper.createTextBlock(this.Title, new Thickness(10, 10, 10, 10), FontWeights.Bold);
            tb.FontFamily = this.FontFamily;
            tb.FontSize = 20;
            tb.Margin = new Thickness(10, 30, 10, 10);
            Border b = WpfHelper.createBorder(new Thickness(0, 0, 0, 2), Brushes.Black, System.Windows.HorizontalAlignment.Center, System.Windows.VerticalAlignment.Top, tb);
            b.Measure(new Size(double.PositiveInfinity, double.PositiveInfinity));
            dp.Children.Add(b);
            DockPanel.SetDock(b, Dock.Top);
            tb = WpfHelper.createTextBlock(string.Format("Erzeugt: {0}", DateTime.Now.ToString()), new Thickness(5, 5, 5, 5));
            tb.Measure(new Size(double.PositiveInfinity, double.PositiveInfinity));
            dp.Children.Add(tb);
            DockPanel.SetDock(tb, Dock.Bottom);
            Canvas c2 = (Canvas)WpfHelper.CloneUIElement(cnvDependencies);
            c2.LayoutTransform = null;
            dp.Children.Add(c2);
            dp.Measure(new Size(double.PositiveInfinity, double.PositiveInfinity));
            double scale = Math.Min((p.PrintableAreaWidth - 2 * pagemargin) / dp.DesiredSize.Width, (p.PrintableAreaHeight - 2 * pagemargin) / dp.DesiredSize.Height);
            if (dp.DesiredSize.Width > p.PrintableAreaWidth - 2 * pagemargin && dp.DesiredSize.Width > dp.DesiredSize.Height)
            {
                scale = Math.Min(p.PrintableAreaHeight / dp.DesiredSize.Width, p.PrintableAreaWidth / dp.DesiredSize.Height);
                dp.LayoutTransform = new RotateTransform(90, dp.DesiredSize.Width / 2, dp.DesiredSize.Height / 2);
            }
            if (scale < 1)
                dp.RenderTransform = new ScaleTransform(scale, scale);
            Size pageSize = new Size(p.PrintableAreaWidth - 2 * pagemargin, p.PrintableAreaHeight - 2 * pagemargin);
            dp.Measure(pageSize);
            dp.Arrange(new Rect(new Point(pagemargin, pagemargin), pageSize));
            System.Diagnostics.Debug.WriteLine("W: {0}, H: {1}, S:{2}", dp.DesiredSize.Width, dp.DesiredSize.Height, scale);
            p.PrintVisual(dp, "CMDB-Editor: " + this.Title);
        }

        private void Slider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            if (this.cnvDependencies != null)
            {
                this.cnvDependencies.LayoutTransform = new ScaleTransform(e.NewValue, e.NewValue);
                txtZoom.Text = Convert.ToString(Math.Round(e.NewValue * 100));
            }
        }

        private void MenuButton_Click(object sender, RoutedEventArgs e)
        {
            Button b = (Button)sender;
            if (b.ContextMenu != null)
            {
                b.ContextMenu.PlacementTarget = b;
                b.ContextMenu.Placement = System.Windows.Controls.Primitives.PlacementMode.Bottom;
                b.ContextMenu.IsOpen = true;
            }
        }

        private void miCopyToClipboard_Click(object sender, RoutedEventArgs e)
        {
            WpfHelper.CopyUIElementToClipboard(cnvDependencies);
        }

        private void miExportToPowerpoint_Click(object sender, RoutedEventArgs e)
        {
            OfficeHelper.CreatePowerpointFromGraphObjectList(lstGraph);
        }

        private void miExportToVisio_Click(object sender, RoutedEventArgs e)
        {
            OfficeHelper.CreateVisioFromGraphObjectList(lstGraph);
        }
    }
}
