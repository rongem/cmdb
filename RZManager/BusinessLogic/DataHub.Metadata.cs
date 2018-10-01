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
            public Dictionary<string, ItemType> ItemTypes { get; private set; } = new Dictionary<string, ItemType>();

            public Dictionary<string, AttributeGroup> AttributeGroups { get; private set; } = new Dictionary<string, AttributeGroup>();

            public Dictionary<string, AttributeType> AttributeTypes { get; private set; } = new Dictionary<string, AttributeType>();

            public Dictionary<Settings.ConnectionTypes.ConnectionType, ConnectionType> ConnectionTypes { get; private set; } = new Dictionary<Settings.ConnectionTypes.ConnectionType, ConnectionType>();

            /// <summary>
            /// Liste aller bekannten Enclosure-Types, die aus den entsprechenden Produkten generiert werden
            /// </summary>
            public List<EnclosureType> EnclosureTypes { get; } = new List<EnclosureType>();

            public MetaDataCache(DataWrapper wrapper)
            {
                try
                {
                    FillItemTypes(wrapper);
                    FillAttributeGroups(wrapper);
                    FillAttributeTypes(wrapper);
                    FillConnectionTypes(wrapper);
                    FillConnectionRules(wrapper);
                    CheckAttributeGroupMappings(wrapper);
                    FillEnclosureTypes(wrapper);
                }
                catch (Exception ex)
                {
                    System.Windows.MessageBox.Show(ex.Message, "Fehler bei der Initialisierung", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Error);
                    Environment.Exit(1);
                }
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
                    EnclosureTypeTemplate encTypeTemplate = GetEnclosureTypeTemplate(p.name);
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
                        HeightUnits = encTypeTemplate.HeightUnits,
                    };
                    EnclosureTypes.Add(encType);
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
