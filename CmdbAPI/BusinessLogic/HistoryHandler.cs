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
                    DateTime = row.ItemChange,
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
                    DateTime = row.AttributeChange,
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
                    DateTime = row.ConnChange,
                    Subject = string.Format("Verbindung {0} ({1})", row.ConnTypeName, row.ConnDescription),
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
            };
            return item;
        }
    }
}
