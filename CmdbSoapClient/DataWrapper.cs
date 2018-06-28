using CmdbClient.CmsService;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CmdbClient
{
    public class DataWrapper : IDisposable
    {
        private CmsService.CmsServiceClient client = new CmsService.CmsServiceClient();

        #region AttributeGroup

        public OperationResult CreateAttributeGroup(AttributeGroup attributeGroup)
        {
            return client.CreateAttributeGroup(attributeGroup);
        }

        public IEnumerable<AttributeGroup> GetAttributeGroups()
        {
            return client.GetAttributeGroups();
        }

        public AttributeGroup GetAttributeGroup(Guid id)
        {
            return client.GetAttributeGroup(id);
        }

        public IEnumerable<AttributeGroup> GetAttributeGroupsAssignedToItemType(Guid itemType)
        {
            return client.GetAttributeGroupsAssignedToItemType(itemType);
        }

        public IEnumerable<AttributeGroup> GetAttributeGroupsNotAssignedToItemType(Guid itemType)
        {
            return client.GetAttributeGroupsNotAssignedToItemType(itemType);
        }

        public bool CanDeleteAttributeGroup(AttributeGroup attributeGroup)
        {
            return client.CanDeleteAttributeGroup(attributeGroup);
        }

        public OperationResult UpdateAttributeGroup(AttributeGroup attributeGroup)
        {
            return client.UpdateAttributeGroup(attributeGroup);
        }

        public OperationResult DeleteAttributeGroup(AttributeGroup attributeGroup)
        {
            return client.DeleteAttributeGroup(attributeGroup);
        }

        #endregion

        #region AttributeType

        public OperationResult CreateAttributeType(AttributeType attributeType)
        {
            return client.CreateAttributeType(attributeType);
        }

        public IEnumerable<AttributeType> GetAttributeTypes()
        {
            return client.GetAttributeTypes();
        }

        public IEnumerable<AttributeType> GetAttributeTypesForAttributeGroup(AttributeGroup group)
        {
            return client.GetAttributeTypesForAttributeGroup(group);
        }

        public IEnumerable<AttributeType> GetAttributeTypesWithoutGroup()
        {
            return client.GetAttributeTypesWithoutGroup();
        }

        public IEnumerable<AttributeType> GetAttributeTypesForItemType(Guid itemTypeId)
        {
            return client.GetAttributeTypesForItemType(itemTypeId);
        }

        public IEnumerable<AttributeType> GetAttributeTypesForCorrespondingValuesOfType(Guid attributeTypeId)
        {
            return client.GetAttributeTypesForCorrespondingValuesOfType(attributeTypeId);
        }

        public AttributeType GetAttributeType(Guid id)
        {
            return client.GetAttributeType(id);
        }

        public bool CanDeleteAttributeType(AttributeType attributeType)
        {
            return client.CanDeleteAttributeType(attributeType);
        }

        public int GetItemAttributesCountForAttributeType(Guid attributeType)
        {
            return client.GetItemAttributesCountForAttributeType(attributeType);
        }

        public OperationResult UpdateAttributeType(AttributeType attributeType)
        {
            return client.UpdateAttributeType(attributeType);
        }

        public OperationResult DeleteAttributeType(AttributeType attributeType)
        {
            return client.DeleteAttributeType(attributeType);
        }

        #endregion

        #region ConnectionType

        public OperationResult CreateConnectionType(ConnectionType connectionType)
        {
            return client.CreateConnectionType(connectionType);
        }

        public IEnumerable<ConnectionType> GetAllowedDownwardConnnectionTypesForItemType(Guid itemTypeId)
        {
            return client.GetAllowedDownwardConnnectionTypesForItemType(itemTypeId);
        }

        public IEnumerable<ConnectionType> GetConnectionTypes()
        {
            return client.GetConnectionTypes();
        }

        public ConnectionType GetConnectionType(Guid id)
        {
            return client.GetConnectionType(id);
        }

        public bool CanDeleteConnectionType(ConnectionType connectionType)
        {
            return client.CanDeleteConnectionType(connectionType);
        }

        public OperationResult UpdateConnectionType(ConnectionType connectionType)
        {
            return client.UpdateConnectionType(connectionType);
        }

        public OperationResult DeleteConnectionType(ConnectionType connectionType)
        {
            return client.DeleteConnectionType(connectionType);
        }

        #endregion

        #region ConnectionRule

        public OperationResult CreateConnectionRule(ConnectionRule connectionRule)
        {
            return client.CreateConnectionRule(connectionRule);
        }

        public IEnumerable<ConnectionRule> GetConnectionRules()
        {
            return client.GetConnectionRules();
        }

        public ConnectionRule GetConnectionRule(Guid id)
        {
            return client.GetConnectionRule(id);
        }

        public IEnumerable<ConnectionRule> GetConnectionRulesForItemType(Guid itemType)
        {
            return client.GetConnectionRulesForItemType(itemType);
        }

        public IEnumerable<ConnectionRule> GetConnectionRulesByLowerItemType(Guid itemType)
        {
            return client.GetConnectionRulesByLowerItemType(itemType);
        }

        public IEnumerable<ConnectionRule> GetConnectionRulesByUpperItemType(Guid itemType)
        {
            return client.GetConnectionRulesByUpperItemType(itemType);
        }

        public IEnumerable<ConnectionRule> GetConnectionRulesByUpperAndLowerItemType(Guid upperItemType, Guid lowerItemType)
        {
            return client.GetConnectionRulesByUpperAndLowerItemType(upperItemType, lowerItemType);
        }

        public int GetConnectionCountForConnectionRule(Guid ruleId)
        {
            return client.GetConnectionCountForConnectionRule(ruleId);
        }

        public ConnectionRule GetConnectionRuleByContent(Guid upperItemType, Guid connectionType, Guid lowerItemType)
        {
            return client.GetConnectionRuleByContent(upperItemType, connectionType, lowerItemType);
        }

        public bool CanDeleteConnectionRule(ConnectionRule connectionRule)
        {
            return client.CanDeleteConnectionRule(connectionRule);
        }

        public OperationResult UpdateConnectionRule(ConnectionRule connectionRule)
        {
            return client.UpdateConnectionRule(connectionRule);
        }

        public OperationResult DeleteConnectionRule(ConnectionRule connectionRule)
        {
            return client.DeleteConnectionRule(connectionRule);
        }

        #endregion

        #region GroupAttributeTypeMapping

        public OperationResult CreateGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping)
        {
            return client.CreateGroupAttributeTypeMapping(groupAttributeTypeMapping);
        }

        public IEnumerable<GroupAttributeTypeMapping> GetGroupAttributeTypeMappings()
        {
            return client.GetGroupAttributeTypeMappings();
        }

        public GroupAttributeTypeMapping GetGroupAttributeTypeMapping(Guid groupId, Guid attributeTypeId)
        {
            return client.GetGroupAttributeTypeMapping(groupId, attributeTypeId);
        }

        public GroupAttributeTypeMapping GetGroupAttributeTypeMappingByAttributeType(Guid attributeTypeId)
        {
            return client.GetGroupAttributeTypeMappingByAttributeType(attributeTypeId);
        }

        public bool CanDeleteGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping)
        {
            return client.CanDeleteGroupAttributeTypeMapping(groupAttributeTypeMapping);
        }

        public OperationResult DeleteGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping)
        {
            return client.DeleteGroupAttributeTypeMapping(groupAttributeTypeMapping);
        }

        public OperationResult UpdateGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping, Guid newGroupId)
        {
            return client.UpdateGroupAttributeTypeMapping(groupAttributeTypeMapping, newGroupId);
        }

        #endregion

        #region ItemType

        public OperationResult CreateItemType(ItemType itemType)
        {
            return client.CreateItemType(itemType);
        }

        public IEnumerable<ItemType> GetItemTypes()
        {
            return client.GetItemTypes();
        }

        public IEnumerable<ItemType> GetLowerItemTypeForUpperItemTypeAndConnectionType(Guid upperItemTypeId, Guid connectionTypeId)
        {
            return client.GetLowerItemTypeForUpperItemTypeAndConnectionType(upperItemTypeId, connectionTypeId);
        }

        public IEnumerable<ItemType> GetUpperItemTypeForLowerItemTypeAndConnectionType(Guid lowerItemTypeId, Guid connectionTypeId)
        {
            return client.GetUpperItemTypeForLowerItemTypeAndConnectionType(lowerItemTypeId, connectionTypeId);
        }

        public IEnumerable<ItemType> GetItemTypesByAllowedAttributeType(Guid attributeTypeId)
        {
            return client.GetItemTypesByAllowedAttributeType(attributeTypeId);
        }

        public ItemType GetItemType(Guid id)
        {
            return client.GetItemType(id);
        }

        public bool CanDeleteItemType(ItemType itemType)
        {
            return client.CanDeleteItemType(itemType);
        }

        public OperationResult UpdateItemType(ItemType itemType)
        {
            return client.UpdateItemType(itemType);
        }

        public OperationResult DeleteItemType(ItemType itemType)
        {
            return client.DeleteItemType(itemType);
        }

        public int GetItemTypesCount()
        {
            return client.GetItemTypesCount();
        }

        #endregion

        #region ItemTypeAttributeGroupMapping

        public OperationResult CreateItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
        {
            return client.CreateItemTypeAttributeGroupMapping(itemTypeAttributeMapping);
        }

        public IEnumerable<ItemTypeAttributeGroupMapping> GetItemTypeAttributeGroupMapping()
        {
            return client.GetItemTypeAttributeGroupMappings();
        }

        public bool CanDeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
        {
            return client.CanDeleteItemTypeAttributeGroupMapping(itemTypeAttributeMapping);
        }

        public OperationResult DeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
        {
            return client.DeleteItemTypeAttributeGroupMapping(itemTypeAttributeMapping);
        }

        #endregion

        #region ConfigurationItems

        public ConfigurationItem GetConfigurationItem(Guid itemId)
        {
            return client.GetConfigurationItem(itemId);
        }

        public IEnumerable<ConfigurationItem> GetConfigurationItems()
        {
            return client.GetConfigurationItems();
        }

        public IEnumerable<ConfigurationItem> SearchConfigurationItems(Search search)
        {
            return client.SearchConfigurationItems(search);
        }

        public IEnumerable<NeighborItem> SearchNeighborConfigurationItems(NeighborSearch search)
        {
            return client.SearchNeighborConfigurationItems(search);
        }

        public IEnumerable<ConfigurationItem> GetConfigurationItemsByType(Guid typeId)
        {
            return client.GetConfigurationItemsByType(new Guid[] { typeId });
        }

        public IEnumerable<ConfigurationItem> GetConfigurationItemsByTypes(IEnumerable<Guid> typeIds)
        {
            return client.GetConfigurationItemsByType(typeIds.ToArray());
        }

        public IEnumerable<ConfigurationItem> GetConfigurationItemsByTypeName(string typeName)
        {
            return client.GetConfigurationItemsByTypeName(new string[] { typeName });
        }

        public ConfigurationItem GetConfigurationItemByTypeIdAndName(Guid itemType, string itemName)
        {
            return client.GetConfigurationItemByTypeIdAndName(itemType, itemName);
        }

        public IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsLowerItem(Guid itemId, Guid ruleId)
        {
            return client.GetConfigurationItemsConnectableAsLowerItem(itemId, ruleId);
        }

        public IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsUpperItem(Guid itemId, Guid ruleId)
        {
            return client.GetConfigurationItemsConnectableAsUpperItem(itemId, ruleId);
        }

        public OperationResult CreateConfigurationItem(ConfigurationItem item)
        {
            return client.CreateConfigurationItem(item);
        }

        public OperationResult UpdateConfigurationItem(ConfigurationItem item)
        {
            return client.UpdateConfigurationItem(item);
        }

        public OperationResult DeleteConfigurationItem(ConfigurationItem item)
        {
            return client.DeleteConfigurationItem(item);
        }

        public OperationResult TakeResponsibilityForConfigurationItem(ConfigurationItem item)
        {
            return client.TakeResponsibilityForConfigurationItem(item);
        }

        public OperationResult AbandonResponsibilityForConfigurationItem(ConfigurationItem item)
        {
            return client.AbandonResponsibilityForConfigurationItem(item);
        }

        #endregion

        #region ItemAttributes

        public IEnumerable<ItemAttribute> GetAttributesForConfigurationItem(Guid itemId)
        {
            return client.GetAttributesForConfigurationItem(itemId);
        }

        public ItemAttribute GetAttribute(Guid id)
        {
            return client.GetAttribute(id);
        }

        public ItemAttribute GetAttributeForConfigurationItemByAttributeType(Guid itemId, Guid attributeTypeId)
        {
            return client.GetAttributeForConfigurationItemByAttributeType(itemId, attributeTypeId);
        }

        public ItemAttribute GetAttributeForConfigurationItemByAttributeTypeName(Guid itemId, string attributeTypeName)
        {
            return client.GetAttributeForConfigurationItemByAttributeTypeName(itemId, attributeTypeName);
        }

        public IEnumerable<ItemAttribute> GetAttributesForAttributeType(Guid attributeTypeId)
        {
            return client.GetAttributesForAttributeType(attributeTypeId);
        }

        public OperationResult CreateItemAttribute(ItemAttribute attribute)
        {
            return client.CreateItemAttribute(attribute);
        }

        public OperationResult UpdateItemAttribute(ItemAttribute attribute)
        {
            return client.UpdateItemAttribute(attribute);
        }

        public OperationResult DeleteItemAttribute(ItemAttribute attribute)
        {
            return client.DeleteItemAttribute(attribute);
        }

        #endregion

        #region Connections

        public IEnumerable<Connection> GetConnectionsForItem(Guid itemId)
        {
            return client.GetConnectionsForItem(itemId);
        }

        public IEnumerable<Connection> GetConnectionsToLowerForItem(Guid itemId)
        {
            return client.GetConnectionsToLowerForItem(itemId);
        }

        public IEnumerable<Connection> GetConnectionsToUpperForItem(Guid itemId)
        {
            return client.GetConnectionsToUpperForItem(itemId);
        }

        public Connection GetConnection(Guid connId)
        {
            return client.GetConnection(connId);
        }

        public Connection GetConnectionByContent(Guid upperItemId, Guid connectionTypeId, Guid lowerItemId)
        {
            return client.GetConnectionByContent(upperItemId, connectionTypeId, lowerItemId);
        }

        public OperationResult CreateConnection(Connection connection)
        {
            return client.CreateConnection(connection);
        }

        public OperationResult DeleteConnection(Connection connection)
        {
            return client.DeleteConnection(connection);
        }

        #endregion

        #region ItemLinks

        public IEnumerable<ItemLink> GetLinksForConfigurationItem(Guid itemId)
        {
            return client.GetLinksForConfigurationItem(itemId);
        }

        public OperationResult CreateLink(ItemLink link)
        {
            return client.CreateLink(link);
        }

        public OperationResult DeleteLink(ItemLink link)
        {
            return client.DeleteLink(link);
        }

        #endregion

        #region Responsibility

        public IEnumerable<ItemResponsibility> GetResponsibilitesForConfigurationItem(ConfigurationItem item)
        {
            return client.GetResponsibilitesForConfigurationItem(item);
        }

        #endregion

        #region Roles

        public UserRole GetRoleForUser()
        {
            return client.GetRoleForUser();
        }

        #endregion

        #region IDisposable

        public void Dispose()
        {
            ((IDisposable)client).Dispose();
        }

        #endregion

    }
}

