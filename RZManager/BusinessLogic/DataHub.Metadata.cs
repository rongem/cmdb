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

            public Dictionary<string, AttributeGroup> AttributeGrougs { get; private set; } = new Dictionary<string, AttributeGroup>();

            public Dictionary<string, AttributeType> AttributeTypes { get; private set; } = new Dictionary<string, AttributeType>();

            public Dictionary<Settings.ConnectionTypes.ConnectionType, ConnectionType> ConnectionTypes { get; private set; } = new Dictionary<Settings.ConnectionTypes.ConnectionType, ConnectionType>();

            public MetaDataCache(CmdbClient.DataWrapper wrapper)
            {
                try
                {
                    FillItemTypes(wrapper);
                    FillAttributeGroups(wrapper);
                    FillAttributeTypes(wrapper);
                    FillConnectionTypes(wrapper);
                    FillConnectionRules(wrapper);
                }
                catch (Exception ex)
                {
                    System.Windows.MessageBox.Show(ex.Message, "Fehler bei der Initialisierung", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Error);
                    Environment.Exit(1);
                }
            }

            private void FillConnectionRules(DataWrapper wrapper)
            {
                
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
                    AttributeGrougs.Add(name, wrapper.EnsureAttributeGroup(name));
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
