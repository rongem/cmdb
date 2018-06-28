using CmdbDataAccess;
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Media;

namespace CmdbDataAccess
{
    public class GraphMLhelper
    {
        private CmdbDataAccessComponent da = CmdbDataAccessComponent.GetInstance();

        private string graphMlBase;

        public GraphMLhelper()
        {
            this.graphMlBase = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources", "GraphMLBase.xml");
        }

        public GraphMLhelper(string graphMlBaseFile)
        {
            this.graphMlBase = graphMlBaseFile;
        }

        /// <summary>
        /// Teilweiser Export der Daten nach GraphML mit Save-Dialog
        /// </summary>
        /// <param name="r">Datensatz, von dem ab der Export stattfindet</param>
        /// <param name="itemTypes">Liste der ItemType-Guids, die verfolgt werden sollen</param>
        /// <param name="connectionTypes">Liste der ConnectionType-Guids, die verfolgt werden sollen</param>
        /// <param name="maximumLevelsUpward">Maximale Anzahl von Levels nach oben</param>
        /// <param name="maximumLevelDownward">Maximale Anzahl von Levels nach unten</param>
        public void GraphMLExportPartial_Click(CMDBDataSet.ConfigurationItemsRow r, List<Guid> itemTypes, List<Guid> connectionTypes, int maximumLevelsUpward, int maximumLevelDownward)
        {
            Microsoft.Win32.SaveFileDialog dlg = CreateGraphMLSaveFileDialog();
            if (dlg.ShowDialog() == true)
            {
                System.Xml.XmlDocument doc = GraphMLExportPartial(r, itemTypes, connectionTypes, maximumLevelsUpward, maximumLevelDownward);
                doc.Save(dlg.FileName);
                System.Windows.MessageBox.Show("Fertig!");
            }
        }

        /// <summary>
        /// Teilweiser Export der Daten nach GraphML
        /// </summary>
        /// <param name="r">Datensatz, von dem ab der Export stattfindet</param>
        /// <param name="itemTypes">Liste der ItemType-Guids, die verfolgt werden sollen</param>
        /// <param name="connectionTypes">Liste der ConnectionType-Guids, die verfolgt werden sollen</param>
        /// <param name="maximumLevelsUpward">Maximale Anzahl von Levels nach oben</param>
        /// <param name="maximumLevelDownward">Maximale Anzahl von Levels nach unten</param>
        public System.Xml.XmlDocument GraphMLExportPartial(CMDBDataSet.ConfigurationItemsRow r, List<Guid> itemTypes, List<Guid> connectionTypes, int maximumLevelsUpward, int maximumLevelDownward)
        {
            System.Xml.XmlDocument doc = new System.Xml.XmlDocument();
            doc.Load(getGraphMLBase());
            System.Xml.XmlNode root = doc.DocumentElement;
            System.Xml.XmlNode graph = doc.CreateElement(null, "graph", "http://graphml.graphdrawing.org/xmlns");
            graph.Attributes.Append(CreateIdAttribute(doc, "G"));
            graph.Attributes.Append(CreateAttribute(doc, "edgefault", "directed"));
            root.AppendChild(graph);
            graph.AppendChild(CreateGraphmlNodeForRow(doc, r, true));
            List<Guid> done = new List<Guid>();
            done.Add(r.ItemId);
            List<System.Xml.XmlNode> nodesAndconnections = new List<System.Xml.XmlNode>();
            if (maximumLevelDownward > 0)
                GetGraphmlNodesDownward(doc, r, ref nodesAndconnections, ref done, connectionTypes, itemTypes, 1, maximumLevelDownward);
            if (maximumLevelsUpward > 0)
                GetGraphmlNodesUpward(doc, r, ref nodesAndconnections, ref done, connectionTypes, itemTypes, 1, maximumLevelsUpward);
            foreach (System.Xml.XmlNode n in nodesAndconnections)
            {
                graph.AppendChild(n);
            }
            return doc;
        }

        private string getGraphMLBase()
        {
            return this.graphMlBase;
        }

        // Erzeugt einen Save-Dialog
        private Microsoft.Win32.SaveFileDialog CreateGraphMLSaveFileDialog()
        {
            Microsoft.Win32.SaveFileDialog dlg = new Microsoft.Win32.SaveFileDialog();
            dlg.DefaultExt = ".graphml";
            dlg.Filter = "graphML-Dateien|*.graphml|Alle Dateien|*.*";
            return dlg;
        }

        /// <summary>
        /// Erzeugt rekursiv aufwärtslaufend eine Liste mit GraphML-Knoten und -Verbindungen
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="r">ConfigurationItems-Row mit dem zu bearbeitenden Element</param>
        /// <param name="nodesAndConnections">Liste, die mit den XML-Knoten gefüllt wird</param>
        private void GetGraphmlNodesUpward(System.Xml.XmlDocument doc, CMDBDataSet.ConfigurationItemsRow r, ref List<System.Xml.XmlNode> nodesAndConnections, ref List<Guid> done,
            List<Guid> connectiontypes, List<Guid> itemtypes, int currentLevel, int maximumLevel)
        {
            foreach (CMDBDataSet.ConnectionsRow rc in da.getConnectionsToUpperForItem(r.ItemId).Rows)
            {
                if (connectiontypes.Contains(rc.ConnType) && itemtypes.Contains(da.Dataset.ConfigurationItems.FindByItemId(rc.ConnUpperItem).ItemType))
                {
                    nodesAndConnections.Add(CreateGraphMlEdgeForConnection(doc, rc));
                    if (done.Contains(rc.ConnUpperItem))
                        continue;
                    nodesAndConnections.Add(CreateGraphmlNodeForRow(doc, da.Dataset.ConfigurationItems.FindByItemId(rc.ConnUpperItem)));
                    done.Add(rc.ConnUpperItem);
                    if (currentLevel < maximumLevel)
                        GetGraphmlNodesUpward(doc, da.Dataset.ConfigurationItems.FindByItemId(rc.ConnUpperItem), ref nodesAndConnections, ref done, connectiontypes, itemtypes, currentLevel + 1, maximumLevel);
                }
            }
        }

        /// <summary>
        /// Erzeugt rekursiv abwärtslaufend eine Liste mit GraphML-Knoten und -Verbindungen
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="r">ConfigurationItems-Row mit dem zu bearbeitenden Element</param>
        /// <param name="nodesAndConnections">Liste, die mit den XML-Knoten gefüllt wird</param>
        private void GetGraphmlNodesDownward(System.Xml.XmlDocument doc, CMDBDataSet.ConfigurationItemsRow r, ref List<System.Xml.XmlNode> nodesAndConnections, ref List<Guid> done,
            List<Guid> connectiontypes, List<Guid> itemtypes, int currentLevel, int maximumLevel)
        {
            foreach (CMDBDataSet.ConnectionsRow rc in da.getConnectionsToLowerForItem(r.ItemId).Rows)
            {
                if (connectiontypes.Contains(rc.ConnType) && itemtypes.Contains(da.Dataset.ConfigurationItems.FindByItemId(rc.ConnLowerItem).ItemType))
                {
                    nodesAndConnections.Add(CreateGraphMlEdgeForConnection(doc, rc));
                    if (done.Contains(rc.ConnLowerItem))
                        continue;
                    nodesAndConnections.Add(CreateGraphmlNodeForRow(doc, da.Dataset.ConfigurationItems.FindByItemId(rc.ConnLowerItem)));
                    done.Add(rc.ConnLowerItem);
                    if (currentLevel < maximumLevel)
                        GetGraphmlNodesDownward(doc, da.Dataset.ConfigurationItems.FindByItemId(rc.ConnLowerItem), ref nodesAndConnections, ref done, connectiontypes, itemtypes, currentLevel + 1, maximumLevel);
                }
            }
        }

        /// <summary>
        /// Vollständiger Export der Daten nach GraphML mit Save-Dialog
        /// </summary>
        public void GraphMLExportAll_Click()
        {
            Microsoft.Win32.SaveFileDialog dlg = CreateGraphMLSaveFileDialog();
            if (dlg.ShowDialog() == true)
            {
                System.Xml.XmlDocument doc = GraphMLExportAll();
                doc.Save(dlg.FileName);
                System.Windows.MessageBox.Show("Fertig!");
            }
        }

        /// <summary>
        /// Vollständiger Export der Daten nach GraphML
        /// </summary>
        public System.Xml.XmlDocument GraphMLExportAll()
        {
            System.Xml.XmlDocument doc = new System.Xml.XmlDocument();
            doc.Load(getGraphMLBase());
            System.Xml.XmlNode root = doc.DocumentElement;
            System.Xml.XmlNode graph = doc.CreateElement(null, "graph", "http://graphml.graphdrawing.org/xmlns");
            graph.Attributes.Append(CreateIdAttribute(doc, "G"));
            graph.Attributes.Append(CreateAttribute(doc, "edgefault", "directed"));
            root.AppendChild(graph);
            foreach (CMDBDataSet.ConfigurationItemsRow r in da.Dataset.ConfigurationItems.Rows)
            {
                graph.AppendChild(CreateGraphmlNodeForRow(doc, r));
            }
            foreach (CMDBDataSet.ConnectionsRow r in da.Dataset.Connections.Rows)
            {
                graph.AppendChild(CreateGraphMlEdgeForConnection(doc, r));
            }
            return doc;
        }

        /// <summary>
        /// Erzeugt eine GraphML-Verbindung aus einer ConnectionsRow
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="r">ConnectionsRows</param>
        /// <returns></returns>
        private System.Xml.XmlNode CreateGraphMlEdgeForConnection(System.Xml.XmlDocument doc, CMDBDataSet.ConnectionsRow r)
        {
            System.Xml.XmlNode edge = doc.CreateElement(null, "edge", "http://graphml.graphdrawing.org/xmlns");
            edge.Attributes.Append(CreateIdAttribute(doc, r.ConnId.ToString()));
            edge.Attributes.Append(CreateAttribute(doc, "source", r.ConnUpperItem.ToString()));
            edge.Attributes.Append(CreateAttribute(doc, "target", r.ConnLowerItem.ToString()));
            return edge;
        }

        /// <summary>
        /// Erzeugt einen GraphML-Knoten aus einer ConfigurationItemsRow
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="r">ConfigurationItemsRow</param>
        /// <returns></returns>
        private System.Xml.XmlNode CreateGraphmlNodeForRow(System.Xml.XmlDocument doc, CMDBDataSet.ConfigurationItemsRow r)
        {
            return CreateGraphmlNodeForRow(doc, r, false);
        }

        /// <summary>
        /// Erzeugt einen GraphML-Knoten aus einer ConfigurationItemsRow
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="r">ConfigurationItemsRow</param>
        /// <param name="exalt">Gibt an, ob der Knoten hervorgehoben werden soll</param>
        /// <returns></returns>
        private System.Xml.XmlNode CreateGraphmlNodeForRow(System.Xml.XmlDocument doc, CMDBDataSet.ConfigurationItemsRow r, bool exalt)
        {
            System.Xml.XmlNode node = doc.CreateElement(null, "node", "http://graphml.graphdrawing.org/xmlns");
            node.Attributes.Append(CreateIdAttribute(doc, r.ItemId.ToString()));
            System.Xml.XmlNode data = doc.CreateElement(null, "data", "http://graphml.graphdrawing.org/xmlns");
            data.Attributes.Append(CreateAttribute(doc, "key", "d6"));
            System.Xml.XmlNode shapenode = doc.CreateElement("y", "ShapeNode", "http://www.yworks.com/xml/graphml");
            System.Xml.XmlNode nodelabel = doc.CreateElement("y", "NodeLabel", "http://www.yworks.com/xml/graphml");
            System.Xml.XmlNode geometry = doc.CreateElement("y", "Geometry", "http://www.yworks.com/xml/graphml");
            System.Xml.XmlNode fill = doc.CreateElement("y", "Fill", "http://www.yworks.com/xml/graphml"); //<y:Fill color="#3355CC" transparent="false"/>
            nodelabel.Attributes.Append(CreateAttribute(doc, "autoSizePolicy", "content"));
            nodelabel.Attributes.Append(CreateAttribute(doc, "alignment", "left"));
            string label = GetGraphmlObjectLabel(r);
            Size sz = WpfHelper.MeasureString(label, new FontFamily("Arial, Century Gothic, Sans Serif"), 12, FontStyles.Normal, FontWeights.Normal, FontStretches.Normal);
            geometry.Attributes.Append(CreateAttribute(doc, "width", Math.Ceiling(sz.Width + 2 * GraphObjectWpf.Margin).ToString()));
            geometry.Attributes.Append(CreateAttribute(doc, "height", Math.Ceiling(sz.Height + 2 * GraphObjectWpf.Margin).ToString()));
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            fill.Attributes.Append(CreateAttribute(doc, "color", da.Dataset.ItemTypes.FindByTypeId(r.ItemType).TypeBackColor));
            fill.Attributes.Append(CreateAttribute(doc, "transparent", "false"));
            nodelabel.AppendChild(doc.CreateTextNode(label));
            shapenode.AppendChild(geometry);
            shapenode.AppendChild(fill);
            if (exalt)
            {
                System.Xml.XmlNode borderstyle = doc.CreateElement("y", "BorderStyle", "http://www.yworks.com/xml/graphml");
                borderstyle.Attributes.Append(CreateAttribute(doc, "color", "#FF0000"));
                borderstyle.Attributes.Append(CreateAttribute(doc, "type", "dashed"));
                borderstyle.Attributes.Append(CreateAttribute(doc, "width", "5.0"));
                shapenode.AppendChild(borderstyle);
            }
            shapenode.AppendChild(nodelabel);
            data.AppendChild(shapenode);
            node.AppendChild(data);
            return node;
        }

        /// <summary>
        /// Erzeugt eine Beschriftung für einen GraphML-Objekt-Knoten
        /// </summary>
        /// <param name="r">DataRow mit den Daten</param>
        /// <returns></returns>
        private string GetGraphmlObjectLabel(CMDBDataSet.ConfigurationItemsRow r)
        {
            string label = string.Format("{0}:\r\n{1}\r\n", r.TypeName, r.ItemName);
            foreach (CMDBDataSet.ItemAttributesRow ra in da.getAttributesForItem(r.ItemId).Rows)
            {
                label += string.Format("{0}: {1}\r\n", ra.AttributeTypeName, ra.AttributeValue);
            }
            return label;
        }

        /// <summary>
        /// Erzeugt ein XML-Attribut mit dem Namen ID
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="value">Wert des Attributs</param>
        /// <returns></returns>
        private System.Xml.XmlAttribute CreateIdAttribute(System.Xml.XmlDocument doc, string value)
        {
            return CreateAttribute(doc, "id", value);
        }

        /// <summary>
        /// Erzeugt ein XML-Attribut mit einem gegebenen Name
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="name">Name des Attributs</param>
        /// <param name="value">Wert des Attributs</param>
        /// <returns></returns>
        private System.Xml.XmlAttribute CreateAttribute(System.Xml.XmlDocument doc, string name, string value)
        {
            System.Xml.XmlAttribute att = doc.CreateAttribute(name);
            att.Value = value;
            return att;
        }

    }
}
