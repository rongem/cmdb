using CmdbClient;
using CmdbClient.CmsService;
using RZManager.Objects;
using RZManager.Objects.Assets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.BusinessLogic
{
    public partial class DataHub
    {
        public class MetaDataCache
        {
            /// <summary>
            /// Liste der ItemTypen, Zugriff über den Namen
            /// </summary>
            public Dictionary<string, ItemType> ItemTypes { get; private set; } = new Dictionary<string, ItemType>();

            /// <summary>
            /// Liste der Attributgruppen, Zugriff über den Namen
            /// </summary>
            public Dictionary<string, AttributeGroup> AttributeGroups { get; private set; } = new Dictionary<string, AttributeGroup>();

            /// <summary>
            /// Liste der Attribut-Typen, Zugriff über den Namen
            /// </summary>
            public Dictionary<string, AttributeType> AttributeTypes { get; private set; } = new Dictionary<string, AttributeType>();

            /// <summary>
            /// Liste der Verbindungstypen, Zugriff über die beiden Bezeichnungen
            /// </summary>
            public Dictionary<Settings.ConnectionTypes.ConnectionType, ConnectionType> ConnectionTypes { get; private set; } = new Dictionary<Settings.ConnectionTypes.ConnectionType, ConnectionType>();

            /// <summary>
            /// Liste aller bekannten Enclosure-Types, die aus den entsprechenden Produkten generiert werden
            /// </summary>
            public List<EnclosureType> EnclosureTypes { get; } = new List<EnclosureType>();

            /// <summary>
            /// Vorlagen für Enclosures aus der Konfigurationsdatei
            /// </summary>
            private List<EnclosureTypeTemplate> enclosureTypeTemplates = new List<EnclosureTypeTemplate>();

            /// <summary>
            /// Gibt an, ob bei der Initialisierung festgestellt wurde, dass ein Enclosure-Typ nicht konfiguriert ist
            /// </summary>
            public bool EnclosureTypeMissing { get; private set; }

            public MetaDataCache(DataWrapper wrapper)
            {
                try
                {
                    // Überprüfen und ggf. Anlegen des notwendigen Datenmodells
                    FillItemTypes(wrapper);
                    FillAttributeGroups(wrapper);
                    FillAttributeTypes(wrapper);
                    FillConnectionTypes(wrapper);
                    FillConnectionRules(wrapper);
                    CheckAttributeGroupMappings(wrapper);

                    // Auslesen der für Enclosure-Typen konfigurierten Werte
                    RetrieveEnclosureTypeTemplates();

                    // Auslesen der Enclosure-Modelle und Zuordnen der konfigurierten Werte
                    FillEnclosureTypes(wrapper);
                }
                catch (Exception ex)
                {
                    System.Windows.MessageBox.Show(ex.Message, "Fehler bei der Initialisierung", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Error);
                    Environment.Exit(1);
                }
            }

            /// <summary>
            /// Liest die Enclosure-Typen mit Höhe und Breite in Slots aus einer Datei.
            /// </summary>
            private void RetrieveEnclosureTypeTemplates()
            {
                if (System.IO.File.Exists(Properties.Settings.Default.EnclosureTypesFile))
                {
                    System.Xml.XmlDocument xdoc = new System.Xml.XmlDocument();
                    xdoc.Load(Properties.Settings.Default.EnclosureTypesFile);
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
            /// Versucht einen XML-Attributwert zu parsen und das Ergebnis als int zurückzugeben. Gibt 0 zurück, falls das nicht gelingt
            /// </summary>
            /// <param name="att">XML-Attribut</param>
            /// <returns></returns>
            private int SafeIntParse(System.Xml.XmlAttribute att)
            {
                if (att != null)
                {
                    int retval = 0;
                    if (int.TryParse(att.Value, out retval))
                        return retval;
                }
                return 0;
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
                xdoc.Save(Properties.Settings.Default.EnclosureTypesFile);
            }
            /// <summary>
            /// Füllt die Enclosure-Metadaten
            /// </summary>
            /// <param name="wrapper"></param>
            private void FillEnclosureTypes(DataWrapper wrapper)
            {
                EnclosureTypes.Clear();
                IEnumerable<ItemAttribute> models = wrapper.GetAttributesForAttributeType(AttributeTypes[Settings.Config.AttributeTypeNames.Model].TypeId);
                IEnumerable<Guid> enclosureIds = wrapper.GetConfigurationItemsByTypeName(Settings.Config.ConfigurationItemTypeNames.BladeEnclosure).Select(i => i.ItemId);
                models = models.Where(a => enclosureIds.Contains(a.ItemId));
                string[] modelNames = models.Select(a => a.AttributeValue).Distinct().ToArray();
                for (int i = 0; i < modelNames.Length; i++)
                {
                    EnclosureTypeTemplate encTypeTemplate = GetEnclosureTypeTemplate(modelNames[i]);
                    EnclosureType encType = new EnclosureType()
                    {
                        Name = modelNames[i],
                        TemplateName = encTypeTemplate.Name,
                        ApplianceCountVertical = encTypeTemplate.ApplianceCountVertical,
                        ApplianceCountHorizontal = encTypeTemplate.ApplianceCountHorizontal,
                        InterconnectCountVertical = encTypeTemplate.InterconnectCountVertical,
                        InterconnectCountHorizontal = encTypeTemplate.InterconnectCountHorizontal,
                        //InterFrameLinkCountVertical = encTypeTemplate.InterFrameLinkCountVertical,
                        //InterFrameLinkCountHorizontal = encTypeTemplate.InterFrameLinkCountHorizontal,
                        ServerCountVertical = encTypeTemplate.ServerCountVertical,
                        ServerCountHorizontal = encTypeTemplate.ServerCountHorizontal,
                        //HeightUnits = encTypeTemplate.HeightUnits,
                    };
                    EnclosureTypes.Add(encType);
                }
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

            /// <summary>
            /// Sorgt dafür, dass die Zuordnungen von Attributtypen zu Attributgruppen und Attributgruppen zu Item-Typen vorhanden ist
            /// </summary>
            /// <param name="wrapper"></param>
            private void CheckAttributeGroupMappings(DataWrapper wrapper)
            {
                foreach (FieldInfo fi in AttributeSettings.Config.GetType().GetFields())
                {
                    AttributeSettings.AttributGroupMapping agm = fi.GetValue(AttributeSettings.Config) as AttributeSettings.AttributGroupMapping;
                    AttributeGroup attributeGroup = AttributeGroups[agm.AttributeGroupName];
                    OperationResult or;
                    for (int i = 0; i < agm.AttributeTypeNames.Length; i++)
                    {
                        AttributeType at = AttributeTypes[agm.AttributeTypeNames[i]];
                        or = wrapper.EnsureAttributeTypeMapping(attributeGroup, at);
                        if (!or.Success)
                        {
                            throw new Exception(or.Message);
                        }
                    }
                    for (int i = 0; i < agm.ItemTypeNames.Length; i++)
                    {
                        ItemType itemType = ItemTypes[agm.ItemTypeNames[i]];
                        or = wrapper.EnsureItemTypeAttributeGroupMapping(itemType, attributeGroup);
                        if (!or.Success)
                        {
                            throw new Exception(or.Message);
                        }
                    }
                }
            }

            private void FillConnectionRules(DataWrapper wrapper)
            {
                foreach (FieldInfo fi in ConnectionRuleSettings.Rules.GetType().GetFields())
                {
                    ConnectionRuleSettings.IRuleGroupSetting ruleGroup = fi.GetValue(ConnectionRuleSettings.Rules) as ConnectionRuleSettings.IRuleGroupSetting;
                    foreach (FieldInfo propertyInfo in ruleGroup.GetType().GetFields())
                    {
                        ConnectionRuleSettings.IConnectionRuleSetting ruleSetting = propertyInfo.GetValue(ruleGroup) as ConnectionRuleSettings.IConnectionRuleSetting;
                        ruleSetting.ConnectionRule = wrapper.EnsureConnectionRule(ItemTypes[ruleSetting.UpperItemType],
                            ConnectionTypes[ruleGroup.ConnectionType], ItemTypes[ruleSetting.LowerItemType],
                            ruleSetting.MaxConnectionsToUpper, ruleSetting.MaxConnectionsToLower);
                    }
                }
            }

            private void FillConnectionTypes(CmdbClient.DataWrapper wrapper)
            {
                foreach (PropertyInfo property in typeof(Settings.ConnectionTypes).GetProperties())
                {
                    Settings.ConnectionTypes.ConnectionType connectionType = property.GetValue(Settings.Config.ConnectionTypeNames) as Settings.ConnectionTypes.ConnectionType;
                    ConnectionType connType = wrapper.EnsureConnectionType(connectionType.TopDownName, connectionType.BottomUpName);
                    ConnectionTypes.Add(connectionType, connType);
                }
            }

            private void FillAttributeTypes(CmdbClient.DataWrapper wrapper)
            {
                foreach (PropertyInfo property in typeof(Settings.AttributeTypes).GetProperties())
                {
                    string name = property.GetValue(Settings.Config.AttributeTypeNames).ToString();
                    AttributeTypes.Add(name, wrapper.EnsureAttributeType(name));
                }
            }

            private void FillAttributeGroups(CmdbClient.DataWrapper wrapper)
            {
                foreach (PropertyInfo property in typeof(Settings.AttributeGroups).GetProperties())
                {
                    string name = property.GetValue(Settings.Config.AttributeGroupNames).ToString();
                    AttributeGroups.Add(name, wrapper.EnsureAttributeGroup(name));
                }
            }

            private void FillItemTypes(CmdbClient.DataWrapper wrapper)
            {
                foreach (PropertyInfo property in typeof(Settings.ConfigurationItemTypes).GetProperties())
                {
                    string name = property.GetValue(Settings.Config.ConfigurationItemTypeNames).ToString();
                    ItemTypes.Add(name, wrapper.EnsureItemType(name));
                }
            }
        }

        public MetaDataCache MetaData;
    }
}
