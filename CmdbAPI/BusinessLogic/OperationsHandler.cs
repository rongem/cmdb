using CmdbAPI.BusinessLogic.Helpers;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
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
            StringBuilder result = new StringBuilder();
            try
            {
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
                result.AppendLine(ex.Message);
                return new OperationResult() { Success = false, Message = result.ToString() };
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
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
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
                bool deleteResponsibility = false;
                if(!Security.SecurityHandler.UserIsResponsible(ci.ItemId, identity.Name))
                {
                    result.AppendLine("Übernahme der Verantwortung für das Configuration Item");
                    deleteResponsibility = true;
                    Security.SecurityHandler.TakeResponsibility(ci.ItemId, identity);
                }

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
                    bool delResp = false;
                    if (!Security.SecurityHandler.UserIsResponsible(ia.ItemId, identity.Name))
                    {
                        Security.SecurityHandler.TakeResponsibility(ia.ItemId, identity);
                    }
                    ConnectionRule cr = connectionRules.Single(r => r.ConnType.Equals(connType.ConnTypeId) && r.ItemLowerType.Equals(newTypeIsUpperRule ? connectedCI.ItemType : ci.ItemType) && r.ItemUpperType.Equals((newTypeIsUpperRule ? ci.ItemType : connectedCI.ItemType)));
                    Connection conn = DataHandler.GetConnectionByContent(upperItemId, connType.ConnTypeId, lowerItemId);
                    if (conn == null)
                    {
                        conn = new Connection()
                        {
                            ConnId = Guid.NewGuid(),
                            ConnType = connType.ConnTypeId,
                            ConnUpperItem = upperItemId,
                            ConnLowerItem = lowerItemId,
                            RuleId = cr.RuleId,
                            Description = string.Empty,
                        };
                        DataHandler.CreateConnection(conn, identity);
                        result.AppendLine(string.Format("Verbindung '{0} {1}/{2} {3}' hinzugefügt",
                            newTypeIsUpperRule ? ci.ItemName : connectedCI.ItemName,
                            connType.ConnTypeName, connType.ConnTypeReverseName,
                            newTypeIsUpperRule ? connectedCI.ItemName : ci.ItemName));
                    }
                    if (delResp)
                    {
                        Security.SecurityHandler.AbandonResponsibility(ia.ItemId, identity);
                    }
                }
                // Verantwortlichkeit wieder aufgeben, wenn sie nur zu diesem Zweck gesetzt wurde
                if (deleteResponsibility)
                {
                    Security.SecurityHandler.AbandonResponsibility(ci.ItemId, identity);
                }
            }
            // Alle  Attribute löschen
            DataHandler.DeleteAttributesByType(attributeType, identity);
            result.AppendLine("Attribute gelöscht.");
            // Attributtypen entfernen
            MetaDataHandler.DeleteAttributeType(attributeType, identity);
            result.AppendLine("Attribut-Typ gelöscht");
        }

        /// <summary>
        /// Erzeugt Zuordnungen von Attributgruppen zu Item-Typen für angegebene Attributtypen
        /// </summary>
        /// <param name="attributeTypesToTransfer">Attributtypen, der Gruppen hinzugefügt werden sollen</param>
        /// <param name="itemType">Der Item-Typ, dem die Gruppen hinzugefügt werden</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        private static int CreateItemTypeAttributeGroupMappings(IEnumerable<AttributeType> attributeTypesToTransfer, ItemType itemType, WindowsIdentity identity)
        {
            int ctr = 0;
            List<Guid> groupIds = new List<Guid>();
            foreach (AttributeType attributeType in attributeTypesToTransfer)
            {
                if (!groupIds.Contains(attributeType.AttributeGroup))
                    groupIds.Add(attributeType.AttributeGroup);
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
                        MaxConnectionsToUpper = 9999,
                        ValidationExpression = "^.*$",
                    };
                    MetaDataHandler.CreateConnectionRule(cr, identity);
                    result.AppendLine(string.Format("Verbindungsregel {0} {1} / {2} {3} angelegt.", upperType.TypeName,
                        connType.ConnTypeName, connType.ConnTypeReverseName, lowerType.TypeName));
                }
                connectionRules.Add(cr);
            }
            return connectionRules;
        }

        /// <summary>
        /// Holt oder erzeugt einen Item-Typ mit dem angegebenen Namen
        /// </summary>
        /// <param name="itemTypeName">Gesuchter oder anzulegender Namen</param>
        /// <param name="colorCode">Farbcode (nur für Neuanlage)</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
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
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
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

        /// <summary>
        /// Prüft, ob ein Attribut existiert, und legt es an falls nicht. Existiert es, wird geprüft, ob der Wert mit dem 
        /// angegebenen übereinstimmt. Falls nicht, wird das Attribut geändert.
        /// Enthält der Attributwert "<delete>", wird das Attribut gelöscht
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items, zu dem das Attribut gehört</param>
        /// <param name="attributeTypeId">Guid des Attribut-Typs</param>
        /// <param name="attributeValue">Zielwert des Attributs, <delete> zum Löschen</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        /// <returns></returns>
        public static ChangeResult EnsureAttribute(Guid itemId, Guid attributeTypeId, string attributeValue, WindowsIdentity identity)
        {
            ItemAttribute itemAttribute = DataHandler.GetAttributeForConfigurationItemByAttributeType(itemId, attributeTypeId);
            if (itemAttribute == null) // nicht gefunden, wird angelegt
            {
                itemAttribute = new ItemAttribute()
                {
                    AttributeId = Guid.NewGuid(),
                    AttributeTypeId = attributeTypeId,
                    ItemId = itemId,
                    AttributeValue = attributeValue,
                };
                if (!attributeValue.Equals("<delete>"))
                {
                    try
                    {
                        DataHandler.CreateAttribute(itemAttribute, identity);
                        return ChangeResult.Created;
                    }
                    catch
                    {
                        return ChangeResult.Failure;
                    }
                }
                else
                    return ChangeResult.Nothing;
            }
            if (attributeValue.Equals("<delete>"))
            {
                try
                {
                    DataHandler.DeleteAttribute(itemAttribute, identity);
                    return ChangeResult.Deleted;
                }
                catch
                {
                    return ChangeResult.Failure;
                }
            }
            if (itemAttribute.AttributeValue.Equals(attributeValue))
                return ChangeResult.Nothing;
            itemAttribute.AttributeValue = attributeValue;
            try
            {
                DataHandler.UpdateAttribute(itemAttribute, identity);
            }
            catch
            {
                return ChangeResult.Failure;
            }
            return ChangeResult.Changed;
        }

        /// <summary>
        /// Liefert ein Dictionary von Attributtypen zurück, mit der Guid als Schlüssel
        /// </summary>
        /// <returns></returns>
        public static Dictionary<Guid, AttributeType> GetAttributeTypesDictionary()
        {
            Dictionary<Guid, AttributeType> attributeTypes = new Dictionary<Guid, AttributeType>();
            foreach (AttributeType attributeType in MetaDataHandler.GetAttributeTypes())
            {
                attributeTypes.Add(attributeType.TypeId, attributeType);
            }
            return attributeTypes;
        }

        /// <summary>
        /// Liefert ein Dictionary von Verbindungsregeln zurück, mit der Guid als Schlüssel
        /// </summary>
        /// <returns></returns>
        public static Dictionary<Guid, ConnectionRule> GetConnectionRulesDictionary()
        {
            Dictionary<Guid, ConnectionRule> connectionRules = new Dictionary<Guid, ConnectionRule>();
            foreach (ConnectionRule connectionRule in MetaDataHandler.GetConnectionRules())
            {
                connectionRules.Add(connectionRule.RuleId, connectionRule);
            }
            return connectionRules;
        }

        /// <summary>
        /// Liefert ein Dictionary von Verbindungstypen zurück, mit der Guid als Schlüssel
        /// </summary>
        /// <returns></returns>
        public static Dictionary<Guid, ConnectionType> GetConnectionTypesDictionary()
        {
            Dictionary<Guid, ConnectionType> connectionTypes = new Dictionary<Guid, ConnectionType>();
            foreach (ConnectionType connectionType in MetaDataHandler.GetConnectionTypes())
            {
                connectionTypes.Add(connectionType.ConnTypeId, connectionType);
            }
            return connectionTypes;
        }

        /// <summary>
        /// Füllt eine DataTable aus Zeilen
        /// </summary>
        /// <param name="activeColumns">Liste der aktiven Spalten inklusive deren Namen</param>
        /// <param name="dt">Datentabelle, die gefüllt werden soll</param>
        /// <param name="nameColumnId">Nummer der Spalte mit dem Item-Namen</param>
        /// <param name="lines">Zeilen mit Daten</param>
        /// <param name="itemTypeId">ID des Item-Typen</param>
        /// <param name="ignoreExistingItems">Ignoriere Items, deren Name bereits existiert</param>
        /// <returns></returns>
        public static string FillDataTableWithLines(Dictionary<int, string> activeColumns, DataTable dt, int nameColumnId, List<string[]> lines, Guid itemTypeId, bool ignoreExistingItems)
        {
            StringBuilder sb = new StringBuilder();
            List<string> itemNames = new List<string>();

            for (int i = 0; i < lines.Count; i++)
            {
                string[] line = lines[i];
                DataRow dataRow = dt.NewRow();
                foreach (int j in activeColumns.Keys)
                {
                    if (j == nameColumnId)
                    {
                        if (string.IsNullOrWhiteSpace(line[j]))
                        {
                            dataRow = null;
                            sb.AppendFormat("Fehler in Zeile {0}: Der Name des Configuration Items ist leer", i + 1);
                            sb.AppendLine("<br />");
                            break;
                        }
                        if (itemNames.Contains(line[j].ToLower()))
                        {
                            dataRow = null;
                            sb.AppendFormat("Fehler in Zeile {0}: Das Configuration Item {1} taucht wiederholt auf und wird ignoriert.", i + 1, line[j]);
                            sb.AppendLine("<br />");
                            break;
                        }
                        itemNames.Add(line[j].ToLower());
                        if (ignoreExistingItems)
                        {
                            ConfigurationItem ci = DataHandler.GetConfigurationItemByTypeIdAndName(itemTypeId, line[j]);
                            if (ci != null)
                            {
                                dataRow = null;
                                sb.AppendFormat("Zeile {0}: Das Configuration Item {1} existiert bereits und wird ignoriert.", i + 1, ci.ItemName);
                                sb.AppendLine("<br />");
                                break;
                            }
                        }
                    }
                    dataRow.SetField(activeColumns[j], line[j]);
                }
                if (dataRow != null)
                    dt.Rows.Add(dataRow);
            }
            return sb.ToString();
        }

        /// <summary>
        /// Importiert eine DataTable in die CMDB
        /// </summary>
        /// <param name="dt">DataTable zum Importieren</param>
        /// <param name="itemTypeId">ItemType, der erzeugt werden soll</param>
        /// <param name="ignoreExistingItems">Gibt an, ob existierende Items übersprungen werden sollen</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        /// <returns></returns>
        public static string ImportData(DataTable dt, Guid itemTypeId, bool ignoreExistingItems, WindowsIdentity identity)
        {
            StringBuilder sb = new StringBuilder();
            int nameColumnId = dt.Columns.IndexOf("Name des CI");
            int linkdescriptionId = dt.Columns.IndexOf("linkdescription");
            foreach (DataRow dataRow in dt.Rows)
            {
                ConfigurationItem configurationItem = null;
                if (!ignoreExistingItems)
                {
                    configurationItem = DataHandler.GetConfigurationItemByTypeIdAndName(itemTypeId, dataRow[nameColumnId].ToString());
                }
                if (configurationItem == null)
                {
                    configurationItem = new ConfigurationItem() { ItemId = Guid.NewGuid(), ItemType = itemTypeId, ItemName = dataRow[nameColumnId].ToString() };
                    try
                    {
                        DataHandler.CreateConfigurationItem(configurationItem, identity);
                        configurationItem = DataHandler.GetConfigurationItem(configurationItem.ItemId);
                        sb.AppendFormat("CI {0} angelegt.", configurationItem.ItemName);
                        sb.AppendLine("<br />");
                    }
                    catch (Exception ex)
                    {
                        sb.AppendFormat("Fehler beim Anlegen des CI {0}: {1}", configurationItem.ItemName, ex.Message);
                        sb.AppendLine("<br />");
                        continue;
                    }
                }
                else // existiert
                {
                    sb.AppendFormat("CI {0} gefunden.", configurationItem.ItemName);
                    sb.AppendLine("<br />");
                }
                Dictionary<Guid, AttributeType> attributeTypes = GetAttributeTypesDictionary();
                Dictionary<Guid, ConnectionType> connectionTypes = GetConnectionTypesDictionary();
                Dictionary<Guid, ConnectionRule> connectionRules = GetConnectionRulesDictionary();

                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    if (i == nameColumnId)
                        continue;
                    string[] caption = dt.Columns[i].Caption.Split(':');
                    string value = dataRow[dt.Columns[i]].ToString().Trim();
                    string[] part;
                    ConnectionRule cr;
                    ConnectionType connType;
                    if (string.IsNullOrEmpty(value))
                        continue;
                    try
                    {
                        switch (caption[0])
                        {
                            case "a": // Attribut
                                AttributeType attributeType = attributeTypes[Guid.Parse(caption[1])];
                                ChangeOrCreateAttribute(configurationItem, attributeType, value, sb, identity);
                                break;
                            case "crtl": // Connection To Lower
                                part = GetConnectionDetails(value);
                                cr = connectionRules[Guid.Parse(caption[1])];
                                connType = connectionTypes[cr.ConnType];
                                ConfigurationItem lowerItem = DataHandler.GetConfigurationItemByTypeIdAndName(cr.ItemLowerType, part[0]);
                                if (lowerItem == null)
                                {
                                    sb.AppendFormat("Fehler: Configuration Item '{0}' existiert nicht. Konnte keine Verbindung erstellen.", part[0]);
                                    sb.AppendLine("<br />");
                                }
                                else
                                    ChangeOrCreateConnection(configurationItem, connType, lowerItem, cr, part[1], sb, identity);
                                break;
                            case "crtu": // Connection To Upper
                                part = GetConnectionDetails(value);
                                cr = connectionRules[Guid.Parse(caption[1])];
                                connType = connectionTypes[cr.ConnType];
                                ConfigurationItem upperItem = DataHandler.GetConfigurationItemByTypeIdAndName(cr.ItemLowerType, part[0]);
                                if (upperItem == null)
                                {
                                    sb.AppendFormat("Fehler: Configuration Item '{0}' existiert nicht. Konnte keine Verbindung erstellen.", part[0]);
                                    sb.AppendLine("<br />");
                                }
                                else
                                    ChangeOrCreateConnection(upperItem, connType, configurationItem, cr, part[1], sb, identity);
                                break;
                            case "linkaddress": // Hyperlink, Adresse; Beschreibung suchen
                                string linkDescription = linkdescriptionId == -1 ? value : dataRow[dt.Columns[linkdescriptionId]].ToString();
                                CreateHyperLink(configurationItem, value, linkDescription, sb, identity);
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        sb.AppendFormat("Es ist ein Fehler aufgetreten: {0}", ex.Message);
                        sb.AppendLine("<br />");
                    }
                }
            }

            return sb.ToString();
        }

        /// <summary>
        /// Importiert eine DataTable in die CMDB
        /// </summary>
        /// <param name="dt">DataTable zum Importieren</param>
        /// <param name="itemTypeId">ItemType, der erzeugt werden soll</param>
        /// <param name="ignoreExistingItems">Gibt an, ob existierende Items übersprungen werden sollen</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        /// <returns></returns>
        public static LineMessage[] ImportData(TransferTable dt, Guid itemTypeId, WindowsIdentity identity)
        {
            List<LineMessage> messages = new List<LineMessage>();
            int nameColumnId = Array.IndexOf(dt.columns, dt.columns.Single(c => c.name.ToLower().Equals("name")));
            int linkdescriptionId = Array.IndexOf(dt.columns, dt.columns.SingleOrDefault(c => c.name.ToLower().Equals("linkdescription")));
            for (int i = 0; i < dt.rows.Count(); i++)
            {
                string[] dataRow = dt.rows[i];
                ConfigurationItem configurationItem = null;
                configurationItem = DataHandler.GetConfigurationItemByTypeIdAndName(itemTypeId, dataRow[nameColumnId].ToString());

                if (configurationItem == null)
                {
                    configurationItem = new ConfigurationItem() { ItemId = Guid.NewGuid(), ItemType = itemTypeId, ItemName = dataRow[nameColumnId].ToString() };
                    try
                    {
                        DataHandler.CreateConfigurationItem(configurationItem, identity);
                        configurationItem = DataHandler.GetConfigurationItem(configurationItem.ItemId);
                        messages.Add(new LineMessage()
                        {
                            index = i,
                            message = "item created",
                            subject = configurationItem.ItemName,
                            severity = LineMessage.Severity.info
                        });
                    }
                    catch (Exception ex)
                    {
                        messages.Add(new LineMessage()
                        {
                            index = i,
                            message = "error creating item",
                            subject = configurationItem.ItemName,
                            severity = LineMessage.Severity.error,
                            details = ex.Message,
                        });
                        continue;
                    }
                }
                else // existiert
                {
                    messages.Add(new LineMessage()
                    {
                        index = i,
                        message = "changing existing item",
                        subject = configurationItem.ItemName,
                        severity = LineMessage.Severity.info
                    });
                }
                Dictionary<Guid, AttributeType> attributeTypes = GetAttributeTypesDictionary();
                Dictionary<Guid, ConnectionType> connectionTypes = GetConnectionTypesDictionary();
                Dictionary<Guid, ConnectionRule> connectionRules = GetConnectionRulesDictionary();

                for (int j = 0; j < dt.columns.Count(); j++)
                {
                    if (j == nameColumnId)
                        continue;
                    string[] target = dt.columns[j].name.Split(':');
                    string value = dataRow[j].Trim();
                    string[] part;
                    ConnectionRule cr;
                    ConnectionType connType;
                    if (string.IsNullOrEmpty(value))
                        continue;
                    try
                    {
                        switch (target[0])
                        {
                            case "a": // Attribut
                                AttributeType attributeType = attributeTypes[Guid.Parse(target[1])];
                                messages.Add(ChangeOrCreateAttribute(configurationItem, attributeType, value, i, identity));
                                break;
                            case "crtl": // Connection To Lower
                            case "ctl":
                                part = GetConnectionDetails(value);
                                cr = connectionRules[Guid.Parse(target[1])];
                                connType = connectionTypes[cr.ConnType];
                                ConfigurationItem lowerItem = DataHandler.GetConfigurationItemByTypeIdAndName(cr.ItemLowerType, part[0]);
                                if (lowerItem == null)
                                {
                                    messages.Add(new LineMessage()
                                    {
                                        index = i,
                                        message = "lower item does not exist",
                                        subject = configurationItem.ItemName,
                                        details = part[0],
                                        severity = LineMessage.Severity.error,
                                    });
                                }
                                else
                                    messages.Add(ChangeOrCreateConnection(configurationItem, connType, lowerItem, cr, part[1], i, identity));
                                break;
                            case "crtu": // Connection To Upper
                            case "ctu":
                                part = GetConnectionDetails(value);
                                cr = connectionRules[Guid.Parse(target[1])];
                                connType = connectionTypes[cr.ConnType];
                                ConfigurationItem upperItem = DataHandler.GetConfigurationItemByTypeIdAndName(cr.ItemLowerType, part[0]);
                                if (upperItem == null)
                                {
                                    messages.Add(new LineMessage()
                                    {
                                        index = i,
                                        message = "upper item does not exist",
                                        subject = configurationItem.ItemName,
                                        details = part[0],
                                        severity = LineMessage.Severity.error,
                                    });
                                }
                                else
                                    messages.Add(ChangeOrCreateConnection(upperItem, connType, configurationItem, cr, part[1], i, identity));
                                break;
                            case "linkaddress": // Hyperlink, Adresse; Beschreibung suchen
                                string linkDescription = linkdescriptionId == -1 ? value : dataRow[linkdescriptionId];
                                messages.Add(CreateHyperLink(configurationItem, value, linkDescription, i, identity));
                                break;
                            default:
                                messages.Add(new LineMessage() { index = i, message = "unkown row type", details = target[0], severity = LineMessage.Severity.error, subject = configurationItem.ItemName });
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        messages.Add(new LineMessage()
                        {
                            index = i,
                            message = "error",
                            severity = LineMessage.Severity.error,
                            subject = configurationItem.ItemName,
                            details = ex.Message,
                        });
                    }
                }
            }

            return messages.ToArray();
        }

        /// <summary>
        /// Trennt den Namen des Items am Pipe-Symbol von der Beschreibung der Verbindung
        /// </summary>
        /// <param name="value">Kombinierter String</param>
        /// <returns></returns>
        public static string[] GetConnectionDetails(string value)
        {
            string[] part;
            if (value.Contains('|'))
            {
                part = value.Split(new char[] { '|' }, 2);
            }
            else
            {
                part = new string[] { value, string.Empty };
            }

            return part;
        }

        /// <summary>
        /// Erzeugt einen Hyplerlink zu einem Configuration Item
        /// </summary>
        /// <param name="configurationItem">Item</param>
        /// <param name="value">Link</param>
        /// <param name="linkDescription">Beschreibung</param>
        /// <param name="sb">String-Logger</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        public static void CreateHyperLink(ConfigurationItem configurationItem, string value, string linkDescription, StringBuilder sb, WindowsIdentity identity)
        {
            Uri uri;
            if (!Uri.TryCreate(value, UriKind.Absolute, out uri))
            {
                sb.AppendFormat("Fehlerhafter Hyperlink: {0}", value);
                sb.AppendLine("<br />");
                return;
            }
            ItemLink link = new ItemLink()
            {
                ItemId = configurationItem.ItemId,
                LinkId = Guid.NewGuid(),
                LinkURI = value,
                LinkDescription = linkDescription,
            };
            try
            {
                DataHandler.CreateLink(link, identity);
                sb.AppendFormat(" Hyperlink angelegt: {0}", value);
                sb.AppendLine("<br />");
            }
            catch (Exception ex)
            {
                sb.AppendFormat("Fehler beim Anlegen des Hyperlinks auf {0}: {1}", value, ex.Message);
                sb.AppendLine("<br />");
            }
        }

        /// <summary>
        /// Erzeugt einen Hyplerlink zu einem Configuration Item
        /// </summary>
        /// <param name="configurationItem">Item</param>
        /// <param name="value">Link</param>
        /// <param name="linkDescription">Beschreibung</param>
        /// <param name="line">Betroffene Zeile</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        public static LineMessage CreateHyperLink(ConfigurationItem configurationItem, string value, string linkDescription, int line, WindowsIdentity identity)
        {
            Uri uri;
            if (!Uri.TryCreate(value, UriKind.Absolute, out uri))
            {
                return new LineMessage()
                {
                    index = line,
                    subject = configurationItem.ItemName,
                    message = "no valid url",
                    details = value,
                    severity = LineMessage.Severity.error,
                };
            }
            ItemLink link = new ItemLink()
            {
                ItemId = configurationItem.ItemId,
                LinkId = Guid.NewGuid(),
                LinkURI = value,
                LinkDescription = linkDescription,
            };
            try
            {
                DataHandler.CreateLink(link, identity);
                return new LineMessage()
                {
                    index = line,
                    subject = configurationItem.ItemName,
                    message = "hyperlink created",
                    details = value,
                    severity = LineMessage.Severity.info,
                };
            }
            catch (Exception ex)
            {
                return new LineMessage()
                {
                    index = line,
                    subject = configurationItem.ItemName,
                    message = "error creating hyperlink",
                    details = ex.Message,
                    severity = LineMessage.Severity.error,
                };
            }
        }

        /// <summary>
        /// Erzeugt eine Verbindung oder ändert eine vorhandene
        /// </summary>
        /// <param name="upperCI">Oberes Item</param>
        /// <param name="connType">Verbindungstyp</param>
        /// <param name="lowerCI">Unteres Item</param>
        /// <param name="cr">Verbindungsregel</param>
        /// <param name="content">Beschreibung der Verbindung</param>
        /// <param name="sb">String-Logger</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        public static void ChangeOrCreateConnection(ConfigurationItem upperCI, ConnectionType connType, ConfigurationItem lowerCI, ConnectionRule cr, string content, StringBuilder sb, WindowsIdentity identity)
        {
            Connection conn = DataHandler.GetConnectionByContent(upperCI.ItemId, cr.ConnType, lowerCI.ItemId);
            if (conn == null)
            {
                conn = new Connection()
                {
                    ConnId = Guid.NewGuid(),
                    ConnUpperItem = upperCI.ItemId,
                    ConnLowerItem = lowerCI.ItemId,
                    ConnType = cr.ConnType,
                    RuleId = cr.RuleId,
                    Description = content,
                };
                try
                {
                    DataHandler.CreateConnection(conn, identity);
                    sb.AppendFormat("Verbindung '{0} {1} {2} ({3})' neu erstellt.",
                        upperCI.ItemName, connType.ConnTypeName, lowerCI.ItemName, content);
                    sb.AppendLine("<br />");
                }
                catch (Exception ex)
                {
                    sb.AppendFormat("Fehler: Verbindung '{0} {1} {2} ({3})' konnte nicht erstellt werden. Grund: {4}",
                        upperCI.ItemName, connType.ConnTypeName, lowerCI, content, ex.Message);
                    sb.AppendLine("<br />");
                }
            }
            else
            {
                if (conn.Description.Equals(content))
                {
                    sb.AppendFormat("Verbindung '{0} {1} {2} ({3})' existiert bereits. Keine Aktion erforderlich.",
                        upperCI.ItemName, connType.ConnTypeName, lowerCI.ItemName, content);
                    sb.AppendLine("<br />");
                }
                else
                {
                    string oldcontent = conn.Description;
                    try
                    {
                        DataHandler.DeleteConnection(conn, identity);
                        conn.Description = content;
                        DataHandler.CreateConnection(conn, identity);
                        sb.AppendFormat("Für Verbindung '{0} {1} {2} ({3})' wurde die Beschreibung auf '{4}' geändert.",
                            upperCI.ItemName, connType.ConnTypeName, lowerCI, oldcontent, content);
                        sb.AppendLine("<br />");
                    }
                    catch (Exception ex)
                    {
                        sb.AppendFormat("Fehler: Verbindung '{0} {1} {2} ({3})' konnte nicht geändert werden. Grund: {4}",
                            upperCI.ItemName, connType.ConnTypeName, lowerCI, oldcontent, ex.Message);
                        sb.AppendLine("<br />");
                    }
                }
            }
        }

        /// <summary>
        /// Erzeugt eine Verbindung oder ändert eine vorhandene
        /// </summary>
        /// <param name="upperCI">Oberes Item</param>
        /// <param name="connType">Verbindungstyp</param>
        /// <param name="lowerCI">Unteres Item</param>
        /// <param name="cr">Verbindungsregel</param>
        /// <param name="content">Beschreibung der Verbindung</param>
        /// <param name="line">Betroffene Zeile</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        public static LineMessage ChangeOrCreateConnection(ConfigurationItem upperCI, ConnectionType connType, ConfigurationItem lowerCI, ConnectionRule cr, string content, int line, WindowsIdentity identity)
        {
            Connection conn = DataHandler.GetConnectionByContent(upperCI.ItemId, cr.ConnType, lowerCI.ItemId);
            if (conn == null)
            {
                conn = new Connection()
                {
                    ConnId = Guid.NewGuid(),
                    ConnUpperItem = upperCI.ItemId,
                    ConnLowerItem = lowerCI.ItemId,
                    ConnType = cr.ConnType,
                    RuleId = cr.RuleId,
                    Description = content,
                };
                try
                {
                    DataHandler.CreateConnection(conn, identity);
                    return new LineMessage()
                    {
                        index = line,
                        severity = LineMessage.Severity.info,
                        message = "connection created",
                        subject = string.Format("'{0} {1} {2} ({3})'", upperCI.ItemName, connType.ConnTypeName, lowerCI.ItemName, content),
                    };
                }
                catch (Exception ex)
                {
                    return new LineMessage()
                    {
                        index = line,
                        severity = LineMessage.Severity.error,
                        message = "error creating connection",
                        subject = string.Format("'{0} {1} {2} ({3})'", upperCI.ItemName, connType.ConnTypeName, lowerCI.ItemName, content),
                        details = ex.Message,
                    };
                }
            }
            else
            {
                if (conn.Description.Equals(content))
                {
                    return new LineMessage()
                    {
                        index = line,
                        severity = LineMessage.Severity.info,
                        message = "skipping existing connection",
                        subject = string.Format("'{0} {1} {2} ({3})'", upperCI.ItemName, connType.ConnTypeName, lowerCI.ItemName, content),
                    };
                }
                else
                {
                    string oldcontent = conn.Description;
                    try
                    {
                        DataHandler.DeleteConnection(conn, identity);
                        conn.Description = content;
                        DataHandler.CreateConnection(conn, identity);
                        return new LineMessage()
                        {
                            index = line,
                            severity = LineMessage.Severity.info,
                            message = "changed connection description",
                            subject = string.Format("'{0} {1} {2} ({3})'", upperCI.ItemName, connType.ConnTypeName, lowerCI.ItemName, content),
                            details = oldcontent,
                        };
                    }
                    catch (Exception ex)
                    {
                        return new LineMessage()
                        {
                            index = line,
                            severity = LineMessage.Severity.error,
                            message = "error changing connection",
                            subject = string.Format("'{0} {1} {2} ({3})'", upperCI.ItemName, connType.ConnTypeName, lowerCI.ItemName, oldcontent),
                            details = ex.Message,
                        };
                    }
                }
            }
        }

        /// <summary>
        /// Stellt sicher, dass ein Attribut den vorgegebenn Wert erhält
        /// </summary>
        /// <param name="configurationItem">Item, zu dem das Attribut gehört</param>
        /// <param name="attributeType">Attribut-Typ</param>
        /// <param name="value">Attribut-Wert</param>
        /// <param name="sb">String-Logger</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        public static void ChangeOrCreateAttribute(ConfigurationItem configurationItem, AttributeType attributeType, string value, StringBuilder sb, WindowsIdentity identity)
        {
            switch (EnsureAttribute(configurationItem.ItemId, attributeType.TypeId, value, identity))
            {
                case ChangeResult.Changed:
                    sb.AppendFormat("Attribut vom Typ '{0}' auf den Wert '{1}' gesetzt.", attributeType.TypeName, value);
                    sb.AppendLine("<br />");
                    break;
                case ChangeResult.Created:
                    sb.AppendFormat("Attribut vom Typ '{0}' mit Wert '{1}' erzeugt.", attributeType.TypeName, value);
                    sb.AppendLine("<br />");
                    break;
                case ChangeResult.Deleted:
                    sb.AppendFormat("Attribut vom Typ '{0}' gelöscht.", attributeType.TypeName);
                    sb.AppendLine("<br />");
                    break;
                case ChangeResult.Failure:
                    sb.AppendFormat("Fehler beim Attribut vom Typ '{0}', Wert '{1}'", attributeType.TypeName, value);
                    sb.AppendLine("<br />");
                    break;
            }
        }
        /// <summary>
        /// Stellt sicher, dass ein Attribut den vorgegebenn Wert erhält
        /// </summary>
        /// <param name="configurationItem">Item, zu dem das Attribut gehört</param>
        /// <param name="attributeType">Attribut-Typ</param>
        /// <param name="value">Attribut-Wert</param>
        /// <param name="line">betroffene Zeile</param>
        /// <param name="identity">Die Windows-Identität, mit der die Aktion durchgeführt wird</param>
        public static LineMessage ChangeOrCreateAttribute(ConfigurationItem configurationItem, AttributeType attributeType, string value, int line, WindowsIdentity identity)
        {
            switch (EnsureAttribute(configurationItem.ItemId, attributeType.TypeId, value, identity))
            {
                case ChangeResult.Changed:
                    return new LineMessage()
                    {
                        index = line,
                        severity = LineMessage.Severity.info,
                        message = "attribute changed",
                        subject = configurationItem.ItemName,
                        details = string.Format("'{0}': '{1}'", attributeType.TypeName, value)
                    };
                case ChangeResult.Created:
                    return new LineMessage()
                    {
                        index = line,
                        severity = LineMessage.Severity.info,
                        message = "attribute created",
                        subject = configurationItem.ItemName,
                        details = string.Format("'{0}': '{1}'", attributeType.TypeName, value)
                    };
                case ChangeResult.Deleted:
                    return new LineMessage()
                    {
                        index = line,
                        severity = LineMessage.Severity.info,
                        message = "attribute deleted",
                        subject = configurationItem.ItemName,
                        details = string.Format("'{0}''", attributeType.TypeName)
                    };
                case ChangeResult.Failure:
                    return new LineMessage()
                    {
                        index = line,
                        severity = LineMessage.Severity.error,
                        message = "error changing attribute",
                        subject = configurationItem.ItemName,
                        details = string.Format("'{0}': '{1}'", attributeType.TypeName, value)
                    };
                default:
                    return new LineMessage()
                    {
                        index = line,
                        severity = LineMessage.Severity.info,
                        message = "no need to change attribute",
                        subject = configurationItem.ItemName,
                        details = string.Format("'{0}': '{1}'", attributeType.TypeName, value)
                    };
            }
        }

        /// <summary>
        /// Gibt alle Verbindungen zwischen Items für ein angegebenes Configuration Item als Datei zurück
        /// </summary>
        /// <param name="item">Configuration Item, dessen Verbindungen zurückgegeben werden sollen</param>
        /// <param name="format">Dateiformat</param>
        public static MemoryStream GetConnectionsAsFile(ConfigurationItem item, FileFormats format)
        {
            System.Data.DataTable t = new System.Data.DataTable("ConfigurationItems");
            t.Columns.Add("Item-Typ (oben)");
            t.Columns.Add("Item-Name (oben)");
            t.Columns.Add("Verbindungstyp");
            t.Columns.Add("Item-Typ (unten)");
            t.Columns.Add("Item-Name (unten)");
            t.Columns.Add("Beschreibung");

            foreach (Connection cr in DataHandler.GetConnectionsToLowerForItem(item.ItemId))
            {
                ConfigurationItem lowerItem = DataHandler.GetConfigurationItem(cr.ConnLowerItem);
                ConnectionType connType = MetaDataHandler.GetConnectionType(cr.ConnType);
                t.Rows.Add(item.TypeName, item.ItemName, connType.ConnTypeName, lowerItem.TypeName, lowerItem.ItemName, cr.Description);
            }
            foreach (Connection cr in DataHandler.GetConnectionsToUpperForItem(item.ItemId))
            {
                ConfigurationItem upperItem = DataHandler.GetConfigurationItem(cr.ConnUpperItem);
                ConnectionType connType = MetaDataHandler.GetConnectionType(cr.ConnType);
                t.Rows.Add(upperItem.TypeName, upperItem.ItemName, connType.ConnTypeName, item.TypeName, item.ItemName, cr.Description);
            }

            switch (format)
            {
                case FileFormats.Excel:
                    return WriteExcelXml(t);
                case FileFormats.Csv:
                    return WriteCsv(t);
                default:
                    throw new NotImplementedException();
            }
        }

        /// <summary>
        /// Gibt alle Hyperlinks für ein angegebenes Configuration Item als Datei zurück
        /// </summary>
        /// <param name="item">Configuration Item, dessen Links zurückgegeben werden sollen</param>
        /// <param name="format">Dateiformat</param>
        public static MemoryStream GetLinksAsFile(ConfigurationItem item, FileFormats format)
        {
            System.Data.DataTable t = new System.Data.DataTable("ConfigurationItems");

            t.Columns.Add("Item-Typ");
            t.Columns.Add("Item-Name");
            t.Columns.Add("Link-Adresse");
            t.Columns.Add("Link-Beschreibung");
            foreach (ItemLink link in DataHandler.GetLinksForConfigurationItem(item.ItemId))
            {
                t.Rows.Add(item.TypeName, item.ItemType, link.LinkURI, link.LinkDescription);
            }

            switch (format)
            {
                case FileFormats.Excel:
                    return WriteExcelXml(t);
                case FileFormats.Csv:
                    return WriteCsv(t);
                default:
                    throw new NotImplementedException();
            }
        }

        /// <summary>
        /// Schreibt eine CSV-Datei und gibt diese als Stream zurück
        /// </summary>
        /// <param name="t">Tabelle, die verwendet werden soll</param>
        /// <returns></returns>
        private static MemoryStream WriteCsv(System.Data.DataTable t)
        {
            const string separator = ";";
            StringBuilder sb = new StringBuilder();
            // Überschriften
            List<string> line = new List<string>(t.Columns.Count);
            foreach (System.Data.DataColumn col in t.Columns)
            {
                line.Add(col.Caption);
            }
            sb.AppendLine(string.Join(separator, line.ToArray()));

            // Zeilen hinzufügen
            for (int i = 0; i < t.Rows.Count; i++)
            {
                line = new List<string>(t.Columns.Count);
                for (int j = 0; j < t.Columns.Count; j++)
                {
                    line.Add(t.Rows[i][j].ToString());
                }
                sb.AppendLine(string.Join(separator, line.ToArray()));
            }
            // Ausgabe abschliessen
            return new MemoryStream(Encoding.UTF8.GetBytes(sb.ToString()));
        }

        /// <summary>
        /// Schreibt eine Excel-Arbeitsmappe und gibt diese als Stream zurück
        /// </summary>
        /// <param name="t">Tabelle, die zum Schreiben verwendet werden soll</param>
        /// <returns></returns>
        private static MemoryStream WriteExcelXml(System.Data.DataTable t)
        {
            using (MemoryStream memStream = new MemoryStream())
            {
                ExcelHelper.CreateExcelDocumentFromDataTable(memStream, new List<System.Data.DataTable>() { t });
                return memStream;
            }
        }

        /// <summary>
        /// Erzeugt ein neues Configuration Item mit Attributen aus einem vollen ConfigurationItem
        /// </summary>
        /// <param name="item">Volles Configuration Item</param>
        /// <param name="identity">Identität, mit der die Operation durchgeführt wird</param>
        /// <returns></returns>
        public static OperationResult CreateItem(Item item, WindowsIdentity identity)
        {
            StringBuilder sb = new StringBuilder();
            bool itemCreated = false;
            try
            {
                DataHandler.CreateConfigurationItem(new ConfigurationItem()
                {
                    ItemId = item.id,
                    ItemName = item.name,
                    ItemType = item.typeId,
                }, identity);
                itemCreated = true;
                if (item.attributes != null)
                {
                    foreach (Item.Attribute attribute in item.attributes)
                    {
                        try
                        {
                            DataHandler.CreateAttribute(new ItemAttribute()
                            {
                                AttributeId = attribute.id,
                                AttributeTypeId = attribute.typeId,
                                AttributeValue = attribute.value,
                                ItemId = item.id,
                            }, identity);
                        }
                        catch (Exception ex)
                        {
                            sb.AppendLine(ex.Message);
                            continue;
                        }
                    }
                }
                if (item.connectionsToLower != null)
                {
                    foreach (Item.Connection connection in item.connectionsToLower)
                    {
                        try
                        {
                            DataHandler.CreateConnection(new Connection()
                            {
                                ConnId = connection.id,
                                ConnUpperItem = item.id,
                                ConnLowerItem = connection.targetId,
                                ConnType = connection.typeId,
                                RuleId = connection.ruleId,
                                Description = connection.description,
                            }, identity);
                        }
                        catch (Exception ex)
                        {
                            sb.AppendLine(ex.Message);
                            continue;
                        }
                    }
                }
                if (item.connectionsToUpper != null)
                {
                    foreach (Item.Connection connection in item.connectionsToUpper)
                    {
                        try
                        {
                            DataHandler.CreateConnection(new Connection()
                            {
                                ConnId = connection.id,
                                ConnUpperItem = connection.targetId,
                                ConnLowerItem = item.id,
                                ConnType = connection.typeId,
                                RuleId = connection.ruleId,
                                Description = connection.description,
                            }, identity);
                        }
                        catch (Exception ex)
                        {
                            sb.AppendLine(ex.Message);
                            continue;
                        }
                    }
                }
                if (item.links != null)
                {
                    foreach (Item.Link link in item.links)
                    {
                        try
                        {
                            DataHandler.CreateLink(new ItemLink()
                            {
                                LinkId = link.id,
                                ItemId = item.id,
                                LinkDescription = link.description,
                                LinkURI = link.uri,
                            }, identity);
                        }
                        catch (Exception ex)
                        {
                            sb.AppendLine(ex.Message);
                            continue;
                        }
                    }
                }
                return new OperationResult() { Success = sb.Length == 0, Message = sb.ToString() };
            }
            catch (Exception ex)
            {
                if (itemCreated) // if item was created partially and something goes wrong, delete the item before leaving
                {
                    try
                    {
                        ConfigurationItem configurationItem = DataHandler.GetConfigurationItem(item.id);
                        DataHandler.DeleteConfigurationItem(configurationItem, identity);
                    }
                    catch { }
                }
                return new OperationResult() { Success = false, Message = ex.Message };
            }
        }

    }
}
