using CmdbAPI.DataAccess;
using CmdbAPI.DataObjects;
using CmdbAPI.Factories;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;

namespace CmdbAPI.BusinessLogic
{
    /// <summary>
    /// Enthält alle Methoden zur Verarbeitung von Configuration Items, Attributen, Links und Verbindungen
    /// </summary>
    public static class DataHandler
    {
        /// <summary>
        /// Gibt den String zurück, nach dem Datumswerte formatiert bzw. deserialisiert werden
        /// </summary>
        public static string JSONFormatString { get; private set; } = "yyyy-MM-dd HH:mm:ss zz";

        /// <summary>
        /// Wandelt einen JSON-Date-String in ein Datum mit Uhrzeit um
        /// </summary>
        /// <param name="dateString">String, der umgewandelt werden soll</param>
        /// <returns></returns>
        public static DateTime GetDate(string dateString)
        {
            try
            {
                return DateTime.ParseExact(dateString, JSONFormatString, System.Globalization.CultureInfo.CurrentCulture);
            }
            catch (Exception)
            {
                return new DateTime();
            }
        }

        #region Configuration Items

        /// <summary>
        /// Gibt ein Configuration Item mit Verantwortlichkeiten, aber ohne Verbindungen und Attribute zurück
        /// </summary>
        /// <param name="itemId">Guid des gewünschen CI</param>
        /// <returns></returns>
        public static ConfigurationItem GetConfigurationItem(Guid itemId)
        {
            DataObjects.ConfigurationItemExtender item = ConfigurationItemFactory.GetSingleItem(itemId, false, true);
            if (item == null)
                return null;
            return item.ConfigurationItem;
        }

        /// <summary>
        /// Gibt alle Configuration Items zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<ConfigurationItem> GetConfigurationItems()
        {
            return DataObjects.ConfigurationItemExtender.ConvertConfigurationItemsToTransferObjects(ConfigurationItemFactory.GetAllItems(false, false));
        }

        /// <summary>
        /// Gibt eine Liste von ConfigurationItems zurück, die den angegebenen Suchkritierien entsprechen
        /// </summary>
        /// <param name="search">Suchparameter</param>
        /// <returns></returns>
        public static IEnumerable<ConfigurationItem> SearchConfigurationItems(Search search)
        {
            return DataObjects.ConfigurationItemExtender.ConvertConfigurationItemsToTransferObjects(SearchItems.Search(search));
        }

        /// <summary>
        /// Gibt eine Liste von Configuration Items zurück, die ausgehend vom Quell-Item den angegebenen Suchkriterien entsprechen
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        public static IEnumerable<NeighborItem> SearchNeighbors(NeighborSearch search)
        {
            return SearchNeighborItems.Search(search);
        }

        /// <summary>
        /// Gibt alle Configuration Items eines angegebenen Typs zurück
        /// </summary>
        /// <param name="typeIds">Guid des ItemTypes</param>
        /// <returns></returns>
        public static IEnumerable<ConfigurationItem> GetConfigurationItemsByType(Guid[] typeIds)
        {
            return DataObjects.ConfigurationItemExtender.ConvertConfigurationItemsToTransferObjects(ConfigurationItemFactory.GetItemsOfTypes(typeIds, false, false));
        }

        /// <summary>
        /// Gibt alle Configuration Items eines angegebenen Typs zurück
        /// </summary>
        /// <param name="typeNames">Name des ItemType</param>
        /// <returns></returns>
        public static IEnumerable<ConfigurationItem> GetConfigurationItemsByTypeName(string[] typeNames)
        {
            return DataObjects.ConfigurationItemExtender.ConvertConfigurationItemsToTransferObjects(ConfigurationItemFactory.GetItemsOfTypes(typeNames, false, false));
        }

        /// <summary>
        /// Gibt alle Configuration Items eines angegebenen Typs zurück
        /// </summary>
        /// <param name="typeName">Name des ItemType</param>
        /// <param name="itemName">Name des Configuration Items</param>
        /// <returns></returns>
        public static ConfigurationItem GetConfigurationItemByTypeIdAndName(Guid itemType, string itemName)
        {
            try
            {
                return new ConfigurationItemExtender(ConfigurationItems.SelectOneByTypeAndName(itemType, itemName)).ConfigurationItem;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Gibt alle Configuration Items zurück, die für eine angegebene Verbindungsregel als unteres Configuration Item zur Verfügung stehen
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="ruleId">Guid der Verbindungsregel</param>
        /// <returns></returns>
        public static IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsLowerItem(Guid itemId, Guid ruleId)
        {
            CMDBDataSet.ConnectionRulesRow crr = ConnectionRules.SelectOne(ruleId);
            IEnumerable<CmdbAPI.DataObjects.ConfigurationItemExtender> items = ConfigurationItemFactory.GetAllItems(true, false);
            items = items.Where(i => i.ConfigurationItem.ItemType.Equals(crr.ItemLowerType) && i.UpwardConnections.Where(c => c.RuleId.Equals(ruleId)).Count() < crr.MaxConnectionsToUpper); // Alle Items filtern, bei denen das untere Item noch nicht die Maximalanzahl an Verbindungen erreicht hat
            items = items.Where(i => i.UpwardConnections.Where(c => c.ConnectedUpperItem.ItemId.Equals(itemId)).Count() == 0); // Alle Items herausfiltern, die schon verbunden sind
            return CmdbAPI.DataObjects.ConfigurationItemExtender.ConvertConfigurationItemsToTransferObjects(items);
        }

        /// <summary>
        /// Gibt alle Configuration Items zurück, die für eine angegebene Verbindungsregel als oberes Configuration Item zur Verfügung stehen
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="ruleId">Guid der Verbindungsregel</param>
        /// <returns></returns>
        public static IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsUpperItem(Guid itemId, Guid ruleId)
        {
            CMDBDataSet.ConnectionRulesRow crr = ConnectionRules.SelectOne(ruleId);
            IEnumerable<CmdbAPI.DataObjects.ConfigurationItemExtender> items = ConfigurationItemFactory.GetAllItems(true, false);
            items = items.Where(i => i.ConfigurationItem.ItemType.Equals(crr.ItemUpperType) && i.DownwardConnections.Where(c => c.RuleId.Equals(ruleId)).Count() < crr.MaxConnectionsToLower); // Alle Items filtern, bei denen das untere Item noch nicht die Maximalanzahl an Verbindungen erreicht hat
            items = items.Where(i => i.DownwardConnections.Where(c => c.ConnectedLowerItem.ItemId.Equals(itemId)).Count() == 0); // Alle Items herausfiltern, die schon verbunden sind
            return CmdbAPI.DataObjects.ConfigurationItemExtender.ConvertConfigurationItemsToTransferObjects(items);
        }

        /// <summary>
        /// Erzeugt ein neues Item in der Datenbank
        /// </summary>
        /// <param name="item">Configuration Item</param>
        /// <param name="identity">Identität des Benutzers, der das Item anlegt</param>
        public static void CreateConfigurationItem(ConfigurationItem item, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            ConfigurationItems.Insert(item.ItemId, item.ItemType, item.ItemName, identity.Name);
        }

        /// <summary>
        /// Aktualisiert ein Configuration Item
        /// </summary>
        /// <param name="item">Configuration Item</param>
        /// <param name="identity">Identität des Benutzers, der das Item ändert</param>
        public static void UpdateConfigurationItem(ConfigurationItem item, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            AssertConfigurationItemIsValid(item);
            SecurityHandler.AssertUserIsResponsibleForItem(item.ItemId, identity.Name);
            CMDBDataSet.ConfigurationItemsRow r = ConfigurationItems.SelectOne(item.ItemId);
            if (r == null)
                throw new ArgumentException(string.Format("Kein Item mit der ID {0} gefunden.", item.ItemId));
            if (!r.ItemLastChange.ToString(JSONFormatString).Equals(item.ItemLastChange) || r.ItemVersion != item.ItemVersion)
                throw new Exception("Das Item wurde zwischenzeitlich verändert");
            if (r.ItemName.Equals(item.ItemName))
                throw new InvalidOperationException("Der Name wurde nicht verändert");
            ConfigurationItems.Update(item.ItemId, item.ItemType, item.ItemName, r.ItemCreated, r.ItemLastChange, item.ItemVersion, identity.Name);
        }

        /// <summary>
        /// Löscht ein Configuration Item
        /// </summary>
        /// <param name="item">Configuration Item</param>
        /// <param name="identity">Identität des Benutzers, der das Item löscht</param>
        public static void DeleteConfigurationItem(ConfigurationItem item, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            SecurityHandler.AssertUserIsResponsibleForItem(item.ItemId, identity.Name);
            CMDBDataSet.ConfigurationItemsRow r = ConfigurationItems.SelectOne(item.ItemId);
            if (r == null)
                throw new ArgumentException(string.Format("Kein Item mit der ID {0} gefunden.", item.ItemId));
            if (!r.ItemLastChange.ToString(JSONFormatString).Equals(item.ItemLastChange) || r.ItemVersion != item.ItemVersion)
                throw new Exception("Das Item wurde zwischenzeitlich verändert");
            ConfigurationItems.Delete(item.ItemId, item.ItemType, item.ItemName, r.ItemCreated, r.ItemLastChange, item.ItemVersion, identity.Name);
        }

        /// <summary>
        /// Überprüft, ob ein Configuration Item valide Daten enthält
        /// </summary>
        /// <param name="item">Configuration Item</param>
        private static void AssertConfigurationItemIsValid(ConfigurationItem item)
        {
            if (string.IsNullOrWhiteSpace(item.ItemName))
                throw new ArgumentNullException("Der Name des Items darf nicht leer bleiben.");
            if (item.ItemId.Equals(Guid.Empty))
                throw new ArgumentNullException("Die Guid muss gesetzt sein");
        }

        /// <summary>
        /// Liefert ein vereinfachtes, für REST serialiserbares Item mit allen Attributen, Connections und Links zurück
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static Item GetItem(Guid itemId, System.Security.Principal.WindowsIdentity identity)
        {
            Dictionary<Guid, string> colors = new Dictionary<Guid, string>();
            foreach (ItemType itemType in MetaDataHandler.GetItemTypes())
            {
                colors.Add(itemType.TypeId, itemType.TypeBackColor);
            }
            ConfigurationItem configurationItem = DataHandler.GetConfigurationItem(itemId);
            if (configurationItem == null)
                return null;
            // Gefundenes Item erzeugen
            Item item = new Item()
            {
                id = configurationItem.ItemId,
                type = configurationItem.TypeName,
                typeId = configurationItem.ItemType,
                name = configurationItem.ItemName,
                color = colors[configurationItem.ItemType],
                attributes = new List<Item.Attribute>(),
                connectionsToLower = new List<Item.Connection>(),
                connectionsToUpper = new List<Item.Connection>(),
                links = new List<Item.Link>(),
                responsibilities = new List<Item.Responsibility>(),
                lastChange = configurationItem.ItemLastChange.ToString(),
                version = configurationItem.ItemVersion,
                userIsResponsible = false,
            };
            // Attribute anhängen
            foreach (ItemAttribute itemAttribute in DataHandler.GetAttributesForConfigurationItem(itemId))
            {
                item.attributes.Add(new Item.Attribute()
                {
                    id = itemAttribute.AttributeId,
                    typeId = itemAttribute.AttributeTypeId,
                    type = itemAttribute.AttributeTypeName,
                    value = itemAttribute.AttributeValue,
                    lastChange = itemAttribute.AttributeLastChange.ToString(),
                    version = itemAttribute.AttributeVersion,
                });
            }
            // Verbindungen zu Objekten anhängen, von denen dieses Objekt abhängig ist
            foreach (Connection conn in DataHandler.GetConnectionsToLowerForItem(itemId))
            {
                ConfigurationItem lowerItem = DataHandler.GetConfigurationItem(conn.ConnLowerItem);
                item.connectionsToLower.Add(new Item.Connection()
                {
                    id = conn.ConnId,
                    connectionType = MetaDataHandler.GetConnectionType(conn.ConnType).ConnTypeName,
                    typeId = conn.ConnType,
                    ruleId = conn.RuleId,
                    description = conn.Description,
                    targetId = conn.ConnLowerItem,
                    targetType = lowerItem.TypeName,
                    targetName = lowerItem.ItemName,
                    targetColor = colors[lowerItem.ItemType],
                });
            }
            // Verbindungen zu Objekten anhängen, die von dem Objekt abhängen
            foreach (Connection conn in DataHandler.GetConnectionsToUpperForItem(itemId))
            {
                ConfigurationItem upperItem = DataHandler.GetConfigurationItem(conn.ConnUpperItem);
                item.connectionsToUpper.Add(new Item.Connection()
                {
                    id = conn.ConnId,
                    connectionType = MetaDataHandler.GetConnectionType(conn.ConnType).ConnTypeReverseName,
                    typeId = conn.ConnType,
                    ruleId = conn.RuleId,
                    description = conn.Description,
                    targetId = conn.ConnUpperItem,
                    targetType = upperItem.TypeName,
                    targetName = upperItem.ItemName,
                    targetColor = colors[upperItem.ItemType],
                });
            }
            // Hyperlinks zu Websites für das Objekt anhängen
            foreach (ItemLink itemLink in DataHandler.GetLinksForConfigurationItem(itemId))
            {
                item.links.Add(new Item.Link()
                {
                    id = itemLink.LinkId,
                    uri = itemLink.LinkURI,
                    description = itemLink.LinkDescription
                });
            }
            // Verantwortlichekeiten hinzufügen; falls AD nicht funktioniert, wird der Benutzername angegeben
            foreach (ItemResponsibility resp in DataHandler.GetResponsibilitesForConfigurationItem(itemId))
            {
                if (!item.userIsResponsible && SecurityHandler.UserIsResponsible(itemId, identity.Name))
                    item.userIsResponsible = true;
                try
                {
                    ADSHelper.UserObject user = ADSHelper.GetUserProperties(resp.ResponsibleToken);
                    if (user != null)
                        item.responsibilities.Add(ResponsibilityFactory.GetItem_Responsibility(user));
                }
                catch
                {
                    item.responsibilities.Add(new Item.Responsibility() { name = resp.ResponsibleToken, account = resp.ResponsibleToken, invalidAccount = true });
                }
            }
            return item;
        }

        /// <summary>
        /// Liefert eine Liste von vereinfachten, für REST optimierten Items zurück
        /// </summary>
        /// <param name="guids">Liste der Guids nach denen gesucht wird.</param>
        /// <returns></returns>
        public static IEnumerable<Item> GetItems(IEnumerable<Guid> guids, System.Security.Principal.WindowsIdentity identity)
        {
            foreach (Guid guid in guids)
            {
                yield return GetItem(guid, identity);
            }
        }

        #endregion

        #region ItemAttributes

        /// <summary>
        /// Gibt eine Liste von Attributen zu einem Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des gewünschten CI</param>
        /// <returns></returns>
        public static IEnumerable<ItemAttribute> GetAttributesForConfigurationItem(Guid itemId)
        {
            return ItemAttributeFactory.GetAttributesForItem(itemId);
        }

        /// <summary>
        /// Gibt ein einzelnes Attribut zurück
        /// </summary>
        /// <param name="attributeId">Guid des Attributs</param>
        /// <returns></returns>
        public static ItemAttribute GetAttribute(Guid attributeId)
        {
            CMDBDataSet.ItemAttributesRow ar = ItemAttributes.SelectOne(attributeId);
            if (ar == null)
                return null;
            return new TransferObjects.ItemAttribute()
            {
                AttributeId = ar.AttributeId,
                AttributeTypeId = ar.AttributeTypeId,
                AttributeTypeName = ar.AttributeTypeName,
                ItemId = ar.ItemId,
                AttributeValue = ar.AttributeValue,
                AttributeLastChange = ar.AttributeLastChange.ToString(JSONFormatString),
                AttributeVersion = ar.AttributeVersion
            };
        }

        /// <summary>
        /// Gibt das Attribut eines Configuration Items zurück, das einem bestimmten Typ entspricht
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="attributeTypeId">Guid des AttributTyps</param>
        /// <returns></returns>
        public static ItemAttribute GetAttributeForConfigurationItemByAttributeType(Guid itemId, Guid attributeTypeId)
        {
            CMDBDataSet.ItemAttributesRow iar = ItemAttributes.SelectForItemAndAttributeType(itemId, attributeTypeId);
            if (iar == null)
                return null;
            return ItemAttributeFactory.GetAttributeTransferObject(iar);
        }

        /// <summary>
        /// Gibt alle Attribute eines angegebenen Attributtyps zurück
        /// </summary>
        /// <param name="attributeTypeId">Guid des AttributTyps</param>
        /// <returns></returns>
        public static IEnumerable<ItemAttribute> GetAttributeForAttributeType(Guid attributeTypeId)
        {
            foreach (CMDBDataSet.ItemAttributesRow ar in ItemAttributes.SelectForAttributeType(attributeTypeId))
            {
                yield return new TransferObjects.ItemAttribute()
                {
                    AttributeId = ar.AttributeId,
                    AttributeTypeId = ar.AttributeTypeId,
                    AttributeTypeName = ar.AttributeTypeName,
                    ItemId = ar.ItemId,
                    AttributeValue = ar.AttributeValue,
                    AttributeLastChange = ar.AttributeLastChange.ToString(JSONFormatString),
                    AttributeVersion = ar.AttributeVersion
                };
            }
        }

        /// <summary>
        /// Gibt das Attribut eines Configuration Items zurück, das einem bestimmten Typ entspricht
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="attributeTypeName">Name des AttributTyps</param>
        /// <returns></returns>
        public static ItemAttribute GetAttributeForConfigurationItemByAttributeTypeName(Guid itemId, string attributeTypeName)
        {
            return ItemAttributeFactory.GetAttributeTransferObject(ItemAttributes.SelectForItemAndAttributeType(itemId, AttributeTypes.SelectByName(attributeTypeName).AttributeTypeId));
        }

        /// <summary>
        /// Legt ein neues Attribut für ein Item an
        /// </summary>
        /// <param name="attribute">ItemAttribute</param>
        /// <param name="identity">Identität des Benutzers, der das Item anlegt</param>
        public static void CreateAttribute(ItemAttribute attribute, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            AssertAttributeIsValid(attribute);
            SecurityHandler.AssertUserIsResponsibleForItem(attribute.ItemId, identity.Name);
            Guid itemType = ConfigurationItems.SelectOne(attribute.ItemId).ItemType;
            Guid attributeGroup = AttributeTypes.SelectOne(attribute.AttributeTypeId).AttributeGroup;
            if (ItemTypeAttributeGroupMappings.SelectByContent(attributeGroup, itemType) == null)
                throw new InvalidOperationException("Das Attribut ist nicht in der Zuordnung für diesen Itemtypen.");
            if (ItemAttributes.SelectForItemAndAttributeType(attribute.ItemId, attribute.AttributeTypeId) != null)
                throw new InvalidOperationException("Es darf nicht mehr als ein Attribut eines bestimmten Attributtyps für ein Item erzeugt werden.");
            ItemAttributes.Insert(attribute.AttributeId, attribute.ItemId, attribute.AttributeTypeId, attribute.AttributeValue, identity.Name);
        }

        /// <summary>
        /// Ändert ein Attribut für ein Item
        /// </summary>
        /// <param name="attribute">ItemAttribute</param>
        /// <param name="identity">Identität des Benutzers, der das Item ändert</param>
        public static void UpdateAttribute(ItemAttribute attribute, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            AssertAttributeIsValid(attribute);
            SecurityHandler.AssertUserIsResponsibleForItem(attribute.ItemId, identity.Name);
            CMDBDataSet.ItemAttributesRow r = ItemAttributes.SelectOne(attribute.AttributeId);
            if (r == null)
                throw new ArgumentException(string.Format("Kein Attribut mit der ID {0} gefunden.", attribute.AttributeId));
            if (!r.AttributeLastChange.ToString(JSONFormatString).Equals(attribute.AttributeLastChange) || r.AttributeVersion != attribute.AttributeVersion)
                throw new Exception("Das Attribut wurde zwischenzeitlich verändert");
            if (r.AttributeValue.Equals(attribute.AttributeValue))
                throw new InvalidOperationException("Der Wert des Attributs wurde nicht verändert");
            ItemAttributes.Update(attribute.AttributeId, attribute.AttributeValue, r.AttributeLastChange, attribute.AttributeVersion, identity.Name);
        }

        /// <summary>
        /// Löscht ein  Attribut für ein Item
        /// </summary>
        /// <param name="attribute">ItemAttribute</param>
        /// <param name="identity">Identität des Benutzers, der das Item löscht</param>
        public static void DeleteAttribute(ItemAttribute attribute, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            AssertAttributeIsValid(attribute);
            SecurityHandler.AssertUserIsResponsibleForItem(attribute.ItemId, identity.Name);
            CMDBDataSet.ItemAttributesRow r = ItemAttributes.SelectOne(attribute.AttributeId);
            if (r == null)
                throw new ArgumentException(string.Format("Kein Attribut mit der ID {0} gefunden.", attribute.AttributeId));
            if (!r.AttributeLastChange.ToString(JSONFormatString).Equals(attribute.AttributeLastChange) || r.AttributeVersion != attribute.AttributeVersion)
                throw new Exception("Das Attribut wurde zwischenzeitlich verändert");
            ItemAttributes.Delete(attribute.AttributeId, attribute.ItemId, attribute.AttributeTypeId, attribute.AttributeValue, r.AttributeCreated, r.AttributeLastChange, attribute.AttributeVersion, identity.Name);
        }

        /// <summary>
        /// Löscht alle Attribute des angegebenen Types
        /// </summary>
        /// <param name="attributeType">AttributeType, dessen Attribute gelöscht werden sollen</param>
        /// <param name="identity">Identität des Benutzers, der das Item löscht</param>
        public static void DeleteAttributesByType(AttributeType attributeType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            MetaDataHandler.AssertAttributeTypeIsValid(attributeType);
            CMDBDataSet.AttributeTypesRow r = AttributeTypes.SelectOne(attributeType.TypeId);
            if (r == null)
                throw new ArgumentException("Angegebener AttributType nicht gefunden");
            if (!r.AttributeTypeName.Equals(attributeType.TypeName))
                throw new Exception("Der Attributtyp wurde zwischenzeitlich verändert");
            ItemAttributes.DeleteByType(attributeType.TypeId, identity.Name, DataHandler.GetAttributeForAttributeType(attributeType.TypeId).Count());
        }

        /// <summary>
        /// Überprüft, ob ein Attribut valide Daten besitzt
        /// </summary>
        /// <param name="attribute">ItemAttribute</param>
        private static void AssertAttributeIsValid(ItemAttribute attribute)
        {
            if (string.IsNullOrWhiteSpace(attribute.AttributeValue))
                throw new ArgumentNullException("Der Wert des Attributs darf nicht leer bleiben.");
            if (attribute.ItemId.Equals(Guid.Empty))
                throw new ArgumentNullException("Die Guid muss gesetzt sein");
        }

        #endregion

        #region Connections

        /// <summary>
        /// Liefert alle Connections zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Connection> GetConnections()
        {
            foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectAll())
            {
                yield return ConnectionFactory.CreateConnectionTransferObject(cr);
            };
        }

        /// <summary>
        /// Gibt alle Verbindungen (aufwärts und abwärts) für ein Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <returns></returns>
        public static IEnumerable<Connection> GetConnectionsForItem(Guid itemId)
        {
            List<Connection> list = new List<Connection>();
            list.AddRange(GetConnectionsToLowerForItem(itemId));
            list.AddRange(GetConnectionsToUpperForItem(itemId));
            return list;
        }

        /// <summary>
        /// Gibt alle abwärts gerichteten Verbindungen für ein Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <returns></returns>
        public static IEnumerable<Connection> GetConnectionsToLowerForItem(Guid itemId)
        {
            foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectConnectionsToLowerForItemId(itemId))
            {
                yield return ConnectionFactory.CreateConnectionTransferObject(cr);
            }
        }

        /// <summary>
        /// Gibt alle abwärts gerichteten Verbindungen für ein Configuration Item zurück, die einer angegebenen Verbindungsregel entsprechen
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="ruleId">Guid der Verbindungsregel</param>
        /// <returns></returns>
        public static IEnumerable<Connection> GetConnectionsToLowerForItemAndRule(Guid itemId, Guid ruleId)
        {
            foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectForUpperItemAndRule(itemId, ruleId))
            {
                yield return ConnectionFactory.CreateConnectionTransferObject(cr);
            }
        }

        /// <summary>
        /// Gibt alle aufwärts gerichteten Verbindungen für ein Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <returns></returns>
        public static IEnumerable<Connection> GetConnectionsToUpperForItem(Guid itemId)
        {
            foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectConnectionsToUpperForItemId(itemId))
            {
                yield return ConnectionFactory.CreateConnectionTransferObject(cr);
            }
        }

        /// <summary>
        /// Gibt alle aufwärts gerichteten Verbindungen für ein Configuration Item zurück, die einer angegebenen Verbindungsregel entsprechen
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="ruleId">Guid der Verbindungsregel</param>
        /// <returns></returns>
        public static IEnumerable<Connection> GetConnectionsToUpperForItemAndRule(Guid itemId, Guid ruleId)
        {
            foreach (CMDBDataSet.ConnectionsRow cr in Connections.SelectForLowerItemAndRule(itemId, ruleId))
            {
                yield return ConnectionFactory.CreateConnectionTransferObject(cr);
            }
        }

        /// <summary>
        /// Gibt eine Verbindungs zurück
        /// </summary>
        /// <param name="connectionId">Guid der Verbindung</param>
        /// <returns></returns>
        public static Connection GetConnection(Guid connectionId)
        {
            CMDBDataSet.ConnectionsRow cr = Connections.SelectOne(connectionId);
            if (cr == null)
                return null;
            return ConnectionFactory.CreateConnectionTransferObject(cr);
        }

        /// <summary>
        /// Findet eine Verbindung anhand ihres Inhalts. Gibt null zurück, wenn keine Verbindungs gefunden wurde.
        /// </summary>
        /// <param name="upperItemId">Guid des oberen Configuration Item</param>
        /// <param name="connectionTypeId">Guid des Verbindungstyps</param>
        /// <param name="lowerItemId">Guid des unteren Configuration Item</param>
        /// <returns></returns>
        public static Connection GetConnectionByContent(Guid upperItemId, Guid connectionTypeId, Guid lowerItemId)
        {
            CMDBDataSet.ConnectionsRow cr = Connections.SelectByContent(upperItemId, connectionTypeId, lowerItemId);
            if (cr == null)
                return null;
            return ConnectionFactory.CreateConnectionTransferObject(cr);
        }

        /// <summary>
        /// Erzeugt eine Verbindung zwischen zwei Configuration Items
        /// </summary>
        /// <param name="conn">Verbindung</param>
        /// <param name="identity">Identität des Benutzers, der die Aktion durchführt</param>
        public static void CreateConnection(Connection conn, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            if (conn.ConnId.Equals(Guid.Empty) || conn.ConnLowerItem.Equals(Guid.Empty) || conn.ConnUpperItem.Equals(Guid.Empty) || conn.ConnType.Equals(Guid.Empty) || conn.RuleId.Equals(Guid.Empty))
                throw new ArgumentException("Es müssen gültige Guids angegeben werden.");
            SecurityHandler.AssertUserIsResponsibleForItem(conn.ConnUpperItem, identity.Name);
            CMDBDataSet.ConnectionRulesRow crr = ConnectionRules.SelectOne(conn.RuleId);
            if (crr == null)
                throw new ArgumentException("Keine gültige Verbindungsregel zu der angegebenen Guid gefunden.");
            if (!(ConfigurationItems.SelectOne(conn.ConnUpperItem).ItemType.Equals(crr.ItemUpperType) &&
                ConfigurationItems.SelectOne(conn.ConnLowerItem).ItemType.Equals(crr.ItemLowerType) &&
                crr.ConnType.Equals(conn.ConnType)))
                throw new ArgumentException("Die angegebenen Items und der Verbindungstyp entsprechen nicht von der angegebenen Regel.");
            if (GetConfigurationItemsConnectableAsLowerItem(conn.ConnUpperItem, conn.RuleId).Where(i => i.ItemId.Equals(conn.ConnLowerItem)).Count() == 0)
                throw new InvalidOperationException("Das untere Item steht aufgrund der Verbindungsregeln nicht mehr für eine Verbindung zur Verfügung");
            if (GetConfigurationItemsConnectableAsUpperItem(conn.ConnLowerItem, conn.RuleId).Where(i => i.ItemId.Equals(conn.ConnUpperItem)).Count() == 0)
                throw new InvalidOperationException("Das obere Item steht aufgrund der Verbindungsregeln nicht mehr für eine Verbindung zur Verfügung");
            Connections.Insert(conn.ConnId, conn.ConnUpperItem, conn.ConnLowerItem, conn.RuleId, conn.Description, identity.Name);
        }

        /// <summary>
        /// Löscht eine Verbindung zwischen zwei Configuration Items
        /// </summary>
        /// <param name="conn">Verbindung</param>
        /// <param name="identity">Identität des Benutzers, der die Aktion durchführt</param>
        public static void DeleteConnection(Connection conn, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            if (conn.ConnId.Equals(Guid.Empty) || conn.ConnLowerItem.Equals(Guid.Empty) || conn.ConnUpperItem.Equals(Guid.Empty) || conn.ConnType.Equals(Guid.Empty) || conn.RuleId.Equals(Guid.Empty))
                throw new ArgumentException("Es müssen gültige Guids angegeben werden.");
            SecurityHandler.AssertUserIsResponsibleForItem(conn.ConnUpperItem, identity.Name);
            CMDBDataSet.ConnectionsRow cr = Connections.SelectOne(conn.ConnId);
            if (cr == null)
                throw new ArgumentException("Es wurde keine Verbindung mit der angegebenen Id gefunden.");
            Connections.Delete(conn.ConnId, conn.ConnUpperItem, conn.ConnLowerItem, conn.RuleId, cr.ConnCreated, conn.Description, identity.Name);
        }

        #endregion

        #region ItemLinks

        /// <summary>
        /// Gibt Hyperlinks zu einem Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <returns></returns>
        public static IEnumerable<ItemLink> GetLinksForConfigurationItem(Guid itemId)
        {
            foreach (CMDBDataSet.ItemLinksRow link in ItemLinks.SelectForItem(itemId))
            {
                yield return new ItemLink() { LinkId = link.LinkId, ItemId = link.ItemId, LinkDescription = link.LinkDescription, LinkURI = link.LinkURI };
            }
        }

        /// <summary>
        /// Gibt einen Link zurück
        /// </summary>
        /// <param name="linkId">Guid des ItemLink</param>
        /// <returns></returns>
        public static ItemLink GetLink(Guid linkId)
        {
            CMDBDataSet.ItemLinksRow lr = ItemLinks.SelectOne(linkId);
            if (lr == null)
                return null;
            return new ItemLink() { LinkId = lr.LinkId, ItemId = lr.ItemId, LinkDescription = lr.LinkDescription, LinkURI = lr.LinkURI };
        }

        /// <summary>
        /// Erzeugt einen Hyperlink
        /// </summary>
        /// <param name="link">Hyperlink</param>
        /// <param name="windowsIdentity">Identität des Benutzers, der die Aktion durchführt</param>
        public static void CreateLink(ItemLink link, WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            SecurityHandler.AssertUserIsResponsibleForItem(link.ItemId, identity.Name); // Damit ist auch klar, dass die ItemId gültig ist.
            AssertLinkIsValid(link);
            // Derzeit wird nicht überprüft, ob der Hyperlink funktioniert bzw. irgendwelchen Regeln entspricht.
            ItemLinks.Insert(link.LinkId, link.ItemId, link.LinkURI, link.LinkDescription);
        }

        public static void UpdateLink(ItemLink link, WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            SecurityHandler.AssertUserIsResponsibleForItem(link.ItemId, identity.Name);
            AssertLinkIsValid(link);
            CMDBDataSet.ItemLinksRow ilr = ItemLinks.SelectOne(link.LinkId);
            if (ilr == null)
                throw new ArgumentException("Der angegebene Link wurde nicht in der Datenbank gefunden.");
            if (ilr.LinkURI.Equals(link.LinkURI) && ilr.LinkDescription.Equals(link.LinkDescription))
                throw new Exception("Es wurde weder die URI noch die Beschreibung geändert.");
            if (!ilr.ItemId.Equals(link.ItemId))
                throw new Exception("Das Confiuration Item darf nicht verändert werden.");
            ItemLinks.Update(link.LinkId, ilr.ItemId, link.LinkURI, link.LinkDescription, ilr.LinkURI, link.LinkDescription);
        }

        /// <summary>
        /// Löschen einen Hyperlink
        /// </summary>
        /// <param name="link">Hyperlink</param>
        /// <param name="windowsIdentity">Identität des Benutzers, der die Aktion durchführt</param>
        public static void DeleteLink(ItemLink link, WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Editor);
            SecurityHandler.AssertUserIsResponsibleForItem(link.ItemId, identity.Name);
            ItemLinks.Delete(link.LinkId, link.ItemId, link.LinkURI, link.LinkDescription);
        }

        /// <summary>
        /// Überprüft, ob ein Link valide Daten enthält
        /// </summary>
        /// <param name="link">ItemLink-Objekt, das überprüft werden soll</param>
        private static void AssertLinkIsValid(ItemLink link)
        {
            if (link.LinkId.Equals(Guid.Empty))
                throw new Exception("Die LinkId muss eine gültige Guid enthalten.");
            if (string.IsNullOrWhiteSpace(link.LinkDescription) || string.IsNullOrWhiteSpace(link.LinkURI))
                throw new ArgumentException("URI und Beschreibung müssen Text enthalten.");
        }

        #endregion

        #region Responsibility

        /// <summary>
        /// Liefert alle Benutzer zurück, die für ein Configuration Item verantwortlich sind.
        /// </summary>
        /// <param name="itemId">Guid des gesuchten Configuration Item</param>
        /// <returns></returns>
        public static IEnumerable<ItemResponsibility> GetResponsibilitesForConfigurationItem(Guid itemId)
        {
            foreach (CMDBDataSet.ResponsibilityRow rr in Responsibility.SelectForItem(itemId))
            {
                yield return new ItemResponsibility() { ItemId = rr.ItemId, ResponsibleToken = rr.ResponsibleToken };
            }
        }


        #endregion

        /// <summary>
        /// Gibt Vorschläge für Autocomplete zurück
        /// </summary>
        /// <param name="text">Text, der enthalten sein soll</param>
        /// <returns></returns>
        public static IEnumerable<string> GetProposals(string text)
        {
            foreach (CMDBDataSet.Value_ProposalsRow row in Proposals.GetProposalsForText(text))
            {
                yield return row.Word;
            }
        }

    }
}
