using RZManager.Objects;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.BusinessLogic
{
    public partial class DataHub
    {
        /// <summary>
        /// Liest die XML-Datei aus, die die Informationen über blockierte Slots enthält
        /// </summary>
        private void RetrieveBlockingInformation()
        {

            blockedUnits = new List<BlockedUnit>();

            bool hasChanges = false;

            if (System.IO.File.Exists(Properties.Settings.Default.BlockedUnitsFile))
            {
                System.Xml.XmlDocument xdoc = new System.Xml.XmlDocument();
                xdoc.Load(Properties.Settings.Default.BlockedUnitsFile);
                foreach (System.Xml.XmlNode node in xdoc.SelectNodes("//Racks/Rack"))
                {
                    Rack rack = racks.SingleOrDefault(r => r.id.Equals(int.Parse(node.Attributes["Id"].Value)));
                    if (rack != null)
                    {
                        blockedUnits.Add(new BlockedUnit() { Rack = rack, Unit = int.Parse(node.Attributes["Unit"].Value), Reason = node.Attributes["Reason"].Value, ForegroundColor = node.Attributes["Color"].Value });
                    }
                    else
                        hasChanges = true;
                }
                foreach (System.Xml.XmlNode node in xdoc.SelectNodes("//Enclosures/Enclosure"))
                {
                    BladeEnclosure enc = bladeEnclosures.SingleOrDefault(e => e.id.Equals(Guid.Parse(node.Attributes["Id"].Value)));
                    if (enc != null)
                    {
                        blockedUnits.Add(new BlockedUnit() { Enclosure = enc, Unit = int.Parse(node.Attributes["Unit"].Value), Reason = node.Attributes["Reason"].Value, ForegroundColor = node.Attributes["Color"].Value });
                    }
                    else
                        hasChanges = true;
                }

                if (hasChanges)
                    SaveBlockedUnits();
            }
        }

        /// <summary>
        /// Fügt eine einzelne blockierte Einheit zur Liste hinzu
        /// </summary>
        /// <param name="newBlockedUnit">Blockierte Einheit</param>
        public void AddBlockedUnit(BlockedUnit newBlockedUnit)
        {
            blockedUnits.Add(newBlockedUnit);
            SaveBlockedUnits();
            OnDataChanged();
        }

        /// <summary>
        /// Fügt einen ganzen Bereich von blockierten Einheiten (von - bis) zur Liste hinzu
        /// </summary>
        /// <param name="newBlockedUnits">Blockierte Einheiten</param>
        public void AddBlockedUnits(IEnumerable<BlockedUnit> newBlockedUnits)
        {
            blockedUnits.AddRange(newBlockedUnits);
            SaveBlockedUnits();
            OnDataChanged();
        }

        /// <summary>
        /// Löscht eine Blockierte Einheit aus der Liste
        /// </summary>
        /// <param name="blockedUnit"></param>
        public void RemoveBlockedUnit(BlockedUnit blockedUnit)
        {
            blockedUnits.Remove(blockedUnit);
            SaveBlockedUnits();
            OnDataChanged();
        }

        /// <summary>
        /// Speichert die Liste der blockierten Einheiten als XML-Datei ab.
        /// </summary>
        private void SaveBlockedUnits()
        {
            System.Xml.XmlDocument xdoc = new System.Xml.XmlDocument();
            xdoc.AppendChild(xdoc.CreateXmlDeclaration("1.0", "UTF-8", "yes"));
            System.Xml.XmlNode root = xdoc.AppendChild(xdoc.CreateElement("BlockedUnits"));
            System.Xml.XmlNode racksNode = root.AppendChild(xdoc.CreateElement("Racks"));
            System.Xml.XmlNode enclosuresNode = root.AppendChild(xdoc.CreateElement("Enclosures"));
            foreach (BlockedUnit bu in blockedUnits)
            {
                if (bu.Rack != null)
                {
                    racksNode.AppendChild(CreateBlockedRackUnitNode(xdoc, bu));
                }
                if (bu.Enclosure != null)
                {
                    enclosuresNode.AppendChild(CreateBlockedEnclosureUnitNode(xdoc, bu));
                }
            }
            xdoc.Save(Properties.Settings.Default.BlockedUnitsFile);
        }

        /// <summary>
        /// Erzeugt einen Datensatz in einer XML-Datei, die eine Höheneinheiten in einem Rack blockiert
        /// </summary>
        /// <param name="xdoc">XML-Dokument</param>
        /// <param name="bu">Blockierte Höhen-Einheit</param>
        /// <returns></returns>
        private System.Xml.XmlNode CreateBlockedRackUnitNode(System.Xml.XmlDocument xdoc, BlockedUnit bu)
        {
            System.Xml.XmlNode node = CreateBlockedUnitNode(xdoc, "Rack", bu);
            node.Attributes.Append(CreateXmlAttribute(xdoc, "Id", bu.Rack.id.ToString()));
            node.Attributes.Append(CreateXmlAttribute(xdoc, "Name", bu.Rack.Name));
            return node;
        }

        /// <summary>
        /// Erzeugt einen Datensatz in einer XML-Datei, die einen Slot in einem Enclosure blockiert
        /// </summary>
        /// <param name="xdoc">XML-Dokument</param>
        /// <param name="bu">Blockierter Slot</param>
        /// <returns></returns>
        private System.Xml.XmlNode CreateBlockedEnclosureUnitNode(System.Xml.XmlDocument xdoc, BlockedUnit bu)
        {
            System.Xml.XmlNode node = CreateBlockedUnitNode(xdoc, "Enclosure", bu);
            node.Attributes.Append(CreateXmlAttribute(xdoc, "Id", bu.Enclosure.id.ToString()));
            node.Attributes.Append(CreateXmlAttribute(xdoc, "Name", bu.Enclosure.Name));
            return node;
        }

        /// <summary>
        /// Basis-Funktion zur Erzeugung des XML-Elements für CreateBlockedEnclosureUnitNode und CreateBlockedRackUnitNode
        /// </summary>
        /// <param name="xdoc">XML-Dokument</param>
        /// <param name="name">Bezeichnung der Blockierung (Grund)</param>
        /// <param name="bu">Blockiertes Element</param>
        /// <returns></returns>
        private System.Xml.XmlNode CreateBlockedUnitNode(System.Xml.XmlDocument xdoc, string name, BlockedUnit bu)
        {
            System.Xml.XmlNode node = xdoc.CreateElement(name);
            node.Attributes.Append(CreateXmlAttribute(xdoc, "Unit", bu.Unit.ToString()));
            node.Attributes.Append(CreateXmlAttribute(xdoc, "Reason", bu.Reason));
            node.Attributes.Append(CreateXmlAttribute(xdoc, "Color", bu.ForegroundColor));
            return node;
        }
        /// <summary>
        /// Liefert alle blockierten Höheneinheiten für ein Rack zurück
        /// </summary>
        /// <param name="rack">Rack, nach dem gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<BlockedUnit> GetBlockedUnits(Rack rack)
        {
            return blockedUnits.Where(b => b.Rack != null && b.Rack.Equals(rack));
        }

        /// <summary>
        /// Liefert alle blockierten Slots für ein Enclosure zurück
        /// </summary>
        /// <param name="enclosure">Enclosure, nach dem gesucht wird</param>
        /// <returns></returns>
        public IEnumerable<BlockedUnit> GetBlockedUnits(BladeEnclosure enclosure)
        {
            return blockedUnits.Where(b => b.Enclosure != null && b.Enclosure.Equals(enclosure));
        }

    }
}
