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

            public Dictionary<string, AttributeGroup> AttributeGrougs { get; private set; } = new Dictionary<string, AttributeGroup>();

            public Dictionary<string, AttributeType> AttributeTypes { get; private set; } = new Dictionary<string, AttributeType>();

            public Dictionary<Settings.ConnectionTypes.ConnectionType, ConnectionType> ConnectionTypes { get; private set; } = new Dictionary<Settings.ConnectionTypes.ConnectionType, ConnectionType>();

            public MetaDataCache(CmdbClient.DataWrapper wrapper)
            {
                try
                {
                    foreach (FieldInfo field in typeof(Settings.ConfigurationItemTypes).GetFields())
                    {
                        string name = field.GetValue(Settings.Config.ConfigurationItemTypeNames).ToString();
                        ItemTypes.Add(name, wrapper.EnsureItemType(name));
                    }
                    foreach (FieldInfo field in typeof(Settings.AttributeGroups).GetFields())
                    {
                        string name = field.GetValue(Settings.Config.AttributeGroupNames).ToString();
                        AttributeGrougs.Add(name, wrapper.EnsureAttributeGroup(name));
                    }
                    foreach (FieldInfo field in typeof(Settings.AttributeTypes).GetFields())
                    {
                        string name = field.GetValue(Settings.Config.AttributeTypeNames).ToString();
                        AttributeTypes.Add(name, wrapper.EnsureAttributeType(name));
                    }
                    foreach (FieldInfo field in typeof(Settings.ConnectionTypes).GetFields())
                    {
                        Settings.ConnectionTypes.ConnectionType connectionType = field.GetValue(Settings.Config.ConnectionTypeNames) as Settings.ConnectionTypes.ConnectionType;
                        ConnectionType connType = wrapper.EnsureConnectionType(connectionType.TopDownName, connectionType.BottomUpName);
                        ConnectionTypes.Add(connectionType, connType);
                    }
                }
                catch (Exception ex)
                {
                    System.Windows.MessageBox.Show(ex.Message, "Fehler bei der Initialisierung", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Error);
                    Environment.Exit(1);
                }
            }
        }

        public MetaDataCache MetaData;
    }
}
