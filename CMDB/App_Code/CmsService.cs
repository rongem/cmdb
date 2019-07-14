using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.ServiceModel;

namespace CmdbSoapAPI
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "CmsService" in code, svc and config file together.
    public class CmsService : ICmsService
    {
        #region RestAPI

        /// <summary>
        /// Gibt den Anmeldenamen zurück
        /// </summary>
        /// <returns></returns>
        public string Test()
        {
            return ServiceSecurityContext.Current.WindowsIdentity.Name;
        }

        /// <summary>
        /// Gibt ein vollständiges Item als JSON zurück
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public Item GetItem(string itemId)
        {
            Guid id;
            if (!Guid.TryParse(itemId, out id))
                return null;

            try
            {
                return DataHandler.GetItem(id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        #endregion

        #region AttributeGroup

        public OperationResult CreateAttributeGroup(AttributeGroup attributeGroup)
        {
            try
            {
                MetaDataHandler.CreateAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public IEnumerable<AttributeGroup> GetAttributeGroups()
        {
            return MetaDataHandler.GetAttributeGroups();
        }

        public AttributeGroup GetAttributeGroup(Guid id)
        {
            try
            {
                return MetaDataHandler.GetAttributeGroup(id);
            }
            catch (Exception)
            {
                return null;
            };
        }

        public IEnumerable<AttributeGroup> GetAttributeGroupsAssignedToItemType(Guid itemType)
        {
            try
            {
                return MetaDataHandler.GetAttributeGroupsAssignedToItemType(itemType);
            }
            catch (Exception)
            {
                return null;
            };
        }

        public IEnumerable<AttributeGroup> GetAttributeGroupsNotAssignedToItemType(Guid itemType)
        {
            try
            {
                return MetaDataHandler.GetAttributeGroupsNotAssignedToItemType(itemType);
            }
            catch (Exception)
            {
                return null;
            };
        }

        public bool CanDeleteAttributeGroup(AttributeGroup attributeGroup)
        {
            try
            {
                return MetaDataHandler.CanDeleteAttributeGroup(attributeGroup.GroupId);
            }
            catch
            {
                return false;
            }

        }

        public OperationResult UpdateAttributeGroup(AttributeGroup attributeGroup)
        {
            try
            {
                MetaDataHandler.UpdateAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public OperationResult DeleteAttributeGroup(AttributeGroup attributeGroup)
        {
            try
            {
                MetaDataHandler.DeleteAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        #endregion

        #region ConfigurationItems

        /// <summary>
        /// Gibt ein Configuration Item mit Verantwortlichkeiten, aber ohne Verbindungen und Attribute zurück
        /// </summary>
        /// <param name="itemId">Guid des gewünschen CI</param>
        /// <returns></returns>
        public ConfigurationItem GetConfigurationItem(Guid itemId)
        {
            try
            {
                return DataHandler.GetConfigurationItem(itemId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Gibt alle Configuration Items zurück
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ConfigurationItem> GetConfigurationItems()
        {
            try
            {
                return DataHandler.GetConfigurationItems();
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Sucht die Configuration Items nach Parametern ab
        /// </summary>
        /// <param name="search">Suchparameter</param>
        /// <returns></returns>
        public IEnumerable<ConfigurationItem> SearchConfigurationItems(Search search)
        {
            try
            {
                return DataHandler.SearchConfigurationItems(search);
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Sucht die Configation Items, ausgehend von einem angegebenen, nach Parametern ab
        /// </summary>
        /// <param name="search">Suchparamter</param>
        /// <returns></returns>
        public IEnumerable<NeighborItem> SearchNeighborConfigurationItems(NeighborSearch search)
        {
            try
            {
                return DataHandler.SearchNeighbors(search);
            }
            catch (Exception)
            {
                return null;
            }
        }


        /// <summary>
        /// Gibt alle Configuration Items eines angegebenen Typs zurück
        /// </summary>
        /// <param name="typeIds">Guid des ItemTypes</param>
        /// <returns></returns>
        public IEnumerable<ConfigurationItem> GetConfigurationItemsByType(Guid[] typeIds)
        {
            try
            {
                return DataHandler.GetConfigurationItemsByType(typeIds);
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Gibt alle Configuration Items eines angegebenen Typs zurück
        /// </summary>
        /// <param name="typeNames">Name des ItemType</param>
        /// <returns></returns>
        public IEnumerable<ConfigurationItem> GetConfigurationItemsByTypeName(string[] typeNames)
        {
            try
            {
                return DataHandler.GetConfigurationItemsByTypeName(typeNames);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ConfigurationItem GetConfigurationItemByTypeIdAndName(Guid itemType, string itemName)
        {
            try
            {
                return DataHandler.GetConfigurationItemByTypeIdAndName(itemType, itemName);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsLowerItem(Guid itemId, Guid ruleId)
        {
            try
            {
                return DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, ruleId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsUpperItem(Guid itemId, Guid ruleId)
        {
            try
            {
                return DataHandler.GetConfigurationItemsConnectableAsUpperItem(itemId, ruleId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public OperationResult CreateConfigurationItem(ConfigurationItem item)
        {
            try
            {
                DataHandler.CreateConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        public OperationResult UpdateConfigurationItem(ConfigurationItem item)
        {
            try
            {
                DataHandler.UpdateConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        public OperationResult DeleteConfigurationItem(ConfigurationItem item)
        {
            try
            {
                DataHandler.DeleteConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        public OperationResult TakeResponsibilityForConfigurationItem(ConfigurationItem item)
        {
            try
            {
                SecurityHandler.TakeResponsibility(item.ItemId, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        public OperationResult AbandonResponsibilityForConfigurationItem(ConfigurationItem item)
        {
            try
            {
                SecurityHandler.AbandonResponsibility(item.ItemId, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        #endregion

        #region ItemAttributes

        public IEnumerable<ItemAttribute> GetAttributesForConfigurationItem(Guid itemId)
        {
            try
            {
                return DataHandler.GetAttributesForConfigurationItem(itemId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ItemAttribute GetAttribute(Guid attributeId)
        {
            try
            {
                return DataHandler.GetAttribute(attributeId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ItemAttribute GetAttributeForConfigurationItemByAttributeType(Guid itemId, Guid attributeTypeId)
        {
            try
            {
                return DataHandler.GetAttributeForConfigurationItemByAttributeType(itemId, attributeTypeId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<ItemAttribute> GetAttributesForAttributeType(Guid attributeTypeId)
        {
            try
            {
                return DataHandler.GetAttributeForAttributeType(attributeTypeId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ItemAttribute GetAttributeForConfigurationItemByAttributeTypeName(Guid itemId, string attributeTypeName)
        {
            try
            {
                return DataHandler.GetAttributeForConfigurationItemByAttributeTypeName(itemId, attributeTypeName);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public OperationResult CreateItemAttribute(ItemAttribute attribute)
        {
            try
            {
                DataHandler.CreateAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        public OperationResult UpdateItemAttribute(ItemAttribute attribute)
        {
            try
            {
                DataHandler.UpdateAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        public OperationResult DeleteItemAttribute(ItemAttribute attribute)
        {
            try
            {
                DataHandler.DeleteAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        #endregion

        #region AttributeTypes

        public OperationResult CreateAttributeType(AttributeType attributeType)
        {
            try
            {
                MetaDataHandler.CreateAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public List<AttributeType> GetAttributeTypes()
        {
            List<AttributeType> l = new List<AttributeType>();
            l.AddRange(MetaDataHandler.GetAttributeTypes());
            return l;
        }

        public IEnumerable<AttributeType> GetAttributeTypesForAttributeGroup(AttributeGroup group)
        {
            return MetaDataHandler.GetAttributeTypesForAttributeGroup(group);
        }

        public IEnumerable<AttributeType> GetAttributeTypesForCorrespondingValuesOfType(Guid attributeTypeId)
        {
            return MetaDataHandler.GetAttributeTypesForCorrespondingValuesOfType(attributeTypeId);
        }

        public AttributeType GetAttributeType(Guid id)
        {
            try
            {
                return MetaDataHandler.GetAttributeType(id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public bool CanDeleteAttributeType(AttributeType attributeType)
        {
            try
            {
                return MetaDataHandler.CanDeleteAttributeType(attributeType.TypeId);
            }
            catch
            {
                return false;
            }

        }

        public int GetItemAttributesCountForAttributeType(Guid attributeType)
        {
            return MetaDataHandler.GetItemAttributesCountForAttributeType(attributeType);
        }

        public IEnumerable<AttributeType> GetAttributeTypesForItemType(Guid itemTypeId)
        {
            try
            {
                return MetaDataHandler.GetAllowedAttributeTypesForItemType(itemTypeId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public OperationResult UpdateAttributeType(AttributeType attributeType)
        {
            try
            {
                MetaDataHandler.UpdateAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public OperationResult DeleteAttributeType(AttributeType attributeType)
        {
            try
            {
                MetaDataHandler.DeleteAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        #endregion

        #region Connections

        public IEnumerable<Connection> GetConnectionsForItem(Guid itemId)
        {
            try
            {
                return DataHandler.GetConnectionsForItem(itemId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<Connection> GetConnectionsToLowerForItem(Guid itemId)
        {
            try
            {
                return DataHandler.GetConnectionsToLowerForItem(itemId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<Connection> GetConnectionsToUpperForItem(Guid itemId)
        {
            try
            {
                return DataHandler.GetConnectionsToUpperForItem(itemId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Connection GetConnection(Guid connId)
        {
            try
            {
                return DataHandler.GetConnection(connId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Connection GetConnectionByContent(Guid upperItemId, Guid connectionTypeId, Guid lowerItemId)
        {
            try
            {
                return DataHandler.GetConnectionByContent(upperItemId, connectionTypeId, lowerItemId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public OperationResult CreateConnection(Connection connection)
        {
            try
            {
                DataHandler.CreateConnection(connection, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        public OperationResult DeleteConnection(Connection connection)
        {
            try
            {
                DataHandler.DeleteConnection(connection, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        #endregion

        #region ConnectionRule

        public OperationResult CreateConnectionRule(ConnectionRule connectionRule)
        {
            try
            {
                MetaDataHandler.CreateConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public IEnumerable<ConnectionRule> GetConnectionRules()
        {
            return MetaDataHandler.GetConnectionRules();
        }

        public ConnectionRule GetConnectionRule(Guid id)
        {
            try
            {
                return MetaDataHandler.GetConnectionRule(id);
            }
            catch (Exception)
            {
                return null;
            };
        }

        public IEnumerable<ConnectionRule> GetConnectionRulesForItemType(Guid itemType)
        {
            return MetaDataHandler.GetConnectionRulesForItemType(itemType);
        }

        public IEnumerable<ConnectionRule> GetConnectionRulesByUpperItemType(Guid itemType)
        {
            return MetaDataHandler.GetConnectionRulesByUpperItemType(itemType);
        }

        public IEnumerable<ConnectionRule> GetConnectionRulesByLowerItemType(Guid itemType)
        {
            return MetaDataHandler.GetConnectionRulesByLowerItemType(itemType);
        }

        public IEnumerable<ConnectionRule> GetConnectionRulesByUpperAndLowerItemType(Guid upperItemType, Guid lowerItemType)
        {
            return MetaDataHandler.GetConnectionRulesByUpperAndLowerItemType(upperItemType, lowerItemType);
        }

        public int GetConnectionCountForConnectionRule(Guid ruleId)
        {
            return MetaDataHandler.GetConnectionCountForConnectionRule(ruleId);
        }

        public ConnectionRule GetConnectionRuleByContent(Guid upperItemType, Guid connectionType, Guid lowerItemType)
        {
            return MetaDataHandler.GetConnectionRuleByContent(upperItemType, connectionType, lowerItemType);
        }

        public bool CanDeleteConnectionRule(ConnectionRule connectionRule)
        {
            try
            {
                return MetaDataHandler.CanDeleteConnectionRule(connectionRule.RuleId);
            }
            catch
            {
                return false;
            }

        }

        public OperationResult UpdateConnectionRule(ConnectionRule connectionRule)
        {
            try
            {
                MetaDataHandler.UpdateConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public OperationResult DeleteConnectionRule(ConnectionRule connectionRule)
        {
            try
            {
                MetaDataHandler.DeleteConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        #endregion

        #region ConnectionType

        public OperationResult CreateConnectionType(ConnectionType connectionType)
        {
            try
            {
                MetaDataHandler.CreateConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public IEnumerable<ConnectionType> GetConnectionTypes()
        {
            return MetaDataHandler.GetConnectionTypes();
        }

        public IEnumerable<ConnectionType> GetAllowedDownwardConnnectionTypesForItemType(Guid itemTypeId)
        {
            try
            {
                return MetaDataHandler.GetAllowedDownwardConnnectionTypesForItemType(itemTypeId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ConnectionType GetConnectionType(Guid id)
        {
            try
            {
                return MetaDataHandler.GetConnectionType(id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public bool CanDeleteConnectionType(ConnectionType connectionType)
        {
            try
            {
                return MetaDataHandler.CanDeleteConnectionType(connectionType.ConnTypeId);
            }
            catch
            {
                return false;
            }

        }

        public OperationResult UpdateConnectionType(ConnectionType connectionType)
        {
            try
            {
                MetaDataHandler.UpdateConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public OperationResult DeleteConnectionType(ConnectionType connectionType)
        {
            try
            {
                MetaDataHandler.DeleteConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        #endregion

        #region ItemType

        public OperationResult CreateItemType(ItemType itemType)
        {
            try
            {
                MetaDataHandler.CreateItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public IEnumerable<ItemType> GetItemTypes()
        {
            return MetaDataHandler.GetItemTypes();
        }

        public ItemType GetItemType(Guid id)
        {
            try
            {
                return MetaDataHandler.GetItemType(id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<ItemType> GetLowerItemTypeForUpperItemTypeAndConnectionType(Guid upperItemTypeId, Guid connectionTypeId)
        {
            try
            {
                return MetaDataHandler.GetLowerItemTypeForUpperItemTypeAndConnectionType(upperItemTypeId, connectionTypeId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public IEnumerable<ItemType> GetUpperItemTypeForLowerItemTypeAndConnectionType(Guid lowerItemTypeId, Guid connectionTypeId)
        {
            try
            {
                return MetaDataHandler.GetUpperItemTypeForLowerItemTypeAndConnectionType(lowerItemTypeId, connectionTypeId);
            }
            catch (Exception)
            {
                return null;
            }
        }


        public IEnumerable<ItemType> GetItemTypesByAllowedAttributeType(Guid id)
        {
            try
            {
                return MetaDataHandler.GetItemTypesByAllowedAttributeType(id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public int GetItemTypesCount()
        {
            try
            {
                return MetaDataHandler.GetItemTypesCount();
            }
            catch (Exception)
            {
                return -1;
            };
        }

        public bool CanDeleteItemType(ItemType itemType)
        {
            try
            {
                return MetaDataHandler.CanDeleteItemType(itemType.TypeId);
            }
            catch
            {
                return false;
            }

        }

        public OperationResult UpdateItemType(ItemType itemType)
        {
            try
            {
                MetaDataHandler.UpdateItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public OperationResult DeleteItemType(ItemType itemType)
        {
            try
            {
                MetaDataHandler.DeleteItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        #endregion

        #region ItemLinks

        public IEnumerable<ItemLink> GetLinksForConfigurationItem(Guid itemId)
        {
            try
            {
                return DataHandler.GetLinksForConfigurationItem(itemId);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public OperationResult CreateLink(ItemLink link)
        {
            try
            {
                DataHandler.CreateLink(link, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        public OperationResult DeleteLink(ItemLink link)
        {
            try
            {
                DataHandler.DeleteLink(link, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        #endregion

        #region ItemTypeAttributeGroupMapping

        public OperationResult CreateItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
        {
            try
            {
                MetaDataHandler.CreateItemTypeAttributeGroupMapping(itemTypeAttributeMapping, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        public IEnumerable<ItemTypeAttributeGroupMapping> GetItemTypeAttributeGroupMappings()
        {
            return MetaDataHandler.GetItemTypeAttributeGroupMappings();
        }

        public bool CanDeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
        {
            try
            {
                return MetaDataHandler.CanDeleteItemTypeAttributeGroupMapping(itemTypeAttributeMapping);
            }
            catch
            {
                return false;
            }

        }

        public OperationResult DeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
        {
            try
            {
                MetaDataHandler.DeleteItemTypeAttributeGroupMapping(itemTypeAttributeMapping, ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
            return new OperationResult() { Success = true };
        }

        #endregion

        #region Responsibilites

        public IEnumerable<ItemResponsibility> GetResponsibilitesForConfigurationItem(ConfigurationItem item)
        {
            try
            {
                return DataHandler.GetResponsibilitesForConfigurationItem(item.ItemId);
            }
            catch
            {
                return null;
            }
        }

        #endregion

        #region User

        public UserRole GetRoleForUser()
        {
            try
            {
                return SecurityHandler.GetUserRole(ServiceSecurityContext.Current.WindowsIdentity);
            }
            catch
            {
                return UserRole.Reader;
            }
        }

        public OperationResult RevokeRoleForUser(UserRoleMapping userRoleMapping, bool DeleteResponsibilitiesAlso)
        {
            try
            {
                SecurityHandler.RevokeRole(userRoleMapping, DeleteResponsibilitiesAlso, ServiceSecurityContext.Current.WindowsIdentity);
                return new OperationResult() { Success = true };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        #endregion
    }
}
