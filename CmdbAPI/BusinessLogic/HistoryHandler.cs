using CmdbAPI.DataAccess;
using CmdbAPI.DataObjects;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.BusinessLogic
{
    /// <summary>
    /// Enthält alle Methoden zur Rückgabe von aufgezeichneten Aktionen an Items
    /// </summary>
    public static class HistoryHandler
    {
        /// <summary>
        /// Bildet den Text für die Veränderung
        /// </summary>
        /// <param name="subject">Was wurde geändert</param>
        /// <param name="oldtext">Alter Wert</param>
        /// <param name="newtext">Neuer Wert</param>
        /// <returns></returns>
        public static string GetText(string subject, string oldtext, string newtext)
        {
            if (oldtext.Equals("<created>"))
            {
                return string.Format("{0} {1} mit Wert '{2}'", subject, GetReason(oldtext), newtext);
            }
            else if (newtext.Equals("<deleted>"))
            {
                return string.Format("{0} {1} mit Wert '{2}'", subject, GetReason(newtext), oldtext);
            }
            else
            {
                return string.Format("{0} geändert von '{1}' nach '{2}'", subject, oldtext, newtext);
            }
        }

        /// <summary>
        /// Übersetzt die Tags created und deleted
        /// </summary>
        /// <param name="reason">Tag, das übersetzt werden soll</param>
        /// <returns></returns>
        public static string GetReason(string reason)
        {
            switch (reason)
            {
                case "<created>":
                    return "erstellt";
                case "<deleted>":
                    return "gelöscht";
                default:
                    return string.Empty;
            }
        }

        /// <summary>
        /// Gibt die Änderungen zu einem Item zurück, dessen Id bekannt ist
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static IEnumerable<HistoryEntry> GetItemChangeEntries(Guid itemId)
        {
            foreach (CMDBDataSet.ConfigurationItemsHistoryRow row in History.GetConfigurationItemsHistory(itemId))
            {
                yield return new HistoryEntry()
                {
                    DateTime = row.ItemChange.ToString(Constants.JSONFormatString),
                    Scope = "I",
                    Subject = string.Format("{0}: {1}", row.ItemTypeName, row.ItemNewName),
                    Text = GetText("Objekt", row.ItemOldName, row.ItemNewName),
                    Responsible = Security.ADSHelper.GetUserProperties(row.ChangedByToken).displayname,
                };
            }
        }

        /// <summary>
        /// Gibt die Änderungen aller Attribute zu einem Item zurück, dessen Id bekannt ist
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static IEnumerable<HistoryEntry> GetAttributeChangeEntries(Guid itemId)
        {
            foreach (CMDBDataSet.ItemAttributesHistoryRow row in History.GetItemAttributesHistory(itemId))
            {
                yield return new HistoryEntry()
                {
                    DateTime = row.AttributeChange.ToString(Constants.JSONFormatString),
                    Scope = "A",
                    Subject = string.Format("Attribut {0}", row.AttributeTypeName),
                    Text = GetText("Attributwert", row.AttributeOldValue, row.AttributeNewValue),
                    Responsible = Security.ADSHelper.GetUserProperties(row.ChangedByToken).displayname,
                };
            }
        }

        /// <summary>
        /// Gibt die Änderungen aller Verbindungen zu einem Item zurück, dessen Id bekannt ist
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static IEnumerable<HistoryEntry> GetConnectionChangeEntries(Guid itemId)
        {
            foreach (CMDBDataSet.ConnectionsHistoryRow row in History.GetConnectionsHistory(itemId))
            {
                
                yield return new HistoryEntry()
                {
                    DateTime = row.ConnChange.ToString(Constants.JSONFormatString),
                    Scope = "C",
                    Subject = string.Format("Verbindung {0} ({1}) zu {2}: {3}", row.ConnTypeName, row.ConnDescription,
                        row.TargetTypeName, row.TargetItemIsActive == 0 ? string.Format("{0} (deleted)", row.TargetItemName) : row.TargetItemName),
                    Text = GetReason(row.ConnReason),
                    Responsible = Security.ADSHelper.GetUserProperties(row.ChangedByToken).displayname,
                };
            }
        }

        /// <summary>
        /// Gibt alle Änderungen zurück, die zu einem Configuration Item und allen davon abhängigen Werten gehörden
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static IEnumerable<HistoryEntry> GetAllHistoryEntriesForItem(Guid itemId)
        {
            List<HistoryEntry> entries = new List<HistoryEntry>(GetItemChangeEntries(itemId));
            entries.AddRange(GetAttributeChangeEntries(itemId));
            entries.AddRange(GetConnectionChangeEntries(itemId));
            return entries.OrderBy(e => e.DateTime);
        }

        /// <summary>
        /// Wandelt einen History-Datensatz für ein Configuration Item in ein Objekt um
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static HistoricConfigurationItem GetHistoricConfigurationItem(Guid itemId)
        {
            ConfigurationItem ci = DataHandler.GetConfigurationItem(itemId);
            HistoricConfigurationItem item = new HistoricConfigurationItem()
            {
                Id = itemId,
                activeItem = ci,
                activeItemPresent = ci != null,
                CurrentTypeName = (ci != null) ? ci.TypeName : string.Empty,
                ItemChanges = GetHistoricItems(itemId).ToArray(),
                Attributes = GetHistoricAttributes(itemId).ToArray(),
                Connections = GetHistoricConnections(itemId).ToArray(),
            };
            return item;
        }

        /// <summary>
        /// Erzeugt aus den Änderungsdatensätzen für Configuration Items Objekte
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        private static IEnumerable<HistoricConfigurationItem.HistoricItem> GetHistoricItems(Guid itemId)
        {
            foreach (CMDBDataSet.ConfigurationItemsHistoryRow row in History.GetConfigurationItemsHistory(itemId))
            {
                yield return new HistoricConfigurationItem.HistoricItem()
                {
                    TypeId = row.ItemType,
                    TypeName = row.IsTypeNameNull() ? string.Empty : row.TypeName,
                    OldName = row.ItemOldName,
                    NewName = row.ItemNewName,
                    ChangeDate = row.ItemChange.ToString(Constants.JSONFormatString),
                    ChangedByToken = row.ChangedByToken,
                };
            }
        }

        /// <summary>
        /// Erzeugt Objekte aus den Änderungsdatensätzen für Attribute 
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        private static IEnumerable<HistoricConfigurationItem.HistoricAttribute> GetHistoricAttributes(Guid itemId)
        {
            foreach (CMDBDataSet.ItemAttributesHistoryRow row in History.GetItemAttributesHistory(itemId))
            {
                yield return new HistoricConfigurationItem.HistoricAttribute()
                {
                    Id = row.AttributeId,
                    ItemId = itemId,
                    TypeId = row.AttributeTypeId,
                    TypeName = row.AttributeTypeName,
                    OldValue = row.AttributeOldValue,
                    NewValue = row.AttributeNewValue,
                    ChangeDate = row.AttributeChange.ToString(Constants.JSONFormatString),
                    ChangedByToken = row.ChangedByToken,
                };
            }
        }

        /// <summary>
        /// Erzeugt Objekte aus Änderungsdatensätzen für Verbindungen 
        /// </summary>
        /// <param name="itemId"></param>
        /// <returns></returns>
        private static IEnumerable<HistoricConfigurationItem.HistoricConnection> GetHistoricConnections(Guid itemId)
        {
            foreach (CMDBDataSet.ConnectionsHistoryRow row in History.GetConnectionsHistory(itemId))
            {
                yield return new HistoricConfigurationItem.HistoricConnection()
                {
                    Id = row.ConnId,
                    RuleId = row.ConnectionRuleId,
                    TargetItemId = row.ConnLowerItem.Equals(itemId) ? row.ConnUpperItem : row.ConnLowerItem,
                    TargetItemTypeName = row.TargetTypeName,
                    TargetItemName = row.TargetItemName,
                    TargetItemActive = row.TargetItemIsActive > 0,
                    TypeId = row.ConnType,
                    TypeName = row.ConnTypeName,
                    Description = row.ConnDescription,
                    Action = row.ConnReason,
                    ChangeDate = row.ConnChange.ToString(Constants.JSONFormatString),
                    ChangedByToken = row.ChangedByToken,
                };
            }
        }
    }
}
