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
        /// Liefert alle Änderungsdatensätze zu einem Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static CMDBDataSet.ConfigurationItemsHistoryDataTable GetConfigurationItemsHistory(Guid itemId)
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsHistoryTableAdapter historyTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsHistoryTableAdapter())
            {
                return historyTableAdapter.GetData(itemId);
            }
        }

        /// <summary>
        /// Liefert alle Änderungsdatensätze zu den Attributen eines Configuration Items zurück
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemAttributesHistoryDataTable GetItemAttributesHistory(Guid itemId)
        {
            using(CMDBDataSetTableAdapters.ItemAttributesHistoryTableAdapter historyTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesHistoryTableAdapter())
            {
                return historyTableAdapter.GetData(itemId);
            }
        }

        /// <summary>
        /// Liefert alle Änderungsdatensätze zu den Verbindungen eines Configuration Items zurück
        /// </summary>
        /// <param name="itemId">Guid des Items</param>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionsHistoryDataTable GetConnectionsHistory(Guid itemId)
        {
            using (CMDBDataSetTableAdapters.ConnectionsHistoryTableAdapter historyTableAdapter = new CMDBDataSetTableAdapters.ConnectionsHistoryTableAdapter())
            {
                return historyTableAdapter.GetData(itemId);
            }
        }

    }
}
