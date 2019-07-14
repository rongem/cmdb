using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;

namespace CmdbSoapAPI
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ICmsService" in both code and config file together.
    //[WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "GetSingleCI/{id}")]
    [ServiceContract]
    public interface ICmsService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "Test")]
        string Test();

        #region Read
        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Bare, UriTemplate = "Item/{itemId}")]
        Item GetItem(string itemId);

        [OperationContract]
        ConfigurationItem GetConfigurationItem(Guid itemId);

        [OperationContract]
        IEnumerable<ConfigurationItem> GetConfigurationItems();

        [OperationContract]
        IEnumerable<ConfigurationItem> SearchConfigurationItems(Search search);

        [OperationContract]
        IEnumerable<NeighborItem> SearchNeighborConfigurationItems(NeighborSearch search);

        [OperationContract]
        IEnumerable<ConfigurationItem> GetConfigurationItemsByType(Guid[] typeId);

        [OperationContract]
        IEnumerable<ConfigurationItem> GetConfigurationItemsByTypeName(string[] typeName);

        [OperationContract]
        ConfigurationItem GetConfigurationItemByTypeIdAndName(Guid itemType, string itemName);

        [OperationContract]
        IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsLowerItem(Guid itemId, Guid ruleId);

        [OperationContract]
        IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsUpperItem(Guid itemId, Guid ruleId);

        [OperationContract]
        IEnumerable<ItemResponsibility> GetResponsibilitesForConfigurationItem(ConfigurationItem item);

        [OperationContract]
        IEnumerable<ItemAttribute> GetAttributesForConfigurationItem(Guid itemId);

        [OperationContract]
        IEnumerable<ItemAttribute> GetAttributesForAttributeType(Guid attributeTypeId);

        [OperationContract]
        ItemAttribute GetAttribute(Guid attributeId);

        [OperationContract]
        ItemAttribute GetAttributeForConfigurationItemByAttributeType(Guid itemId, Guid typeId);

        [OperationContract]
        ItemAttribute GetAttributeForConfigurationItemByAttributeTypeName(Guid itemId, string typeName);

        [OperationContract]
        IEnumerable<Connection> GetConnectionsForItem(Guid itemId);

        [OperationContract]
        IEnumerable<Connection> GetConnectionsToLowerForItem(Guid itemId);

        [OperationContract]
        IEnumerable<Connection> GetConnectionsToUpperForItem(Guid itemId);

        [OperationContract]
        Connection GetConnectionByContent(Guid upperItemId, Guid connectionTypeId, Guid lowerItemId);

        [OperationContract]
        IEnumerable<ItemLink> GetLinksForConfigurationItem(Guid itemId);

        [OperationContract]
        Connection GetConnection(Guid connId);
        #endregion

        #region ReadMetaData
        [OperationContract]
        IEnumerable<AttributeGroup> GetAttributeGroups();

        [OperationContract]
        AttributeGroup GetAttributeGroup(Guid id);

        [OperationContract]
        IEnumerable<AttributeGroup> GetAttributeGroupsAssignedToItemType(Guid itemType);

        [OperationContract]
        IEnumerable<AttributeGroup> GetAttributeGroupsNotAssignedToItemType(Guid itemType);

        [OperationContract]
        List<AttributeType> GetAttributeTypes();

        [OperationContract]
        AttributeType GetAttributeType(Guid id);

        [OperationContract]
        IEnumerable<AttributeType> GetAttributeTypesForAttributeGroup(AttributeGroup group);

        [OperationContract]
        IEnumerable<AttributeType> GetAttributeTypesForItemType(Guid itemTypeId);

        [OperationContract]
        IEnumerable<AttributeType> GetAttributeTypesForCorrespondingValuesOfType(Guid attributeTypeId);

        [OperationContract]
        IEnumerable<ConnectionType> GetAllowedDownwardConnnectionTypesForItemType(Guid itemTypeId);

        [OperationContract]
        IEnumerable<ItemType> GetLowerItemTypeForUpperItemTypeAndConnectionType(Guid upperItemTypeId, Guid connectionTypeId);

        [OperationContract]
        IEnumerable<ItemType> GetUpperItemTypeForLowerItemTypeAndConnectionType(Guid lowerItemTypeId, Guid connectionTypeId);

        [OperationContract]
        IEnumerable<ConnectionRule> GetConnectionRules();

        [OperationContract]
        IEnumerable<ConnectionRule> GetConnectionRulesForItemType(Guid itemType);

        [OperationContract]
        IEnumerable<ConnectionRule> GetConnectionRulesByUpperItemType(Guid itemType);

        [OperationContract]
        IEnumerable<ConnectionRule> GetConnectionRulesByLowerItemType(Guid itemType);

        [OperationContract]
        ConnectionRule GetConnectionRule(Guid id);

        [OperationContract]
        ConnectionRule GetConnectionRuleByContent(Guid upperItemType, Guid connectionType, Guid lowerItemType);

        [OperationContract]
        IEnumerable<ConnectionRule> GetConnectionRulesByUpperAndLowerItemType(Guid upperItemType, Guid lowerItemType);

        [OperationContract]
        IEnumerable<ConnectionType> GetConnectionTypes();

        [OperationContract]
        ConnectionType GetConnectionType(Guid id);

        [OperationContract]
        IEnumerable<ItemType> GetItemTypes();

        [OperationContract]
        ItemType GetItemType(Guid id);

        [OperationContract]
        IEnumerable<ItemType> GetItemTypesByAllowedAttributeType(Guid id);

        [OperationContract]
        IEnumerable<ItemTypeAttributeGroupMapping> GetItemTypeAttributeGroupMappings();

        #endregion

        #region Create
        [OperationContract]
        OperationResult TakeResponsibilityForConfigurationItem(ConfigurationItem item);

        [OperationContract]
        OperationResult CreateAttributeGroup(AttributeGroup attributeGroup);

        [OperationContract]
        OperationResult CreateAttributeType(AttributeType attributeType);

        [OperationContract]
        OperationResult CreateConnectionRule(ConnectionRule connectionRule);

        [OperationContract]
        OperationResult CreateConnectionType(ConnectionType connectionType);

        [OperationContract]
        OperationResult CreateItemType(ItemType itemType);

        [OperationContract]
        OperationResult CreateItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping);

        [OperationContract]
        OperationResult CreateConfigurationItem(ConfigurationItem item);

        #endregion

        #region Update

        [OperationContract]
        OperationResult UpdateAttributeGroup(AttributeGroup attributeGroup);

        [OperationContract]
        OperationResult UpdateAttributeType(AttributeType attributeType);

        [OperationContract]
        OperationResult UpdateConnectionRule(ConnectionRule connectionRule);

        [OperationContract]
        OperationResult UpdateConnectionType(ConnectionType connectionType);

        [OperationContract]
        OperationResult UpdateItemType(ItemType itemType);

        [OperationContract]
        OperationResult UpdateItemAttribute(ItemAttribute attribute);

        [OperationContract]
        OperationResult UpdateConfigurationItem(ConfigurationItem item);

        #endregion

        #region Delete
        [OperationContract]
        OperationResult AbandonResponsibilityForConfigurationItem(ConfigurationItem item);

        [OperationContract]
        OperationResult DeleteAttributeGroup(AttributeGroup attributeGroup);

        [OperationContract]
        OperationResult DeleteAttributeType(AttributeType attributeType);

        [OperationContract]
        OperationResult DeleteConnectionRule(ConnectionRule connectionRule);

        [OperationContract]
        OperationResult DeleteConnectionType(ConnectionType connectionType);

        [OperationContract]
        OperationResult DeleteItemType(ItemType itemType);

        [OperationContract]
        OperationResult DeleteConfigurationItem(ConfigurationItem item);

        [OperationContract]
        OperationResult DeleteConnection(Connection connection);

        [OperationContract]
        OperationResult DeleteItemAttribute(ItemAttribute attribute);

        [OperationContract]
        OperationResult DeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping);

        [OperationContract]
        OperationResult CreateItemAttribute(ItemAttribute attribute);

        [OperationContract]
        OperationResult CreateConnection(Connection connection);

        [OperationContract]
        OperationResult CreateLink(ItemLink link);

        [OperationContract]
        OperationResult DeleteLink(ItemLink link);

        #endregion

        #region CanDelete

        [OperationContract]
        bool CanDeleteAttributeGroup(AttributeGroup attributeGroup);

        [OperationContract]
        bool CanDeleteAttributeType(AttributeType attributeType);

        [OperationContract]
        bool CanDeleteConnectionRule(ConnectionRule connectionRule);

        [OperationContract]
        bool CanDeleteConnectionType(ConnectionType connectionType);

        [OperationContract]
        bool CanDeleteItemType(ItemType itemType);

        [OperationContract]
        bool CanDeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping);


        #endregion

        #region Aggregate

        [OperationContract]
        int GetConnectionCountForConnectionRule(Guid ruleId);

        [OperationContract]
        int GetItemAttributesCountForAttributeType(Guid attributeType);

        [OperationContract]
        int GetItemTypesCount();

        #endregion

        #region User

        [OperationContract]
        UserRole GetRoleForUser();

        #endregion
    }
}