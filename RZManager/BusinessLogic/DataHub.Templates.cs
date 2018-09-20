using RZManager.Objects;
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
        /// Liest die Enclosure-Typen mit Höhe und Breite in Slots aus einer Datei.
        /// </summary>
        private void RetrieveEnclosureTypeTemplates()
        {
            if (System.IO.File.Exists(s.EnclosureTypesFile))
            {
                System.Xml.XmlDocument xdoc = new System.Xml.XmlDocument();
                xdoc.Load(s.EnclosureTypesFile);
                foreach (System.Xml.XmlNode node in xdoc.SelectNodes("//EnclosureType"))
                {
                    enclosureTypeTemplates.Add(new EnclosureTypeTemplate()
                    {
                        Name = node.Attributes["Name"].Value,
                        ServerCountVertical = SafeIntParse(node.Attributes["ServerCountVertical"]),
                        ServerCountHorizontal = SafeIntParse(node.Attributes["ServerCountHorizontal"]),
                        InterconnectCountVertical = SafeIntParse(node.Attributes["InterconnectCountVertical"]),
                        InterconnectCountHorizontal = SafeIntParse(node.Attributes["InterconnectCountHorizontal"]),
                        //InterFrameLinkCountVertical = SafeIntParse(node.Attributes["InterFrameLinkCountVertical"]),
                        //InterFrameLinkCountHorizontal = SafeIntParse(node.Attributes["InterFrameLinkCountHorizontal"]),
                        ApplianceCountVertical = SafeIntParse(node.Attributes["ApplianceCountVertical"]),
                        ApplianceCountHorizontal = SafeIntParse(node.Attributes["ApplianceCountHorizontal"]),
                    });
                }
            }
            enclosureTypeTemplates.Add(new EnclosureTypeTemplate() // Standard hinzufügen, falls kein Typ gefunden wird
            {
                Name = "Default",
                ServerCountVertical = 2,
                ServerCountHorizontal = 8,
                InterconnectCountVertical = 4,
                InterconnectCountHorizontal = 2,
                ApplianceCountVertical = 0,
                ApplianceCountHorizontal = 0,
                //InterFrameLinkCountHorizontal = 0,
                //InterFrameLinkCountVertical = 0,
            });
        }

        /// <summary>
        /// Ändert für ein Produkt die Werte und speichert alle Produkte in einer XML-Datei ab
        /// </summary>
        /// <param name="encType">EnclosureType, der geändert werden soll</param>
        public void SaveEnclosureTypeTemplate(EnclosureType encType)
        {
            EnclosureTypeTemplate t1 = enclosureTypeTemplates.SingleOrDefault(e => e.Name.Equals(encType.Name));
            if (t1 != null)
                enclosureTypeTemplates.Remove(t1);
            enclosureTypeTemplates.Add(encType);
            System.Xml.XmlDocument xdoc = new System.Xml.XmlDocument();
            xdoc.AppendChild(xdoc.CreateXmlDeclaration("1.0", "UTF-8", "yes"));
            System.Xml.XmlNode rootElement = xdoc.CreateElement("EnclosureTypes");
            xdoc.AppendChild(rootElement);
            foreach (EnclosureTypeTemplate ett in enclosureTypeTemplates)
            {
                if (ett.Name.Equals("Default"))
                    continue;
                System.Xml.XmlNode node = xdoc.CreateElement("EnclosureType");
                node.Attributes.Append(CreateXmlAttribute(xdoc, "Name", ett.Name));
                node.Attributes.Append(CreateXmlAttribute(xdoc, "ServerCountVertical", ett.ServerCountVertical.ToString()));
                node.Attributes.Append(CreateXmlAttribute(xdoc, "ServerCountHorizontal", ett.ServerCountHorizontal.ToString()));
                node.Attributes.Append(CreateXmlAttribute(xdoc, "InterconnectCountVertical", ett.InterconnectCountVertical.ToString()));
                node.Attributes.Append(CreateXmlAttribute(xdoc, "InterconnectCountHorizontal", ett.InterconnectCountHorizontal.ToString()));
                //node.Attributes.Append(CreateAttribute(xdoc, "InterFrameLinkCountVertical", ett.InterFrameLinkCountVertical.ToString()));
                //node.Attributes.Append(CreateAttribute(xdoc, "InterFrameLinkCountHorizontal", ett.InterFrameLinkCountHorizontal.ToString()));
                node.Attributes.Append(CreateXmlAttribute(xdoc, "ApplianceCountVertical", ett.ApplianceCountVertical.ToString()));
                node.Attributes.Append(CreateXmlAttribute(xdoc, "ApplianceCountHorizontal", ett.ApplianceCountHorizontal.ToString()));
                rootElement.AppendChild(node);
            }
            xdoc.Save(s.EnclosureTypesFile);
        }

        /// <summary>
        /// Liefert die konfigurierte Vorlage für den Typ eines Enclosures für die Kalkulation der Abmessungen und Aufnahmekapazitäten zurück.
        /// Falls der Enclosure-Typ in der Konfigurationsdatei nicht vorhanden ist, wird ein Standard-Wert zurückgegeben
        /// </summary>
        /// <param name="modelName">Modellname des Enclosures</param>
        /// <returns></returns>
        private EnclosureTypeTemplate GetEnclosureTypeTemplate(string modelName)
        {
            try
            {
                return enclosureTypeTemplates.Single(e => e.Name.Equals(modelName, StringComparison.CurrentCultureIgnoreCase));
            }
            catch
            {
                EnclosureTypeMissing = true;
                return enclosureTypeTemplates.Single(e => e.Name.Equals("Default"));
            }
        }

    }
}
