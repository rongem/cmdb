using CmdbClient.CmsService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CmdbClient
{
    public class DataWrapper : IDisposable
    {
        private CmsServiceClient client;

        private UserRole userRole;

        public DataWrapper(string remoteAddress)
        {
            Uri uri;
            if (Uri.TryCreate(remoteAddress, UriKind.Absolute, out uri))
            {
                client = new CmsServiceClient("CmsService", remoteAddress);
                userRole = client.GetRoleForUser();
            }
            else
                throw new ArgumentException("Die übergebene URL ist ungültig");
        }

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

        /// <summary>
        /// Gibt eine Attributgruppe anhand ihres Namens zurück, und erzeugt diese, falls sie nicht existiert.
        /// </summary>
        /// <param name="groupName">Name der Gruppe</param>
        /// <returns></returns>
        public AttributeGroup EnsureAttributeGroup(string groupName)
        {
            AttributeGroup group = GetAttributeGroups().SingleOrDefault(g => g.GroupName.Equals(groupName, StringComparison.CurrentCultureIgnoreCase));
            if (group == null)
            {
                if (userRole != UserRole.Administrator)
                    throw new Exception("Das Datenmodell in der CMDB ist nicht vollständig. Um den Fehler zu beheben, muss ein Inhaber der Rolle Administration der CMDB das Programm ausführen.");
                group = new AttributeGroup()
                {
                    GroupName = groupName,
                    GroupId = Guid.NewGuid(),
                };
                OperationResult or = CreateAttributeGroup(group);
                if (!or.Success)
                    throw new Exception(string.Format("Attributgruppe {0} konnte nicht erstellt werden. Fehler: {1}", groupName, or.Message));
            }
            return group;
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

        /// <summary>
        /// Gibt einen Attribut-Typ zurück, der einen vorgegebenen Namen besitzt, oder legt diesen an.
        /// </summary>
        /// <param name="typename">Gesuchter Name des Attribut-Typs</param>
        /// <returns></returns>
        public AttributeType EnsureAttributeType(string typename)
        {
            AttributeType at = GetAttributeTypes().SingleOrDefault(a => a.TypeName.Equals(typename, StringComparison.CurrentCultureIgnoreCase));
            if (at == null)
            {
                if (userRole != UserRole.Administrator)
                    throw new Exception("Das Datenmodell in der CMDB ist nicht vollständig. Um den Fehler zu beheben, muss ein Inhaber der Rolle Administration der CMDB das Programm ausführen.");
                at = new AttributeType()
                {
                    TypeId = Guid.NewGuid(),
                    TypeName = typename,
                };
                OperationResult or = CreateAttributeType(at);
                if (!or.Success)
                    throw new Exception(string.Format("Konnte Attribut-Typ {0} nicht anlegen. Fehler: {1}", typename, or.Message));
            }
            return at;
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

        /// <summary>
        /// Gibt einen Verbindungstyp anhand der Namen zurück, oder legt diesen an
        /// </summary>
        /// <param name="DownwardName">Name der Verbindung, wenn man sie von oben nach unten betrachtet</param>
        /// <param name="UpwardName">Name der Verbindung, wenn man sie von unten nach oben betrachtet</param>
        /// <returns></returns>
        public ConnectionType EnsureConnectionType(string DownwardName, string UpwardName)
        {
            ConnectionType connectionType = GetConnectionTypes().SingleOrDefault(ct => ct.ConnTypeName.Equals(DownwardName, StringComparison.CurrentCultureIgnoreCase) &&
                ct.ConnTypeReverseName.Equals(UpwardName, StringComparison.CurrentCultureIgnoreCase));
            if (connectionType == null)
            {
                if (userRole != UserRole.Administrator)
                    throw new Exception("Das Datenmodell in der CMDB ist nicht vollständig. Um den Fehler zu beheben, muss ein Inhaber der Rolle Administration der CMDB das Programm ausführen.");
                connectionType = new ConnectionType()
                {
                    ConnTypeId = Guid.NewGuid(),
                    ConnTypeName = DownwardName,
                    ConnTypeReverseName = UpwardName,
                };
                OperationResult or = CreateConnectionType(connectionType);
                if (!or.Success)
                    throw new Exception(string.Format("Konnte Verbindungstyp {0}/{1} nicht anlegen. Fehler: {2}", DownwardName, UpwardName, or.Message));
            }
            return connectionType;
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

        /// <summary>
        /// Gibt eine existierende Verbindungsregel zurück oder legt eine neue an
        /// </summary>
        /// <param name="upperItemType">Item-Typ des oberen Item</param>
        /// <param name="connectionType">Verbindungstyp</param>
        /// <param name="lowerItemType">Item-Typ des unteren Item</param>
        /// <param name="maxConnectionsToUpper">Maximale Verbindungen zum oberen Item</param>
        /// <param name="maxConnectionsToLower">Maximale Verbindungen zum unteren Item</param>
        /// <returns></returns>
        public ConnectionRule EnsureConnectionRule(ItemType upperItemType, ConnectionType connectionType, ItemType lowerItemType, int maxConnectionsToUpper, int maxConnectionsToLower)
        {
            ConnectionRule cr = GetConnectionRuleByContent(upperItemType.TypeId, connectionType.ConnTypeId, lowerItemType.TypeId);
            if (cr == null)
            {
                if (userRole != UserRole.Administrator)
                    throw new Exception("Das Datenmodell in der CMDB ist nicht vollständig. Um den Fehler zu beheben, muss ein Inhaber der Rolle Administration der CMDB das Programm ausführen.");
                cr = new ConnectionRule()
                {
                    ConnType = connectionType.ConnTypeId,
                    ItemUpperType = upperItemType.TypeId,
                    ItemLowerType = lowerItemType.TypeId,
                    MaxConnectionsToUpper = maxConnectionsToUpper,
                    MaxConnectionsToLower = maxConnectionsToLower,
                };
                OperationResult or = CreateConnectionRule(cr);
                if (!or.Success)
                    throw new Exception(string.Format("Die Verbindungsregeln {0} {1}/{2} {3} kann nicht angelegt werden. Fehler: {4}",
                        upperItemType.TypeName, connectionType.ConnTypeName, connectionType.ConnTypeReverseName, lowerItemType.TypeName, or.Message));
            }
            else
            {
                bool hasChanged = false;
                if (cr.MaxConnectionsToLower < maxConnectionsToLower)
                {
                    cr.MaxConnectionsToLower = maxConnectionsToLower;
                    hasChanged = true;
                }
                if (cr.MaxConnectionsToUpper < maxConnectionsToUpper)
                {
                    cr.MaxConnectionsToUpper = maxConnectionsToUpper;
                    hasChanged = true;
                }
                if (hasChanged)
                {
                    UpdateConnectionRule(cr);
                }
            }
            return cr;
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

        /// <summary>
        /// Stellt sicher, dass eine Zuordnung eines Attribut-Typs zur Attribut-Gruppe existiert
        /// </summary>
        /// <param name="attributeGroup">Attributgruppe</param>
        /// <param name="attributeType">Attribut-Typ</param>
        /// <returns></returns>
        public OperationResult EnsureAttributeTypeMapping(AttributeGroup attributeGroup, AttributeType attributeType)
        {
            GroupAttributeTypeMapping gam = GetGroupAttributeTypeMapping(attributeGroup.GroupId, attributeType.TypeId);
            if (gam != null)
                return new OperationResult() { Success = true };
            if (userRole != UserRole.Administrator)
                throw new Exception("Das Datenmodell in der CMDB ist nicht vollständig. Um den Fehler zu beheben, muss ein Inhaber der Rolle Administration der CMDB das Programm ausführen.");
            gam = new GroupAttributeTypeMapping()
            {
                GroupId = attributeGroup.GroupId,
                AttributeTypeId = attributeType.TypeId,
            };
            return CreateGroupAttributeTypeMapping(gam);
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

        /// <summary>
        /// Gibt einen Item-Typ zurück, der diesem Namen entspricht, oder legt diesen an
        /// </summary>
        /// <param name="typeName">Gesuchter Name</param>
        /// <returns></returns>
        public ItemType EnsureItemType(string typeName)
        {
            ItemType itemType = GetItemTypes().SingleOrDefault(t => t.TypeName.Equals(typeName, StringComparison.CurrentCultureIgnoreCase));
            if (itemType == null)
            {
                if (userRole != UserRole.Administrator)
                    throw new Exception("Das Datenmodell in der CMDB ist nicht vollständig. Um den Fehler zu beheben, muss ein Inhaber der Rolle Administration der CMDB das Programm ausführen.");
                itemType = new ItemType()
                {
                    TypeId = Guid.NewGuid(),
                    TypeName = typeName,
                    TypeBackColor = "#FFFFFF",
                };
                OperationResult or = CreateItemType(itemType);
                if (!or.Success)
                    throw new Exception(string.Format("Item-Typ {0} konnte nicht angelegt werden. Fehler: {1}", itemType, or.Message));
            }
            return itemType;
        }

        #endregion

        #region ItemTypeAttributeGroupMapping

        public OperationResult CreateItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
        {
            return client.CreateItemTypeAttributeGroupMapping(itemTypeAttributeMapping);
        }

        public IEnumerable<ItemTypeAttributeGroupMapping> GetItemTypeAttributeGroupMappings()
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

        /// <summary>
        /// Stellt sicher, dass eine Zuordnung eines Item-Types zu einer Attributgruppe existiert
        /// </summary>
        /// <param name="itemType">Item-Typ</param>
        /// <param name="attributeGroup">Attributgruppe</param>
        /// <returns></returns>
        public OperationResult EnsureItemTypeAttributeGroupMapping(ItemType itemType, AttributeGroup attributeGroup)
        {
            ItemTypeAttributeGroupMapping mapping = GetItemTypeAttributeGroupMappings().Single(m => m.GroupId.Equals(attributeGroup.GroupId) &&
                m.ItemTypeId.Equals(itemType.TypeId));
            if (mapping != null)
                return new OperationResult() { Success = true };
            if (userRole != UserRole.Administrator)
                throw new Exception("Das Datenmodell in der CMDB ist nicht vollständig. Um den Fehler zu beheben, muss ein Inhaber der Rolle Administration der CMDB das Programm ausführen.");
            mapping = new ItemTypeAttributeGroupMapping()
            {
                GroupId = attributeGroup.GroupId,
                ItemTypeId = itemType.TypeId,
            };
            return CreateItemTypeAttributeGroupMapping(mapping);
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

        /// <summary>
        /// Gibt ein exisitierendes Configuration Item zurück, oder legt ein neues an und gibt dieses zurück
        /// </summary>
        /// <param name="itemName">Name des CI</param>
        /// <param name="itemType">Item-Typ</param>
        /// <param name="sb">StringBuilder zur Ausgabe von Logging-Informationen</param>
        /// <returns></returns>
        public ConfigurationItem EnsureConfigurationItem(string itemName, ItemType itemType, StringBuilder sb)
        {
            ConfigurationItem item = GetConfigurationItemByTypeIdAndName(itemType.TypeId, itemName);
            if (item == null)
            {
                item = new ConfigurationItem()
                {
                    ItemId = Guid.NewGuid(),
                    ItemName = itemName,
                    ItemType = itemType.TypeId,
                };
                OperationResult or = CreateConfigurationItem(item);
                if (!or.Success)
                    throw new Exception(string.Format("Konnte Item {0}: {1} nicht erstellen. Fehler: {2}", itemType.TypeName, itemName, or.Message));
                if (sb != null)
                    sb.AppendLine(string.Format("Item {0}: {1} erstellt.", itemType.TypeName, itemName));
                return GetConfigurationItem(item.ItemId);
            }
            return item;
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

        /// <summary>
        /// Gibt ein existierendes Item zurück und legt den Wert auf den angegebenen Attributwert fest, bzw.
        /// legt ein neues Attribut an, falls es nicht existiert.
        /// Ist der übergebene Attributwert "<delete>", so wir das Attribut gelöscht.
        /// </summary>
        /// <param name="item">Configuration Item, dessen Attribut betroffen ist</param>
        /// <param name="attributeType">Attributtyp</param>
        /// <param name="attributeValue">Gewünschter Attributwert; <delete>, falls das Attribut gelöscht werden soll</param>
        /// <param name="sb">StringBuilder zum Protokollieren von Aktionen</param>
        /// <returns></returns>
        public ItemAttribute EnsureItemAttribute(ConfigurationItem item, AttributeType attributeType, string attributeValue, StringBuilder sb)
        {
            ItemAttribute attribute = GetAttributeForConfigurationItemByAttributeType(item.ItemId, attributeType.TypeId);
            if (attribute == null)
            {
                if (attributeValue.Equals("<delete>"))
                    return null;
                attribute = new ItemAttribute()
                {
                    AttributeId = Guid.NewGuid(),
                    AttributeTypeId = attributeType.TypeId,
                    AttributeValue = attributeValue,
                    ItemId = item.ItemId,
                };
                CreateItemAttribute(attribute);
                if (sb != null)
                    sb.AppendLine(string.Format("Attribut {0}: {1} zum Item {2}: {3} angelegt.", attributeType.TypeName, attributeValue, item.TypeName, item.ItemName));
                return GetAttribute(attribute.AttributeId);
            }
            else
            {
                if (attributeValue.Equals("<delete>"))
                {
                    DeleteItemAttribute(attribute);
                    if (sb != null)
                        sb.AppendLine(string.Format("Attribut {0}: {1} zum Item {2}: {3} gelöscht.", attributeType.TypeName, attribute.AttributeValue, item.TypeName, item.ItemName));
                    return null;
                }
                if (!attributeValue.Equals(attribute.AttributeValue))
                {
                    string oldValue = attribute.AttributeValue;
                    attribute.AttributeValue = attributeValue;
                    UpdateItemAttribute(attribute);
                    if (sb != null)
                        sb.AppendLine(string.Format("Attribut {0}: {1} zum Item {2}: {3} auf Wert {4} gesetzt.", attributeType.TypeName, oldValue, item.TypeName, item.ItemName, attributeValue));
                    return GetAttribute(attribute.AttributeId);
                }
                return attribute;
            }
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

