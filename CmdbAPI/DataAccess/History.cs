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
                return string.Format("{0} erstellt mit Wert '{1}'", subject, newtext);
            }
            else if (newtext.Equals("<deleted>"))
            {
                return string.Format("{0} gelöscht mit Wert '{1}'", subject, oldtext);
            }
            else
            {
                return string.Format("{0} geändert von '{1}' nach '{2}'", subject, oldtext, newtext);
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
                    Text = GetText("Name", row.ItemOldName, row.ItemNewName),
                };
            }
        }
    }
}
