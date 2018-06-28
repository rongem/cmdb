using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Enthält alle Methoden zum Zugriff auf Verantwortlichkeiten für Configuration Items
    /// </summary>
    public static class Responsibility
    {
        /// <summary>
        /// Erzeugt einen neuen Datensatz in der Tabelle der Verantwortlichkeiten für Configuration Items
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <param name="UserToken">Benutzername</param>
        public static void TakeResponsibility(Guid itemId, string UserToken)
        {
            using (CMDBDataSetTableAdapters.ResponsibilityTableAdapter responsibilityTableAdapter = new CMDBDataSetTableAdapters.ResponsibilityTableAdapter())
            {
                responsibilityTableAdapter.Insert(itemId, UserToken);
            }
        }

        /// <summary>
        /// Löscht einen Datensatz in der Tabelle der Verantwortlichkeiten für Configuration Items
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="UserToken"></param>
        public static void AbandonResponsibility(Guid itemId, string UserToken)
        {
            using (CMDBDataSetTableAdapters.ResponsibilityTableAdapter responsibilityTableAdapter = new CMDBDataSetTableAdapters.ResponsibilityTableAdapter())
            {
                responsibilityTableAdapter.Delete(itemId, UserToken);
            }
        }

        /// <summary>
        /// Gibt alle Verantwortlichkeiten zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.ResponsibilityDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ResponsibilityTableAdapter responsibilityTableAdapter = new CMDBDataSetTableAdapters.ResponsibilityTableAdapter())
            {
                return responsibilityTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt alle Verantwortlichkeiten für ein Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <returns></returns>
        public static CMDBDataSet.ResponsibilityDataTable SelectForItem(Guid itemId)
        {
            using (CMDBDataSetTableAdapters.ResponsibilityTableAdapter responsibilityTableAdapter = new CMDBDataSetTableAdapters.ResponsibilityTableAdapter())
            {
                return responsibilityTableAdapter.GetDataForItem(itemId);
            }
        }

        /// <summary>
        /// Überprüft, ob ein angegebener Benutzer für ein Configuration Item verantwortlich ist
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="responsibleToken">Benutzername</param>
        /// <returns></returns>
        public static bool CheckResponsibility(Guid itemId, string responsibleToken)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return queriesTableAdapter.Responsibility_GetResponsibility(itemId, responsibleToken).Equals(1);
            }
        }

    }
}
