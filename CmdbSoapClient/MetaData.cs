using CmdbClient.CmsService;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace CmdbClient
{
    public class MetaData
    {
        private DataWrapper w = new DataWrapper();

        public ObservableCollection<AttributeGroup> AttributeGroups { get; } = new ObservableCollection<AttributeGroup>();

        public ObservableCollection<AttributeType> AttributeTypes { get; } = new ObservableCollection<AttributeType>();

        public ObservableCollection<ConnectionType> ConnectionTypes { get; } = new ObservableCollection<ConnectionType>();

        public ObservableCollection<ConnectionType> ConnectionTypesFilter { get; } = new ObservableCollection<ConnectionType>();

        public ObservableCollection<ItemType> ItemTypes { get; } = new ObservableCollection<ItemType>();

        public ObservableCollection<ItemType> ItemTypesFilter { get; } = new ObservableCollection<ItemType>();

        public Dictionary<string, Guid> AttributeGroupIds { get; } = new Dictionary<string, Guid>();

        public Dictionary<string, Guid> AttributeTypeIds { get; } = new Dictionary<string, Guid>();

        public Dictionary<string, Guid> ItemTypeIds { get; } = new Dictionary<string, Guid>();

        public void FillAll()
        {
            RefreshClient();
            FillAttributeGroups();
            FillAttributeTypes();
            FillConnectionTypes();
            FillItemTypes();
            w = null;
        }

        private bool RefreshClient()
        {
            if (w == null)
            {
                w = new DataWrapper();
                return true;
            }
            return false;
        }

        public void FillAttributeGroups()
        {
            bool b = RefreshClient();
            AttributeGroups.Clear();
            AttributeGroupIds.Clear();
            foreach (AttributeGroup item in w.GetAttributeGroups())
            {
                AttributeGroups.Add(item);
                AttributeGroupIds.Add(item.GroupName, item.GroupId);
            }
            if (b)
                w = null;
        }

        public void FillAttributeTypes()
        {
            bool b = RefreshClient();
            AttributeTypes.Clear();
            AttributeTypeIds.Clear();
            foreach (AttributeType item in w.GetAttributeTypes())
            {
                AttributeTypes.Add(item);
                AttributeTypeIds.Add(item.TypeName, item.TypeId);
            }
            if (b)
                w = null;
        }

        public void FillConnectionTypes()
        {
            bool b = RefreshClient();
            ConnectionTypes.Clear();
            ConnectionTypesFilter.Clear();
            ConnectionTypesFilter.Add(new ConnectionType() { ConnTypeId = Guid.Empty, ConnTypeName = "<alle anzeigen>" });
            foreach (ConnectionType item in w.GetConnectionTypes())
            {
                ConnectionTypes.Add(item);
                ConnectionTypesFilter.Add(item);
            }
            if (b)
                w = null;
        }

        public void FillItemTypes()
        {
            bool b = RefreshClient();
            ItemTypes.Clear();
            ItemTypesFilter.Clear();
            ItemTypeIds.Clear();
            ItemTypesFilter.Add(new ItemType() { TypeId = Guid.Empty, TypeName = "<alle anzeigen>" });
            foreach (ItemType item in w.GetItemTypes())
            {
                ItemTypes.Add(item);
                ItemTypesFilter.Add(item);
                ItemTypeIds.Add(item.TypeName, item.TypeId);
            }
            if (b)
                w = null;
        }
    }
}
