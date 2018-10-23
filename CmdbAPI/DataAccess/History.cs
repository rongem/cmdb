using CmdbAPI.DataObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Realisiert den Datenzugriff auf Protokolldateien
    /// </summary>
    public static class History
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
        public static IEnumerable<HistoryEntry> GetItemChanges(Guid itemId)
        {
            foreach (CMDBDataSet.ConfigurationItemsHistoryRow row in new CMDBDataSetTableAdapters.ConfigurationItemsHistoryTableAdapter().GetData(itemId))
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
        public static IEnumerable<HistoryEntry> GetAttributeChanges(Guid itemId)
        {
            foreach (CMDBDataSet.ItemAttributesHistoryRow row in new CMDBDataSetTableAdapters.ItemAttributesHistoryTableAdapter().GetData(itemId))
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
        public static IEnumerable<HistoryEntry> GetConnectionChanges(Guid itemId)
        {
            foreach (CMDBDataSet.ConnectionsHistoryRow row in new CMDBDataSetTableAdapters.ConnectionsHistoryTableAdapter().GetData(itemId))
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
    }
}
