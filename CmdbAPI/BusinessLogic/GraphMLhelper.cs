using CmdbAPI.TransferObjects;
using CmdbAPI.BusinessLogic.Helpers;
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Media;

namespace CmdbAPI.BusinessLogic
{
    /// <summary>
    /// Klasse zur Umwandlung von grafischen Items in die XML-Sprache GraphML
    /// </summary>
    public class GraphMLhelper
    {
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
        public void GraphMLExportPartial_Click(ConfigurationItem r, List<Guid> itemTypes, List<Guid> connectionTypes, int maximumLevelsUpward, int maximumLevelDownward, bool withAttributes)
        {
            Microsoft.Win32.SaveFileDialog dlg = CreateGraphMLSaveFileDialog();
            if (dlg.ShowDialog() == true)
            {
                System.Xml.XmlDocument doc = GraphMLExportPartial(r, itemTypes, connectionTypes, maximumLevelsUpward, maximumLevelDownward, withAttributes);
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
        /// <param name="withAttributes">Attribute mit ausgeben?</param>
        public System.Xml.XmlDocument GraphMLExportPartial(ConfigurationItem r, List<Guid> itemTypes, List<Guid> connectionTypes, int maximumLevelsUpward, int maximumLevelDownward, bool withAttributes)
        {
            System.Xml.XmlDocument doc = new System.Xml.XmlDocument();
            doc.Load(getGraphMLBase());
            System.Xml.XmlNode root = doc.DocumentElement;
            System.Xml.XmlNode graph = doc.CreateElement(null, "graph", "http://graphml.graphdrawing.org/xmlns");
            graph.Attributes.Append(CreateIdAttribute(doc, "G"));
            graph.Attributes.Append(CreateAttribute(doc, "edgefault", "directed"));
            root.AppendChild(graph);
            graph.AppendChild(CreateGraphmlNodeForRow(doc, r, withAttributes));
            List<Guid> done = new List<Guid>();
            done.Add(r.ItemId);
            List<System.Xml.XmlNode> nodesAndconnections = new List<System.Xml.XmlNode>();
            if (maximumLevelDownward > 0)
                GetGraphmlNodesDownward(doc, r, ref nodesAndconnections, ref done, connectionTypes, itemTypes, 1, maximumLevelDownward, withAttributes);
            if (maximumLevelsUpward > 0)
                GetGraphmlNodesUpward(doc, r, ref nodesAndconnections, ref done, connectionTypes, itemTypes, 1, maximumLevelsUpward, withAttributes);
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
        private void GetGraphmlNodesUpward(System.Xml.XmlDocument doc, ConfigurationItem r, ref List<System.Xml.XmlNode> nodesAndConnections, ref List<Guid> done,
            List<Guid> connectiontypes, List<Guid> itemtypes, int currentLevel, int maximumLevel, bool withAttributes)
        {
            foreach (Connection rc in DataHandler.GetConnectionsToUpperForItem(r.ItemId))
            {
                if (connectiontypes.Contains(rc.ConnType) && itemtypes.Contains(DataHandler.GetConfigurationItem(rc.ConnUpperItem).ItemType))
                {
                    nodesAndConnections.Add(CreateGraphMlEdgeForConnection(doc, rc));
                    if (done.Contains(rc.ConnUpperItem))
                        continue;
                    nodesAndConnections.Add(CreateGraphmlNodeForRow(doc, DataHandler.GetConfigurationItem(rc.ConnUpperItem), withAttributes));
                    done.Add(rc.ConnUpperItem);
                    if (currentLevel < maximumLevel)
                        GetGraphmlNodesUpward(doc, DataHandler.GetConfigurationItem(rc.ConnUpperItem), ref nodesAndConnections, ref done, connectiontypes, itemtypes, currentLevel + 1, maximumLevel, withAttributes);
                }
            }
        }

        /// <summary>
        /// Erzeugt rekursiv abwärtslaufend eine Liste mit GraphML-Knoten und -Verbindungen
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="r">ConfigurationItems-Row mit dem zu bearbeitenden Element</param>
        /// <param name="nodesAndConnections">Liste, die mit den XML-Knoten gefüllt wird</param>
        private void GetGraphmlNodesDownward(System.Xml.XmlDocument doc, ConfigurationItem r, ref List<System.Xml.XmlNode> nodesAndConnections, ref List<Guid> done,
            List<Guid> connectiontypes, List<Guid> itemtypes, int currentLevel, int maximumLevel, bool withAttributes)
        {
            foreach (Connection rc in DataHandler.GetConnectionsToLowerForItem(r.ItemId))
            {
                if (connectiontypes.Contains(rc.ConnType) && itemtypes.Contains(DataHandler.GetConfigurationItem(rc.ConnLowerItem).ItemType))
                {
                    nodesAndConnections.Add(CreateGraphMlEdgeForConnection(doc, rc));
                    if (done.Contains(rc.ConnLowerItem))
                        continue;
                    nodesAndConnections.Add(CreateGraphmlNodeForRow(doc, DataHandler.GetConfigurationItem(rc.ConnLowerItem), withAttributes));
                    done.Add(rc.ConnLowerItem);
                    if (currentLevel < maximumLevel)
                        GetGraphmlNodesDownward(doc, DataHandler.GetConfigurationItem(rc.ConnLowerItem), ref nodesAndConnections, ref done, connectiontypes, itemtypes, currentLevel + 1, maximumLevel, withAttributes);
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
            foreach (ConfigurationItem r in DataHandler.GetConfigurationItems())
            {
                graph.AppendChild(CreateGraphmlNodeForRow(doc, r, false));
            }
            foreach (Connection r in DataHandler.GetConnections())
            {
                graph.AppendChild(CreateGraphMlEdgeForConnection(doc, r));
            }
            return doc;
        }

        public System.Xml.XmlDocument GraphMLExportMeta(List<Guid> connTypes)
        {
            System.Xml.XmlDocument doc = new System.Xml.XmlDocument();
            doc.Load(getGraphMLBase());
            System.Xml.XmlNode root = doc.DocumentElement;
            System.Xml.XmlNode graph = doc.CreateElement(null, "graph", "http://graphml.graphdrawing.org/xmlns");
            graph.Attributes.Append(CreateIdAttribute(doc, "G"));
            graph.Attributes.Append(CreateAttribute(doc, "edgefault", "directed"));
            root.AppendChild(graph);
            foreach(ItemType r in MetaDataHandler.GetItemTypes())
            {
                System.Xml.XmlNode node = doc.CreateElement(null, "node", "http://graphml.graphdrawing.org/xmlns");
                node.Attributes.Append(CreateIdAttribute(doc, r.TypeId.ToString()));
                System.Xml.XmlNode data = doc.CreateElement(null, "data", "http://graphml.graphdrawing.org/xmlns");
                data.Attributes.Append(CreateAttribute(doc, "key", "d6"));
                System.Xml.XmlNode shapenode = doc.CreateElement("y", "ShapeNode", "http://www.yworks.com/xml/graphml");
                System.Xml.XmlNode nodelabel = doc.CreateElement("y", "NodeLabel", "http://www.yworks.com/xml/graphml");
                System.Xml.XmlNode geometry = doc.CreateElement("y", "Geometry", "http://www.yworks.com/xml/graphml");
                System.Xml.XmlNode fill = doc.CreateElement("y", "Fill", "http://www.yworks.com/xml/graphml");
                nodelabel.Attributes.Append(CreateAttribute(doc, "autoSizePolicy", "content"));
                nodelabel.Attributes.Append(CreateAttribute(doc, "alignment", "left"));
                string label = r.TypeName;
                foreach (AttributeType ra in MetaDataHandler.GetAllowedAttributeTypesForItemType(r.TypeId))
                {
                    label += "\r\n - " + ra.TypeName;
                }
                Size sz = StringHelper.MeasureString(label);
                geometry.Attributes.Append(CreateAttribute(doc, "width", Math.Ceiling(sz.Width + 2 * GraphItem.Margin).ToString()));
                geometry.Attributes.Append(CreateAttribute(doc, "height", Math.Ceiling(sz.Height + 2 * GraphItem.Margin).ToString()));
                fill.Attributes.Append(CreateAttribute(doc, "color", r.TypeBackColor));
                fill.Attributes.Append(CreateAttribute(doc, "transparent", "false"));
                nodelabel.AppendChild(doc.CreateTextNode(label));
                shapenode.AppendChild(geometry);
                shapenode.AppendChild(fill);
                shapenode.AppendChild(nodelabel);
                data.AppendChild(shapenode);
                node.AppendChild(data);
                graph.AppendChild(node);
            }
            foreach (ConnectionRule crr in MetaDataHandler.GetConnectionRules())
            {
                if (connTypes.Contains(crr.ConnType))
                {
                    string label = MetaDataHandler.GetConnectionType(crr.ConnType).ConnTypeName;
                    System.Xml.XmlNode edge = doc.CreateElement(null, "edge", "http://graphml.graphdrawing.org/xmlns");
                    edge.Attributes.Append(CreateIdAttribute(doc, crr.RuleId.ToString()));
                    edge.Attributes.Append(CreateAttribute(doc, "source", crr.ItemUpperType.ToString()));
                    edge.Attributes.Append(CreateAttribute(doc, "target", crr.ItemLowerType.ToString()));
                    System.Xml.XmlNode data = doc.CreateElement(null, "data", "http://graphml.graphdrawing.org/xmlns");
                    data.Attributes.Append(CreateAttribute(doc, "key", "d9"));
                    System.Xml.XmlNode polyedgeline = doc.CreateElement("y", "PolyEdgeLine", "http://www.yworks.com/xml/graphml");
                    System.Xml.XmlNode edgelabel = doc.CreateElement("y", "EdgeLabel", "http://www.yworks.com/xml/graphml");
                    edgelabel.Attributes.Append(CreateAttribute(doc, "alignment", "center"));
                    Size sz = StringHelper.MeasureString(label);
                    edgelabel.Attributes.Append(CreateAttribute(doc, "width", Math.Ceiling(sz.Width + 2 * GraphItem.Margin).ToString()));
                    edgelabel.Attributes.Append(CreateAttribute(doc, "height", Math.Ceiling(sz.Height + 2 * GraphItem.Margin).ToString()));
                    edgelabel.Attributes.Append(CreateAttribute(doc, "modelName", "center_slider")); // Text auf der Linie zentrieren
                    edgelabel.AppendChild(doc.CreateTextNode(label));
                    polyedgeline.AppendChild(edgelabel);
                    data.AppendChild(polyedgeline);
                    edge.AppendChild(data);
                    graph.AppendChild(edge);
                }
            }
            return doc;
        }

        /// <summary>
        /// Erzeugt eine GraphML-Verbindung aus einer ConnectionsRow
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="r">ConnectionsRows</param>
        /// <returns></returns>
        private System.Xml.XmlNode CreateGraphMlEdgeForConnection(System.Xml.XmlDocument doc, Connection r)
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
        private System.Xml.XmlNode CreateGraphmlNodeForRow(System.Xml.XmlDocument doc, ConfigurationItem r, bool withAttributes)
        {
            return CreateGraphmlNodeForRow(doc, r, false, withAttributes);
        }

        /// <summary>
        /// Erzeugt einen GraphML-Knoten aus einer ConfigurationItemsRow
        /// </summary>
        /// <param name="doc">XML-Dokument</param>
        /// <param name="r">ConfigurationItemsRow</param>
        /// <param name="exalt">Gibt an, ob der Knoten hervorgehoben werden soll</param>
        /// <returns></returns>
        private System.Xml.XmlNode CreateGraphmlNodeForRow(System.Xml.XmlDocument doc, ConfigurationItem r, bool exalt, bool withAttributes)
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
            string label = GetGraphmlObjectLabel(r, withAttributes);
            Size sz = StringHelper.MeasureString(label);
            geometry.Attributes.Append(CreateAttribute(doc, "width", Math.Ceiling(sz.Width + 2 * GraphItem.Margin).ToString()));
            geometry.Attributes.Append(CreateAttribute(doc, "height", Math.Ceiling(sz.Height + 2 * GraphItem.Margin).ToString()));
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            fill.Attributes.Append(CreateAttribute(doc, "color", MetaDataHandler.GetItemType(r.ItemType).TypeBackColor));
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
        private string GetGraphmlObjectLabel(ConfigurationItem r, bool withAttributes)
        {
            string label = string.Format("{0}:\r\n{1}\r\n", r.TypeName, r.ItemName);
            if (withAttributes)
            {
                foreach (ItemAttribute ra in DataHandler.GetAttributesForConfigurationItem(r.ItemId))
                {
                    label += string.Format("{0}: {1}\r\n", ra.AttributeTypeName, ra.AttributeValue);
                }
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
