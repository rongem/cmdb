using CmdbAPI.Factories;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using CmdbAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CmdbAPI.DataAccess;

namespace CmdbAPI.BusinessLogic
{
    public static class MetaDataHandler
    {
        #region Create

        /// <summary>
        /// Erzeugt eine Attributgruppe
        /// </summary>
        /// <param name="attributeGroup">Attributgruppe, die neu erzeugt werden soll</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz erzeugt</param>
        public static void CreateAttributeGroup(AttributeGroup attributeGroup, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertAttributeGroupIsValid(attributeGroup);
            AttributeGroups.Insert(attributeGroup.GroupId, attributeGroup.GroupName);
        }

        /// <summary>
        /// Überprüft, ob eine Attributgruppe valide Daten enthält
        /// </summary>
        /// <param name="attributeGroup">Attributgruppe</param>
        private static void AssertAttributeGroupIsValid(AttributeGroup attributeGroup)
        {
            if (attributeGroup == null || attributeGroup.GroupId.Equals(Guid.Empty) || string.IsNullOrWhiteSpace(attributeGroup.GroupName))
                throw new ArgumentException("Falsche Werte für die Attributgruppe angegeben. Die Werte dürfen nicht leer sein.");
        }

        /// <summary>
        /// Erzeugt einen Attributtypen
        /// </summary>
        /// <param name="attributeType">Attributtyp</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz erzeugt</param>
        public static void CreateAttributeType(AttributeType attributeType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertAttributeTypeIsValid(attributeType);
            AttributeTypes.Insert(attributeType.TypeId, attributeType.TypeName, attributeType.AttributeGroup, new System.Text.RegularExpressions.Regex(attributeType.ValidationExpression));
        }

        /// <summary>
        /// Überprüft, ob ein Attributtyp valide Daten enthält
        /// </summary>
        /// <param name="attributeType">Attributtyp</param>
        public static void AssertAttributeTypeIsValid(AttributeType attributeType)
        {
            if (attributeType == null || attributeType.TypeId.Equals(Guid.Empty) || string.IsNullOrWhiteSpace(attributeType.TypeName))
                throw new ArgumentException("Falsche Werte für den Attributtypen angegeben. Die Werte dürfen nicht leer sein.");
            if (string.IsNullOrWhiteSpace(attributeType.ValidationExpression))
                attributeType.ValidationExpression = "^.*$";
            if (!attributeType.ValidationExpression.StartsWith("^") || !attributeType.ValidationExpression.EndsWith("$"))
                throw new FormatException("Der reguläre Ausdruck muss die gesamte Zeile abbilden. Start mit ^ und Ende mit $ müssen gesetzt sein");
            new System.Text.RegularExpressions.Regex(attributeType.ValidationExpression);
        }

        /// <summary>
        /// Erzeugt eine Verbindungsregel
        /// </summary>
        /// <param name="connectionRule">Verbindungsregel</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz erzeugt</param>
        public static void CreateConnectionRule(ConnectionRule connectionRule, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertConnectionRuleIsValid(connectionRule);
            if (ItemTypes.SelectOne(connectionRule.ItemUpperType) == null || ItemTypes.SelectOne(connectionRule.ItemUpperType) == null || ConnectionTypes.SelectOne(connectionRule.ConnType) == null)
                throw new NullReferenceException("Mindestens einer der verküpften Typen wurde nicht gefunden.");
            //if (connectionRule.ItemLowerType.Equals(connectionRule.ItemUpperType))
            //    throw new ArgumentException("Es können keine Verbindungen zwischen zwei gleichen ItemTypen erzeugt werden");
            ConnectionRules.Insert(connectionRule.RuleId, connectionRule.ItemUpperType, connectionRule.ConnType, connectionRule.ItemLowerType, connectionRule.MaxConnectionsToUpper, connectionRule.MaxConnectionsToLower, connectionRule.ValidationExpression);
        }

        /// <summary>
        /// Überprüft, ob eine Verbindungsregel valide Daten enthält
        /// </summary>
        /// <param name="connectionRule">Verbindungsregel zum validieren</param>
        private static void AssertConnectionRuleIsValid(ConnectionRule connectionRule)
        {
            if (connectionRule == null || connectionRule.RuleId.Equals(Guid.Empty) || connectionRule.ConnType.Equals(Guid.Empty) || connectionRule.ItemLowerType.Equals(Guid.Empty) || connectionRule.ItemUpperType.Equals(Guid.Empty))
                throw new ArgumentException("Falsche Werte für den Verbindungsregel angegeben. Die Werte für die maximal möglichen Verbindungen dürfen nicht leer sein.");
            if (connectionRule.MaxConnectionsToLower < 1 || connectionRule.MaxConnectionsToLower > 9999 || connectionRule.MaxConnectionsToUpper < 1 || connectionRule.MaxConnectionsToUpper > 9999)
                throw new ArgumentOutOfRangeException("Die Maximalanzahlen müssen größer 0 und kleiner 9999 sein");
            if (string.IsNullOrWhiteSpace(connectionRule.ValidationExpression) || !connectionRule.ValidationExpression.StartsWith("^") || !connectionRule.ValidationExpression.EndsWith("$"))
            {
                throw new ArgumentException("Der reguläre Ausdruck für die Beschreibung der Verbindungen muss gesetzt sein");
            }
            new System.Text.RegularExpressions.Regex(connectionRule.ValidationExpression);
        }

        /// <summary>
        /// Erzeugt einen Verbindungstyp
        /// </summary>
        /// <param name="connectionType">Verbindungstyp</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz erzeugt</param>
        public static void CreateConnectionType(ConnectionType connectionType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertConnectionTypeIsValid(connectionType);
            ConnectionTypes.Insert(connectionType.ConnTypeId, connectionType.ConnTypeName, connectionType.ConnTypeReverseName);
        }

        /// <summary>
        /// Überprüft, ob ein Verbindungstyp valide Daten enthält
        /// </summary>
        /// <param name="connectionType"></param>
        private static void AssertConnectionTypeIsValid(ConnectionType connectionType)
        {
            if (connectionType == null || connectionType.ConnTypeId.Equals(Guid.Empty) || string.IsNullOrWhiteSpace(connectionType.ConnTypeName) || string.IsNullOrWhiteSpace(connectionType.ConnTypeReverseName))
                throw new ArgumentException("Falsche Werte für den Attributtypen angegeben. Die Werte dürfen nicht leer sein.");
        }

        /// <summary>
        /// Erzeugt eine Configuration Item Type
        /// </summary>
        /// <param name="itemType">Typ des Configuration Item</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz erzeugt</param>
        public static void CreateItemType(ItemType itemType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertItemTypeIsValid(itemType);
            ItemTypes.Insert(itemType.TypeId, itemType.TypeName, itemType.TypeBackColor);
        }

        /// <summary>
        /// Überprüft, ob ein ItemTyp valide Daten enthält
        /// </summary>
        /// <param name="itemType">ItemTyp</param>
        private static void AssertItemTypeIsValid(ItemType itemType)
        {
            if (itemType == null)
                throw new ArgumentException("Der ItemType darf nicht null sein");
            if (itemType.TypeId.Equals(Guid.Empty) || string.IsNullOrWhiteSpace(itemType.TypeName) || string.IsNullOrWhiteSpace(itemType.TypeBackColor))
                throw new ArgumentException("Falsche Werte für den ItemType angegeben. Die Werte dürfen nicht leer sein.");
            if (!System.Text.RegularExpressions.Regex.IsMatch(itemType.TypeBackColor.ToUpper(), "^#[0-9A-F]{6}$"))
                throw new ArgumentException("Falsche Werte für den ItemType angegeben. Der Farbcode hat ein falsches Format.");
        }

        /// <summary>
        /// Erzeugt eine Zuordnung einer Attributgruppe zu einem Typ eines Configuration Item
        /// </summary>
        /// <param name="itemTypeAttributeMapping">Zuordnung der Attributgruppe zum Typ des Configuration Item</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz erzeugt</param>
        public static void CreateItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertItemTypeAttributeGroupMappingIsValid(itemTypeAttributeMapping);
            if (AttributeGroups.SelectOne(itemTypeAttributeMapping.GroupId) == null || ItemTypes.SelectOne(itemTypeAttributeMapping.ItemTypeId) == null)
                throw new NullReferenceException("Mindestens einer der verküpften Typen wurde nicht gefunden.");
            ItemTypeAttributeGroupMappings.Insert(itemTypeAttributeMapping.GroupId, itemTypeAttributeMapping.ItemTypeId);
        }

        /// <summary>
        /// Prüft, ob die Zuordnung einer Attributgruppe zu einem ConfigurationItem-Typen valide Daten enthält
        /// </summary>
        /// <param name="itemTypeAttributeMapping">Zuordnung der Attributgruppe zum Typ des Configuration Item</param>
        private static void AssertItemTypeAttributeGroupMappingIsValid(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
        {
            if (itemTypeAttributeMapping == null || itemTypeAttributeMapping.GroupId.Equals(Guid.Empty) || itemTypeAttributeMapping.ItemTypeId.Equals(Guid.Empty))
                throw new ArgumentException("Falsche Werte für die Zuordnung angegeben. Die Werte dürfen nicht leer sein.");
        }

        #endregion

        #region Read

        #region AttributeGroups

        /// <summary>
        /// Gibt ein IEnumerable von Attributgruppen zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<AttributeGroup> GetAttributeGroups()
        {
            foreach (CMDBDataSet.AttributeGroupsRow agr in AttributeGroups.SelectAll())
            {
                yield return new AttributeGroup() { GroupId = agr.GroupId, GroupName = agr.GroupName };
            }
        }

        /// <summary>
        /// Gibt eine einzelne AttributeGroup zurück, deren ID angegeben wurde
        /// </summary>
        /// <param name="id">Guid der Attributgruppe</param>
        /// <returns></returns>
        public static AttributeGroup GetAttributeGroup(Guid id)
        {
            CMDBDataSet.AttributeGroupsRow agr = AttributeGroups.SelectOne(id);
            return agr == null ? null : new AttributeGroup() { GroupId = agr.GroupId, GroupName = agr.GroupName };
        }

        /// <summary>
        /// Gibt ein IEnumerable von Attributgruppen zurück, die einem angegebenen ItemTyp zugeordnet sind
        /// </summary>
        /// <param name="itemType">GUID des ItemType</param>
        /// <returns></returns>
        public static IEnumerable<AttributeGroup> GetAttributeGroupsAssignedToItemType(Guid itemType)
        {
            foreach (CMDBDataSet.AttributeGroupsRow agr in AttributeGroups.GetAssignedToItem(itemType))
            {
                yield return new AttributeGroup() { GroupId = agr.GroupId, GroupName = agr.GroupName };
            }
        }
        /// <summary>
        /// Gibt ein IEnumerable von Attributgruppen zurück, die nicht einem angegebenen ItemTyp zugeordnet sind
        /// </summary>
        /// <param name="itemType">GUID des ItemType</param>
        /// <returns></returns>
        public static IEnumerable<AttributeGroup> GetAttributeGroupsNotAssignedToItemType(Guid itemType)
        {
            foreach (CMDBDataSet.AttributeGroupsRow agr in AttributeGroups.GetUnassigned(itemType))
            {
                yield return new AttributeGroup() { GroupId = agr.GroupId, GroupName = agr.GroupName };
            }
        }

        #endregion

        #region AttributeTypes

        /// <summary>
        /// Gibt ein IEnumerable von Attributtypen zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<AttributeType> GetAttributeTypes()
        {
            foreach (CMDBDataSet.AttributeTypesRow atr in AttributeTypes.SelectAll())
            {
                yield return new AttributeType() { TypeId = atr.AttributeTypeId, TypeName = atr.AttributeTypeName, AttributeGroup = atr.AttributeGroup, ValidationExpression = atr.ValidationRule };
            }
        }

        /// <summary>
        /// Gibt einen Attributtypen zurück
        /// </summary>
        /// <param name="id">GUID des Attributtypen</param>
        /// <returns></returns>
        public static AttributeType GetAttributeType(Guid id)
        {
            CMDBDataSet.AttributeTypesRow atr = AttributeTypes.SelectOne(id);
            return atr == null ? null : new AttributeType() { TypeId = atr.AttributeTypeId, TypeName = atr.AttributeTypeName, AttributeGroup = atr.AttributeGroup, ValidationExpression = atr.ValidationRule };
        }

        /// <summary>
        /// Liefert alle Attributtypen zurück, die direkt einer Gruppe zugeordnet sind.
        /// </summary>
        /// <param name="group">Attributgruppe</param>
        /// <returns></returns>
        public static IEnumerable<AttributeType> GetAttributeTypesForAttributeGroup(AttributeGroup group)
        {
            foreach (CMDBDataSet.AttributeTypesRow atr in AttributeTypes.GetForGroup(group.GroupId))
            {
                yield return new AttributeType() { TypeId = atr.AttributeTypeId, TypeName = atr.AttributeTypeName, AttributeGroup = atr.AttributeGroup };
            }
        }

        /// <summary>
        /// Liefert alle Attributtypen zurück, deren Wert bei allen Items gleichlaufend mit den Werten des angegebenen Attributtypen ist,
        /// und die so beim Umwandeln eines Attributtypen in einen Configuration Item Typen mitgenommen werden können
        /// </summary>
        /// <param name="attributeTypeId"></param>
        /// <returns></returns>
        public static IEnumerable<AttributeType> GetAttributeTypesForCorrespondingValuesOfType(Guid attributeTypeId)
        {
            foreach (CMDBDataSet.AttributeTypesRow atr in AttributeTypes.SelectForCorrespondingValuesToAttributeType(attributeTypeId))
            {
                yield return new AttributeType() { TypeId = atr.AttributeTypeId, TypeName = atr.AttributeTypeName, AttributeGroup = atr.AttributeGroup };
            }
        }

        /// <summary>
        /// Liefert die erlaubten Attributtypen für einen ItemTyp zurück
        /// </summary>
        /// <param name="itemTypeId">Guid des Itemtyps</param>
        /// <returns></returns>
        public static IEnumerable<AttributeType> GetAllowedAttributeTypesForItemType(Guid itemTypeId)
        {
            foreach (CMDBDataSet.AttributeTypesRow atr in AttributeTypes.SelectForItemType(itemTypeId))
            {
                yield return new AttributeType() { TypeId = atr.AttributeTypeId, TypeName = atr.AttributeTypeName, AttributeGroup = atr.AttributeGroup };
            }
        }

        #endregion

        #region ConnectionRules

        /// <summary>
        /// Gibt ein IEnumerable mit allen ConnectionRules zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<ConnectionRule> GetConnectionRules()
        {
            foreach (CMDBDataSet.ConnectionRulesRow crr in ConnectionRules.SelectAll())
            {
                yield return ConnectionRuleFactory.GetConnectionRuleTransferObject(crr);
            }
        }

        /// <summary>
        /// Gibt ein IEnumerable mit den Verbindungsregeln für einen ItemType zurück
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns></returns>
        public static IEnumerable<ConnectionRule> GetConnectionRulesForItemType(Guid itemType)
        {
            foreach (CMDBDataSet.ConnectionRulesRow crr in ConnectionRules.SelectAll().Where(a => a.ItemLowerType.Equals(itemType) || a.ItemUpperType.Equals(itemType)))
            {
                yield return ConnectionRuleFactory.GetConnectionRuleTransferObject(crr);
            }
        }

        /// <summary>
        /// Gibt ein IEnumerable mit den Verbindungsregeln zurück, bei denen der obere ItemTyp dem angegebenen entspricht
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns></returns>
        public static IEnumerable<ConnectionRule> GetConnectionRulesByUpperItemType(Guid itemType)
        {
            foreach (CMDBDataSet.ConnectionRulesRow crr in ConnectionRules.GetByItemUpperType(itemType))
            {
                yield return ConnectionRuleFactory.GetConnectionRuleTransferObject(crr);
            }
        }

        /// <summary>
        /// Gibt ein IEnumerable mit den Verbindungsregeln zurück, bei denen der untere ItemTyp dem angegebenen entspricht
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns></returns>
        public static IEnumerable<ConnectionRule> GetConnectionRulesByLowerItemType(Guid itemType)
        {
            foreach (CMDBDataSet.ConnectionRulesRow crr in ConnectionRules.GetByItemLowerType(itemType))
            {
                yield return ConnectionRuleFactory.GetConnectionRuleTransferObject(crr);
            }
        }

        /// <summary>
        /// Gibt ein IEnumerable mit den Verbindungsregeln zurück, bei denen der obere und der untere ItemTyp den jeweils angegebenen entsprechen
        /// </summary>
        /// <param name="upperItemType">Guid des oberen ItemType</param>
        /// <param name="lowerItemType">Guid des unteren ItemType</param>
        /// <returns></returns>
        public static IEnumerable<ConnectionRule> GetConnectionRulesByUpperAndLowerItemType(Guid upperItemType, Guid lowerItemType)
        {
            foreach (CMDBDataSet.ConnectionRulesRow crr in ConnectionRules.SelectByUpperAndLowerItemType(upperItemType, lowerItemType))
            {
                yield return ConnectionRuleFactory.GetConnectionRuleTransferObject(crr);
            }
        }

        /// <summary>
        /// Gibt ein IEnumerable mit gefilterten Verbindungsregeln zurück. Im Gegensatz zu den normalen Filterregeln sind hier die Typen-Bezeichnungen mit angegeben
        /// </summary>
        /// <param name="upperItemType">Guid des oberen Itemstype, darf NULL sein, wird dann nicht gefiltert</param>
        /// <param name="connectionType">Guid des Verbindungstyps, darf NULL sein, wird dann nicht gefiltert</param>
        /// <param name="lowerItemType">Guid des unteren Itemstype, darf NULL sein, wird dann nicht gefiltert</param>
        /// <returns></returns>
        public static IEnumerable<DataObjects.ConnectionRuleFilterExtender> FilterConnectionRules(Guid? upperItemType, Guid? connectionType, Guid? lowerItemType)
        {
            foreach (CMDBDataSet.ConnectionRules_FilterRow connectionRules_FilterRow in ConnectionRules.Filter(upperItemType, connectionType, lowerItemType))
            {
                yield return new DataObjects.ConnectionRuleFilterExtender()
                {
                    RuleId = connectionRules_FilterRow.RuleId,
                    ConnType = connectionRules_FilterRow.ConnType,
                    ConnTypeName = connectionRules_FilterRow.ConnTypeName,
                    ItemLowerType = connectionRules_FilterRow.ItemLowerType,
                    ItemLowerTypeName = connectionRules_FilterRow.ItemLowerTypeName,
                    ItemUpperType = connectionRules_FilterRow.ItemUpperType,
                    ItemUpperTypeName = connectionRules_FilterRow.ItemUpperTypeName,
                    MaxConnectionsToLower = connectionRules_FilterRow.MaxConnectionsToLower,
                    MaxConnectionsToUpper = connectionRules_FilterRow.MaxConnectionsToUpper,
                    ValidationExpression = connectionRules_FilterRow.ValidationRule,
                    ExistingConnections = connectionRules_FilterRow.ExistingConnections,
                    MaxExistingConnectionsFromLower = connectionRules_FilterRow.MaxFromLower,
                    MaxExistingConnectionsFromUpper = connectionRules_FilterRow.MaxFromUpper,
                };
            }
        }

        /// <summary>
        /// Gibt eine Verbindungsregel zurück
        /// </summary>
        /// <param name="id">GUID der Verbindungsregel</param>
        /// <returns></returns>
        public static ConnectionRule GetConnectionRule(Guid id)
        {
            CMDBDataSet.ConnectionRulesRow crr = ConnectionRules.SelectOne(id);
            return crr == null ? null : ConnectionRuleFactory.GetConnectionRuleTransferObject(crr);
        }

        /// <summary>
        /// Gibt die Verbindungsregel zurück, die den angegebenen Inhalt hat
        /// </summary>
        /// <param name="upperItemType">Oberer Itemtyp</param>
        /// <param name="connectionType">Verbindungstyp</param>
        /// <param name="lowerItemType">Unterer Itemtyp</param>
        /// <returns></returns>
        public static ConnectionRule GetConnectionRuleByContent(Guid upperItemType, Guid connectionType, Guid lowerItemType)
        {
            CMDBDataSet.ConnectionRulesRow crr = ConnectionRules.SelectByContent(upperItemType, connectionType, lowerItemType);
            if (crr == null)
                return null;
            return ConnectionRuleFactory.GetConnectionRuleTransferObject(crr);
        }

        #endregion

        #region ConnectionTypes

        /// <summary>
        /// Gibt ein IEnumerable mit den Verbindungstypen zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<ConnectionType> GetConnectionTypes()
        {
            foreach (CMDBDataSet.ConnectionTypesRow ctr in ConnectionTypes.SelectAll())
            {
                yield return new ConnectionType()
                {
                    ConnTypeId = ctr.ConnTypeId,
                    ConnTypeName = ctr.ConnTypeName,
                    ConnTypeReverseName = ctr.ConnTypeReverseName
                };
            }
        }

        /// <summary>
        /// Gibt einen Verbindungstypen zurück
        /// </summary>
        /// <param name="id">GUID des Verbindungstypen</param>
        /// <returns></returns>
        public static ConnectionType GetConnectionType(Guid id)
        {
            CMDBDataSet.ConnectionTypesRow ctr = ConnectionTypes.SelectOne(id);
            return ctr == null ? null : new ConnectionType() { ConnTypeId = ctr.ConnTypeId, ConnTypeName = ctr.ConnTypeName, ConnTypeReverseName = ctr.ConnTypeReverseName };
        }

        /// <summary>
        /// Liefert alle Verbindungstypen zurück, die entsprechend der Verbindungsregeln für Abwärts-Verbindungen erlaubt sind
        /// </summary>
        /// <param name="itemTypeId">Guid des gesuchten Itemtyps</param>
        /// <returns></returns>
        public static IEnumerable<ConnectionType> GetAllowedDownwardConnnectionTypesForItemType(Guid itemTypeId)
        {
            foreach (CMDBDataSet.ConnectionTypesRow ctr in ConnectionTypes.GetDownwardConnnectionTypesForItemType(itemTypeId))
            {
                yield return new ConnectionType() { ConnTypeId = ctr.ConnTypeId, ConnTypeName = ctr.ConnTypeName, ConnTypeReverseName = ctr.ConnTypeReverseName };
            }
        }

        /// <summary>
        /// Liefert alle Verbindungstypen zurück, die entsprechend der Verbindungsregeln für Aufwärts-Verbindungen erlaubt sind
        /// </summary>
        /// <param name="itemTypeId">Guid des gesuchten Itemtyps</param>
        /// <returns></returns>
        public static IEnumerable<ConnectionType> GetAllowedUpwardConnnectionTypesForItemType(Guid itemTypeId)
        {
            foreach (CMDBDataSet.ConnectionTypesRow ctr in ConnectionTypes.GetUpwardConnectionTypesForItemType(itemTypeId))
            {
                yield return new ConnectionType() { ConnTypeId = ctr.ConnTypeId, ConnTypeName = ctr.ConnTypeName, ConnTypeReverseName = ctr.ConnTypeReverseName };
            }
        }

        #endregion

        #region ItemTypes

        /// <summary>
        /// Gibt alle ItemTypes in alphabetischer Reihenfolge zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<ItemType> GetItemTypes()
        {
            foreach (CMDBDataSet.ItemTypesRow itr in ItemTypes.SelectAll())
            {
                yield return new ItemType() { TypeId = itr.TypeId, TypeName = itr.TypeName, TypeBackColor = itr.TypeBackColor };
            }
        }

        /// <summary>
        /// Gibt alle ItemTypes in alphabetischer Reihenfolge zurück, die einen bestimmten Attributtypen annehmen können
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<ItemType> GetItemTypesByAllowedAttributeType(Guid attributeTypeId)
        {
            foreach (CMDBDataSet.ItemTypesRow itr in ItemTypes.SelectByAllowedAttributeType(attributeTypeId))
            {
                yield return new ItemType() { TypeId = itr.TypeId, TypeName = itr.TypeName, TypeBackColor = itr.TypeBackColor };
            }
        }

        /// <summary>
        /// Gibt einen ItemTyp zurück
        /// </summary>
        /// <param name="id">GUID des Itemtypen</param>
        /// <returns></returns>
        public static ItemType GetItemType(Guid id)
        {
            CMDBDataSet.ItemTypesRow itr = ItemTypes.SelectOne(id);
            return itr == null ? null : new ItemType() { TypeId = itr.TypeId, TypeName = itr.TypeName, TypeBackColor = itr.TypeBackColor };
        }

        /// <summary>
        /// Gibt einen ItemTyp zurück
        /// </summary>
        /// <param name="typeName">Name des ItemType</param>
        /// <returns></returns>
        public static ItemType GetItemType(string typeName)
        {
            CMDBDataSet.ItemTypesRow itr = ItemTypes.SelectByName(typeName);
            return itr == null ? null : new ItemType() { TypeId = itr.TypeId, TypeName = itr.TypeName, TypeBackColor = itr.TypeBackColor };
        }

        /// <summary>
        /// Prüft, ob ein Name für einen Item-Typ schon verwendet wird
        /// </summary>
        /// <param name="typeName">Name des ItemType</param>
        /// <returns></returns>
        public static bool ItemTypeNameExists(string typeName)
        {
            CMDBDataSet.ItemTypesRow itr = ItemTypes.SelectByName(typeName);
            return itr != null;
        }

        /// <summary>
        /// Gibt die erlaubten unteren Itemtypen zurück, wenn der obere Itemtyp und der Verbindungstyp angegeben sind.
        /// </summary>
        /// <param name="upperItemTypeId">Oberer Itemtyp</param>
        /// <param name="connectionTypeId">Verbindungstyp</param>
        /// <returns></returns>
        public static IEnumerable<ItemType> GetLowerItemTypeForUpperItemTypeAndConnectionType(Guid upperItemTypeId, Guid connectionTypeId)
        {
            foreach (CMDBDataSet.ItemTypesRow itr in ItemTypes.GetLowerItemTypeForUpperItemTypeAndConnectionType(upperItemTypeId, connectionTypeId))
            {
                yield return new ItemType() { TypeId = itr.TypeId, TypeName = itr.TypeName, TypeBackColor = itr.TypeBackColor };
            }
        }

        /// <summary>
        /// Gibt die erlaubten oberen Itemtypen zurück, wenn der untere Itemtyp und der Verbindungstyp angegeben sind.
        /// </summary>
        /// <param name="lowerItemTypeId">Oberer Itemtyp</param>
        /// <param name="connectionTypeId">Verbindungstyp</param>
        /// <returns></returns>
        public static IEnumerable<ItemType> GetUpperItemTypeForLowerItemTypeAndConnectionType(Guid lowerItemTypeId, Guid connectionTypeId)
        {
            foreach (CMDBDataSet.ItemTypesRow itr in ItemTypes.GetUpperItemTypeForLowerItemTypeAndConnectionType(lowerItemTypeId, connectionTypeId))
            {
                yield return new ItemType() { TypeId = itr.TypeId, TypeName = itr.TypeName, TypeBackColor = itr.TypeBackColor };
            }
        }

        /// <summary>
        /// Gibt die Item-Typen zurück, für deren CIs Attribute des angegebenen Typs existieren, und die die Zielgruppe nicht zugeordnet haben
        /// </summary>
        /// <param name="attributeTypeId">Attribut-Typ, der verschoben werden soll</param>
        /// <param name="attributeGroupId">Gruppe, in die der Attribut-Typ verschoben werden soll</param>
        /// <returns></returns>
        public static IEnumerable<ItemType> GetItemTypesByAttributeTypeToMoveAndTargetGroup(Guid attributeTypeId, Guid attributeGroupId)
        {
            foreach (CMDBDataSet.ItemTypesRow itr in ItemTypes.SelectByAttributeTypeToMoveAndTargetGroup(attributeTypeId, attributeGroupId))
            {
                yield return new ItemType() { TypeId = itr.TypeId, TypeName = itr.TypeName, TypeBackColor = itr.TypeBackColor };
            }
        }

        #endregion

        #region ItemTypeAttributeGroupMappings

        /// <summary>
        /// Gibt alle Zuordnungen von ItemTypen zu Attributgruppen zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<ItemTypeAttributeGroupMapping> GetItemTypeAttributeGroupMappings()
        {
            foreach (CMDBDataSet.ItemTypeAttributeGroupMappingsRow iag in ItemTypeAttributeGroupMappings.SelectAll())
            {
                yield return new ItemTypeAttributeGroupMapping() { GroupId = iag.GroupId, ItemTypeId = iag.ItemTypeId };
            }
        }

        /// <summary>
        /// Gibt alle Zuordnungen von ItemTypen zu Attributgruppen zurück
        /// </summary>
        /// <returns></returns>
        public static ItemTypeAttributeGroupMapping GetItemTypeAttributeGroupMapping(Guid groupId, Guid itemTypeId)
        {
            CMDBDataSet.ItemTypeAttributeGroupMappingsRow r = ItemTypeAttributeGroupMappings.SelectByContent(groupId, itemTypeId);
            return r == null ? null : new TransferObjects.ItemTypeAttributeGroupMapping() { GroupId = r.GroupId, ItemTypeId = r.ItemTypeId };
        }

        #endregion

        #endregion

        #region Delete

        /// <summary>
        /// Prüft, ob eine AttributGruppe gelöscht werden kann, oder ob noch Hindernisse existieren
        /// </summary>
        /// <param name="attributeGroup">GUID der Attributgruppe</param>
        /// <returns></returns>
        public static bool CanDeleteAttributeGroup(Guid attributeGroup)
        {
            return AttributeTypes.GetForGroup(attributeGroup).Count == 0 && ItemTypeAttributeGroupMappings.GetCountForGroup(attributeGroup) == 0;
        }

        /// <summary>
        /// Löscht eine Attributgruppe
        /// </summary>
        /// <param name="attributeGroup">Attributgruppe, die gelöscht werden soll</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz löscht</param>
        public static void DeleteAttributeGroup(AttributeGroup attributeGroup, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            if (AttributeTypes.GetForGroup(attributeGroup.GroupId).Count > 0)
                throw new InvalidOperationException("Es sind noch Attribute zugeordnet, die Gruppe kann nicht gelöscht werden.");
            AttributeGroups.Delete(attributeGroup.GroupId, attributeGroup.GroupName);
        }

        /// <summary>
        /// Prüft, ob ein Attributtyp gelöscht werden kann, oder ob noch Hindernisse existieren
        /// </summary>
        /// <param name="attributeType">GUID des Attributtyps</param>
        /// <returns></returns>
        public static bool CanDeleteAttributeType(Guid attributeType)
        {
            return ItemAttributes.GetCountForAttributeType(attributeType) == 0;
        }

        /// <summary>
        /// Löscht einen Attributtyp
        /// </summary>
        /// <param name="attributeType">Attributtyp</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz löscht</param>
        public static void DeleteAttributeType(AttributeType attributeType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            if (ItemAttributes.GetCountForAttributeType(attributeType.TypeId) > 0)
                throw new InvalidOperationException("Es sind noch Attribute vorhanden, der Typ kann nicht gelöscht werden.");
            AttributeTypes.Delete(attributeType.TypeId, attributeType.TypeName, attributeType.AttributeGroup, new System.Text.RegularExpressions.Regex(attributeType.ValidationExpression));
        }

        /// <summary>
        /// Prüft, ob eine Verbindungsregel gelöscht werden kann, oder ob noch Hindernisse bestehen
        /// </summary>
        /// <param name="connectionRule">GUID der Verbindungsregel</param>
        /// <returns></returns>
        public static bool CanDeleteConnectionRule(Guid connectionRule)
        {
            return Connections.GetCountForRule(connectionRule) == 0;
        }

        /// <summary>
        /// Löscht eine Verbindungsregel, wenn keine Verbindungen zwischen Configuration Items mehr vorhanden sind, die der Verbindungsregel entsprechen
        /// </summary>
        /// <param name="connectionRule">Verbindungsregel</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz löscht</param>
        public static void DeleteConnectionRule(ConnectionRule connectionRule, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            if (Connections.GetCountForRule(connectionRule.RuleId) > 0)
                throw new InvalidOperationException("Es sind noch Verbindungen vorhanden, die Regel kann nicht gelöscht werden.");
            ConnectionRules.Delete(connectionRule.RuleId, connectionRule.ItemUpperType, connectionRule.ConnType, connectionRule.ItemLowerType, connectionRule.MaxConnectionsToUpper, connectionRule.MaxConnectionsToLower, connectionRule.ValidationExpression);
        }

        /// <summary>
        /// Prüft, ob ein Verbindungstyp gelöscht werden kann, oder ob noch Hindernisse bestehen
        /// </summary>
        /// <param name="connectionType">GUID des Verbindungstyps</param>
        /// <returns></returns>
        public static bool CanDeleteConnectionType(Guid connectionType)
        {
            return Connections.GetCountForConnectionType(connectionType) == 0;
        }

        /// <summary>
        /// Löscht einen Verbindungstypen, wenn keine Verbindungen zwischen Configuration Items von diesem Typ vorhanden sind.
        /// </summary>
        /// <param name="connectionType">Verbindungstyp</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz löscht</param>
        public static void DeleteConnectionType(ConnectionType connectionType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            if (Connections.GetCountForConnectionType(connectionType.ConnTypeId) > 0)
                throw new InvalidOperationException("Es sind noch Verbindungen vorhanden, der Typ kann nicht gelöscht werden.");
            ConnectionTypes.Delete(connectionType.ConnTypeId, connectionType.ConnTypeName, connectionType.ConnTypeReverseName);
        }

        /// <summary>
        /// Prüft, ob eine Zuordnung von ItemTypen zu Attributgruppen gelöscht werden kann, oder ob noch Hindernisse bestehen
        /// </summary>
        /// <param name="itemTypeAttributeGroupMapping">Zuordnung von ItemTypen zu Attributgruppen</param>
        /// <returns></returns>
        public static bool CanDeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeGroupMapping)
        {
            return ItemAttributes.GetCountForAttributeGroupAndItemType(itemTypeAttributeGroupMapping.GroupId, itemTypeAttributeGroupMapping.ItemTypeId) == 0;
        }

        /// <summary>
        /// Gibt die Anzahl der Attribute zurück, die innerhalb einer Zuordnung einer Attributgruppe zu einem Item-Typ existieren
        /// </summary>
        /// <param name="itemTypeAttributeGroupMapping">Zuordnung der Attributgruppe zu einem Item-Typ</param>
        /// <returns></returns>
        public static int CountAttributesForItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeGroupMapping)
        {
            return ItemAttributes.GetCountForAttributeGroupAndItemType(itemTypeAttributeGroupMapping.GroupId, itemTypeAttributeGroupMapping.ItemTypeId);
        }

        /// <summary>
        /// Löscht eine Zuordnung von ItemTypen zu Attributgruppen, ggf. inklusive aller zugehörigen Attribute
        /// </summary>
        /// <param name="itemTypeAttributeGroupMapping">Zuordnung von ItemTypen zu Attributgruppen</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz löscht</param>
        public static void DeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeGroupMapping, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            int num = ItemAttributes.GetCountForAttributeGroupAndItemType(itemTypeAttributeGroupMapping.GroupId, itemTypeAttributeGroupMapping.ItemTypeId);
            if (num > 0)
                ItemAttributes.DeleteByGroupAndItemType(itemTypeAttributeGroupMapping.GroupId, itemTypeAttributeGroupMapping.ItemTypeId, identity.Name);
            ItemTypeAttributeGroupMappings.Delete(itemTypeAttributeGroupMapping.GroupId, itemTypeAttributeGroupMapping.ItemTypeId);
        }

        /// <summary>
        /// Prüft, ob ein Itemtyp gelöscht werden kann, oder ob noch Hindernisse bestehen
        /// </summary>
        /// <param name="itemType">Guid ItemTyp</param>
        /// <returns></returns>
        public static bool CanDeleteItemType(Guid itemType)
        {
            return ConfigurationItems.GetCountForType(itemType) == 0;
        }

        /// <summary>
        /// Löscht einen Itemtyp, sofern keine Configuration Items dieses Typs mehr existieren
        /// </summary>
        /// <param name="itemType">Itemtyp</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz löscht</param>
        public static void DeleteItemType(ItemType itemType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            if (ConfigurationItems.GetCountForType(itemType.TypeId) > 0)
                throw new InvalidOperationException("Es sind noch Configuration Items vorhanden, der Typ kann nicht gelöscht werden.");
            ItemTypes.Delete(itemType.TypeId, itemType.TypeName);
        }

        #endregion

        #region Update

        /// <summary>
        /// Aktualisiert eine Attributgruppe
        /// </summary>
        /// <param name="attributeGroup">Attributgruppe</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz aktualisiert</param>
        public static void UpdateAttributeGroup(AttributeGroup attributeGroup, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertAttributeGroupIsValid(attributeGroup);

            CMDBDataSet.AttributeGroupsRow agr = AttributeGroups.SelectOne(attributeGroup.GroupId);
            if (agr == null)
                throw new NullReferenceException("Keine Attributgruppe gefunden.");
            if (agr.GroupName.Equals(attributeGroup.GroupName, StringComparison.CurrentCulture))
                throw new ArgumentException("Keine Änderung durchgeführt.");
            agr.GroupName = attributeGroup.GroupName;
            AttributeGroups.Update(agr);
        }



        /// <summary>
        /// Aktualisiert einen Attributtyp
        /// </summary>
        /// <param name="attributeType">Attributtyp</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz aktualisiert</param>
        public static void UpdateAttributeType(AttributeType attributeType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertAttributeTypeIsValid(attributeType);

            CMDBDataSet.AttributeTypesRow atr = AttributeTypes.SelectOne(attributeType.TypeId);
            if (atr == null)
                throw new NullReferenceException("Keinen Attributtypen gefunden.");
            bool changed = false;
            if (!atr.AttributeTypeName.Equals(attributeType.TypeName, StringComparison.CurrentCulture))
            {
                atr.AttributeTypeName = attributeType.TypeName;
                changed = true;
            }
            if (!atr.AttributeGroup.Equals(attributeType.AttributeGroup))
            {
                atr.AttributeGroup = attributeType.AttributeGroup;
                changed = true;
            }
            if (!atr.ValidationRule.Equals(attributeType.ValidationExpression))
            {
                System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex(attributeType.ValidationExpression);
                // Prüft, ob vorhandene Attribute der Gültigkeitsregel entsprechen, bevor diese geändert wird
                foreach (CMDBDataSet.ItemAttributesRow row in ItemAttributes.SelectForAttributeType(atr.AttributeTypeId))
                {
                    if (!regex.IsMatch(row.AttributeValue))
                        throw new Exception(string.Format("Der Attributwert '{0}' entspricht nicht der neuen Gültigkeitsregel. Änderung wird verworfen", row.AttributeValue));
                }
                atr.ValidationRule = attributeType.ValidationExpression;
                changed = true;
            }
            if (!changed)
                throw new ArgumentException("Keine Änderung durchgeführt.");
            AttributeTypes.Update(atr);
        }

        /// <summary>
        /// Aktualisiert eine Verbindungsregel
        /// </summary>
        /// <param name="connectionRule">Verbindungsregel</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz aktualisiert</param>
        public static void UpdateConnectionRule(ConnectionRule connectionRule, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertConnectionRuleIsValid(connectionRule);

            CMDBDataSet.ConnectionRulesRow crr = ConnectionRules.SelectOne(connectionRule.RuleId);
            if (crr == null)
                throw new NullReferenceException("Keine Verbindungsregel gefunden.");
            if (!crr.ItemLowerType.Equals(connectionRule.ItemLowerType) || !crr.ItemUpperType.Equals(connectionRule.ItemUpperType))
                throw new ArgumentException("Änderung der Verbindungsziele ist nicht erlaubt.");
            if (!crr.ConnType.Equals(connectionRule.ConnType))
                throw new ArgumentException("Änderung des Verbindungstyps ist nicht erlaubt.");
            bool changed = false;
            if (crr.MaxConnectionsToLower != connectionRule.MaxConnectionsToLower)
            {
                crr.MaxConnectionsToLower = connectionRule.MaxConnectionsToLower;
                changed = true;
            }
            if (crr.MaxConnectionsToUpper != connectionRule.MaxConnectionsToUpper)
            {
                crr.MaxConnectionsToUpper = connectionRule.MaxConnectionsToUpper;
                changed = true;
            }
            if (!crr.ValidationRule.Equals(connectionRule.ValidationExpression))
            {
                System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex(connectionRule.ValidationExpression);
                foreach (CMDBDataSet.ConnectionsRow row in Connections.SelectByRule(connectionRule.RuleId))
                {
                    if (!regex.IsMatch(row.ConnDescription))
                    {
                        ConfigurationItem upper = DataHandler.GetConfigurationItem(row.ConnUpperItem),
                            lower = DataHandler.GetConfigurationItem(row.ConnLowerItem);
                        throw new Exception(string.Format(
                            "Mindestens eine Verbindung entspricht nicht der Gültigkeitsregel. Betroffene Beschreibung: '{0}', {1}: {2} {3}: {4}: {5}",
                            row.ConnDescription, upper.TypeName, upper.ItemName, MetaDataHandler.GetConnectionType(row.ConnType).ConnTypeName,
                            lower.TypeName, lower.ItemName));
                    }
                }
                crr.ValidationRule = connectionRule.ValidationExpression;
                changed = true;
            }
            if (!changed)
                throw new ArgumentException("Keine Änderung durchgeführt.");
            ConnectionRules.Update(crr);
        }

        /// <summary>
        /// Aktualisiert den Verbindungstyp
        /// </summary>
        /// <param name="connectionType">Verbindungstyp</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz aktualisiert</param>
        public static void UpdateConnectionType(ConnectionType connectionType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertConnectionTypeIsValid(connectionType);

            CMDBDataSet.ConnectionTypesRow ctr = ConnectionTypes.SelectOne(connectionType.ConnTypeId);
            if (ctr == null)
                throw new NullReferenceException("Keinen Verbindungstypen gefunden.");
            if (ctr.ConnTypeName.Equals(connectionType.ConnTypeName, StringComparison.CurrentCulture) && ctr.ConnTypeReverseName.Equals(connectionType.ConnTypeReverseName, StringComparison.CurrentCulture))
                throw new ArgumentException("Keine Änderung durchgeführt.");
            ctr.ConnTypeName = connectionType.ConnTypeName;
            ctr.ConnTypeReverseName = connectionType.ConnTypeReverseName;
            ConnectionTypes.Update(ctr);
        }

        /// <summary>
        /// Aktualisiert einen Itemtyp
        /// </summary>
        /// <param name="itemType">Itemtyp</param>
        /// <param name="identity">Identität desjenigen, der den Datensatz aktualisiert</param>
        public static void UpdateItemType(ItemType itemType, System.Security.Principal.WindowsIdentity identity)
        {
            SecurityHandler.AssertUserIsInRole(identity, UserRole.Administrator);
            AssertItemTypeIsValid(itemType);

            CMDBDataSet.ItemTypesRow itr = ItemTypes.SelectOne(itemType.TypeId);
            if (itr == null)
                throw new NullReferenceException("Kein Itemtyp gefunden.");
            if (itr.TypeName.Equals(itemType.TypeName, StringComparison.CurrentCulture) && itr.TypeBackColor.Equals(itemType.TypeBackColor, StringComparison.CurrentCulture))
                throw new ArgumentException("Keine Änderung durchgeführt.");
            itr.TypeName = itemType.TypeName;
            itr.TypeBackColor = itemType.TypeBackColor;
            ItemTypes.Update(itr);
        }

        #endregion

        #region Aggregate

        /// <summary>
        /// Liefert die Anzahl von Verbindungen zurück, die zu einer Verbindungsregel gehören
        /// </summary>
        /// <param name="ruleId">Guid der Regel</param>
        /// <returns></returns>
        public static int GetConnectionCountForConnectionRule(Guid ruleId)
        {
            return Connections.GetCountForRule(ruleId);
        }

        /// <summary>
        /// Liefert die Anzahl der Attribute eines bestimmten Typs zurück
        /// </summary>
        /// <param name="attributeType">GUID des Attributtyps</param>
        /// <returns></returns>
        public static int GetItemAttributesCountForAttributeType(Guid attributeType)
        {
            return ItemAttributes.GetCountForAttributeType(attributeType);
        }

        /// <summary>
        /// Gibt die Anzahl der verfügbaren Item-Typen zurück
        /// </summary>
        /// <returns></returns>
        public static int GetItemTypesCount()
        {
            return ItemTypes.GetCount();
        }

        #endregion
    }
}
