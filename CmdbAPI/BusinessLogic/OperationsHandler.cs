using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.BusinessLogic
{
    public static class OperationsHandler
    {
        public static OperationResult ConvertAttributeTypeToCIType(AttributeType attributeType, string newItemTypeName, string colorCode,
            ConnectionType connType, Position position, IEnumerable<AttributeType> attributeTypesToTransfer, WindowsIdentity identity)
        {
            if (string.IsNullOrWhiteSpace(newItemTypeName))
                newItemTypeName = attributeType.TypeName;
            try
            {
                StringBuilder result = new StringBuilder();
                List<ItemType> itemTypesForAttributeType = new List<ItemType>();
                itemTypesForAttributeType.AddRange(MetaDataHandler.GetItemTypesByAllowedAttributeType(attributeType.TypeId));

                bool newTypeIsUpperRule = position == Position.Above;

                ItemType newItemType = GetOrCreateItemType(newItemTypeName, colorCode, identity);
                result.AppendLine(string.Format("Item-Typ {0} angelegt.", newItemTypeName));
                int x = CreateItemTypeAttributeGroupMappings(attributeTypesToTransfer, newItemType, identity);
                if (x > 0)
                    result.AppendLine(string.Format("{0} Attributgruppen zu Item-Typ {1} angelegt.", x, newItemTypeName));
                List<ConnectionRule> rules = GetOrCreateRules(connType, newItemType, newTypeIsUpperRule, itemTypesForAttributeType, result, identity);

                TransferAttributesToItems(attributeType, attributeTypesToTransfer, newItemType, itemTypesForAttributeType, newTypeIsUpperRule, connType, rules, result, identity);

                return new OperationResult() { Success = true, Message = result.ToString() };
            }
            catch (Exception ex)
            {
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

        /// <summary>
        /// Zieht Attribute zu Configuration Items um
        /// </summary>
        /// <param name="attributeType">Attributtyp, der umgezogen werden soll</param>
        /// <param name="attributeTypesToTransfer">Attributtypen, die mitgenommen werden sollen</param>
        /// <param name="newItemType">Der neue Itemtyp, der aus den Attributen entstehen soll</param>
        /// <param name="itemTypes">Die Itemtypen, für die der Attributtyp möglich ist</param>
        /// <param name="newTypeIsUpperRule">Soll die Verbindung nach oben oder nach unten erzeugt werden</param>
        /// <param name="connType">Verbindungstyp</param>
        /// <param name="connectionRules">Verbindungsregeln</param>
        /// <param name="result">Ergebnis-Text</param>
        /// <param name="identity">Windows-Identität, mit der das durchgeführt werden soll</param>
        private static void TransferAttributesToItems(AttributeType attributeType, IEnumerable<AttributeType> attributeTypesToTransfer, 
            ItemType newItemType, List<ItemType> itemTypes, bool newTypeIsUpperRule, 
            ConnectionType connType, List<ConnectionRule> connectionRules, 
            StringBuilder result, WindowsIdentity identity)
        {
            // Die Attribute, die den Attributtypen besitzen
            IEnumerable<ItemAttribute> attributes = DataHandler.GetAttributeForAttributeType(attributeType.TypeId);

            // Die Items, die Attribute des Attributtypen besitzen
            IEnumerable<ConfigurationItem> items = DataHandler.GetConfigurationItemsByType(itemTypes.Select(i => i.TypeId).ToArray());

            foreach (string val in attributes.Select(a => a.AttributeValue.ToLower()).Distinct())
            {
                // Groß-/Kleinschreibung ignorieren, aber eine richtige Schreibweise abholen
                ItemAttribute itemAttribute = attributes.First(a => a.AttributeValue.Equals(val, StringComparison.CurrentCultureIgnoreCase));
                ConfigurationItem ci = GetOrCreateConfigurationItem(itemAttribute.AttributeValue, newItemType, identity);
                result.AppendLine(string.Format("Configuration Item {0} erzeugt / gefunden", ci.ItemName));

                // Überführt die mitzunehmenden Attribut von einem Configuration Item auf das neue CI
                Guid tmpItem = itemAttribute.ItemId; // holt ein Item mit dem angegebenen Attributwert, um dessen Attribute zu transferieren
                foreach (AttributeType at in attributeTypesToTransfer)
                {
                    ItemAttribute ia = DataHandler.GetAttributeForConfigurationItemByAttributeType(ci.ItemId, at.TypeId);
                    if (ia == null)
                    {
                        ia = DataHandler.GetAttributeForConfigurationItemByAttributeType(tmpItem, at.TypeId);
                        ItemAttribute newIa = new ItemAttribute() { AttributeId = Guid.NewGuid(), AttributeTypeId = at.TypeId, AttributeValue = ia.AttributeValue, ItemId = ci.ItemId };
                        DataHandler.CreateAttribute(newIa, identity);
                        result.AppendLine(string.Format("Attribut vom Typ {0} mit Wert {1} hinzugefügt", ia.AttributeTypeName, ia.AttributeValue));
                    }
                }
                // Erzeugt die Verbindungen zu den neuen Configuration Items
                foreach (ItemAttribute ia in attributes.Where(a => a.AttributeValue.Equals(val, StringComparison.CurrentCultureIgnoreCase)))
                {
                    ConfigurationItem connectedCI = items.Single(i => i.ItemId.Equals(ia.ItemId));
                    Guid upperItemId = newTypeIsUpperRule ? ci.ItemId : ia.ItemId,
                        lowerItemId = newTypeIsUpperRule ? ia.ItemId : ci.ItemId;
                    ConnectionRule cr = connectionRules.Single(r => r.ConnType.Equals(connType.ConnTypeId) && r.ItemLowerType.Equals(newTypeIsUpperRule ? connectedCI.ItemType : ci.ItemType) && r.ItemUpperType.Equals((newTypeIsUpperRule ? ci.ItemType : connectedCI.ItemType)));
                    Connection conn = DataHandler.GetConnectionByContent(upperItemId, connType.ConnTypeId, lowerItemId);
                    if (conn == null)
                    {
                        conn = new Connection() { ConnId = Guid.NewGuid(), ConnType = connType.ConnTypeId, ConnUpperItem = upperItemId, ConnLowerItem = lowerItemId, RuleId = cr.RuleId };
                        DataHandler.CreateConnection(conn, identity);
                        result.AppendLine(string.Format("Verbindung '{0} {1}/{2} {3}' hinzugefügt",
                            newTypeIsUpperRule ? ci.ItemName : connectedCI.ItemName,
                            connType.ConnTypeName, connType.ConnTypeReverseName,
                            newTypeIsUpperRule ? connectedCI.ItemName : ci.ItemName));
                    }
                }

            }
            // Alle Attributzuorndungen zur Gruppe und damit implizit auch die Attribute löschen
            MetaDataHandler.DeleteGroupAttributeTypeMapping(MetaDataHandler.GetGroupAttributeTypeMapping(attributeType.TypeId), identity);
            result.AppendLine("Gruppenzugehörigkeit und Attribute gelöscht.");
            // Attributtypen entfernen
            MetaDataHandler.DeleteAttributeType(attributeType, identity);
            result.AppendLine("Attribut-Typ gelöscht");
        }

        /// <summary>
        /// Erzeugt Zuordnungen von Attributgruppen zu Item-Typen für angegebene Attributtypen
        /// </summary>
        /// <param name="attributeTypesToTransfer">Attributtypen, der Gruppen hinzugefügt werden sollen</param>
        /// <param name="itemType">Der Item-Typ, dem die Gruppen hinzugefügt werden</param>
        /// <param name="identity">Die Identität, mit der die Aktion durchgeführt wird</param>
        private static int CreateItemTypeAttributeGroupMappings(IEnumerable<AttributeType> attributeTypesToTransfer, ItemType itemType, WindowsIdentity identity)
        {
            int ctr = 0;
            List<Guid> groupIds = new List<Guid>();
            foreach (AttributeType attributeType in attributeTypesToTransfer)
            {
                GroupAttributeTypeMapping gatm = MetaDataHandler.GetGroupAttributeTypeMapping(attributeType.TypeId);
                if (!groupIds.Contains(gatm.GroupId))
                    groupIds.Add(gatm.GroupId);
            }
            foreach (Guid groupId in groupIds)
            {
                ItemTypeAttributeGroupMapping itagm = new ItemTypeAttributeGroupMapping() { GroupId = groupId, ItemTypeId = itemType.TypeId };
                if (MetaDataHandler.GetItemTypeAttributeGroupMapping(groupId, itemType.TypeId) == null)
                {
                    MetaDataHandler.CreateItemTypeAttributeGroupMapping(itagm, identity);
                    ctr++;
                }
            }
            return ctr;
        }

        /// <summary>
        /// Erzeugt Verbindungsregeln und gibt diese oder bereits vorhandene zurück
        /// </summary>
        /// <param name="connType">Verbindungstyp, der verwendet wird</param>
        /// <param name="itemType">Erster Item-Typ</param>
        /// <param name="newTypeIsUpper">Gibt an, ob der erste Item-Typ oberhalb der anderen steht oder nicht</param>
        /// <param name="itemTypes">Andere Item-Typen, die mit dem ersten verbunden werden sollen</param>
        /// <param name="result">StringBuider zur Protokollierung</param>
        /// <param name="identity">Windows-Identität, mit der die Aktion ausgeführt wird</param>
        private static List<ConnectionRule> GetOrCreateRules(ConnectionType connType, ItemType itemType, bool newTypeIsUpper, List<ItemType> itemTypes, StringBuilder result, WindowsIdentity identity)
        {
            ItemType upperType, lowerType;
            List<ConnectionRule> connectionRules = new List<ConnectionRule>();

            foreach (ItemType myType in itemTypes)
            {
                upperType = newTypeIsUpper ? itemType : myType;
                lowerType = newTypeIsUpper ? myType : itemType;

                ConnectionRule cr = MetaDataHandler.GetConnectionRuleByContent(upperType.TypeId, connType.ConnTypeId, lowerType.TypeId);
                if (cr == null)
                {
                    cr = new ConnectionRule()
                    {
                        RuleId = Guid.NewGuid(),
                        ConnType = connType.ConnTypeId,
                        ItemUpperType = upperType.TypeId,
                        ItemLowerType = lowerType.TypeId,
                        MaxConnectionsToLower = 9999,
                        MaxConnectionsToUpper = 9999
                    };
                    MetaDataHandler.CreateConnectionRule(cr, identity);
                    result.AppendLine(string.Format("Verbindungsregel {0} {1} / {2} {3} angelegt.", upperType.TypeName,
                        connType.ConnTypeName, connType.ConnTypeReverseName, lowerType.TypeName));
                }
            }
            return connectionRules;
        }

        /// <summary>
        /// Holt oder erzeugt einen Item-Typ mit dem angegebenen Namen
        /// </summary>
        /// <param name="itemTypeName">Gesuchter oder anzulegender Namen</param>
        /// <param name="colorCode">Farbcode (nur für Neuanlage)</param>
        /// <param name="identity">Identität, mit der die Aktion durchgeführt wird</param>
        /// <returns></returns>
        private static ItemType GetOrCreateItemType(string itemTypeName, string colorCode, WindowsIdentity identity)
        {
            ItemType itemType = MetaDataHandler.GetItemType(itemTypeName);
            if (itemType == null)
            {
                itemType = new ItemType() { TypeId = Guid.NewGuid(), TypeName = itemTypeName, TypeBackColor = colorCode };
                MetaDataHandler.CreateItemType(itemType, identity);
            }

            return itemType;
        }

        /// <summary>
        /// Gibt ein vorhandenes Configuration Item zurück oder erzeugt ein neues und gibt das zurück
        /// </summary>
        /// <param name="name">Name des Items</param>
        /// <param name="itemType">Item-Typ</param>
        /// <param name="identity">Identität, mit der das durchgeführt wird</param>
        /// <returns></returns>
        private static ConfigurationItem GetOrCreateConfigurationItem(string name, ItemType itemType, WindowsIdentity identity)
        {
            ConfigurationItem ci = DataHandler.GetConfigurationItemByTypeIdAndName(itemType.TypeId, name);
            if (ci == null)
            {
                ci = new ConfigurationItem()
                {
                    ItemId = Guid.NewGuid(),
                    ItemName = name,
                    ItemType = itemType.TypeId
                };
                DataHandler.CreateConfigurationItem(ci, identity);
            }
            return ci;
        }
    }
}
