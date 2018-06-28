using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Stellt alle Methoden zum Zugriff auf Verbindungstypen bereit
    /// </summary>
    public static class ConnectionTypes
    {
        /// <summary>
        /// Erstellt einen neuen ConnectionType-Datensatz
        /// </summary>
        /// <param name="id">GUID des Verbindungstyps</param>
        /// <param name="name">Bezeichnung des Verbindungstyps</param>
        /// <param name="reverseName">Rückwärts-Bezeichnung des Verbindungstyps</param>
        public static void Insert(Guid id, string name, string reverseName)
        {
            using (CMDBDataSetTableAdapters.ConnectionTypesTableAdapter connectionTypesTableAdapter = new CMDBDataSetTableAdapters.ConnectionTypesTableAdapter())
            {
                connectionTypesTableAdapter.Insert(id, name, reverseName);
            }
        }

        /// <summary>
        /// Speichert einen aktualisierten ConnectionType-Datensatz
        /// </summary>
        /// <param name="r">Veränderter Datensatz</param>
        public static void Update(CMDBDataSet.ConnectionTypesRow r)
        {
            if (r == null)
                throw new Exception("Kein Datensatz angegeben");
            using (CMDBDataSetTableAdapters.ConnectionTypesTableAdapter connectionTypesTableAdapter = new CMDBDataSetTableAdapters.ConnectionTypesTableAdapter())
            {
                connectionTypesTableAdapter.Update(r);
            }
        }

        /// <summary>
        /// Löscht einen bestehenden ConnectionType-Datensatz
        /// </summary>
        /// <param name="id">GUID des Verbindungstyps</param>
        /// <param name="name">Bezeichnung des Verbindungstyps</param>
        /// <param name="reverseName">Rückwärts-Bezeichnung des Verbindungstyps</param>
        public static void Delete(Guid id, string name, string reverseName)
        {
            using (CMDBDataSetTableAdapters.ConnectionTypesTableAdapter connectionTypesTableAdapter = new CMDBDataSetTableAdapters.ConnectionTypesTableAdapter())
            {
                connectionTypesTableAdapter.Delete(id, name, reverseName);
            }
        }

        /// <summary>
        /// Gibt alle ConnectionTypes zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionTypesDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ConnectionTypesTableAdapter connectionTypesTableAdapter = new CMDBDataSetTableAdapters.ConnectionTypesTableAdapter())
            {
                return connectionTypesTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt einen ConnectionType zurück
        /// </summary>
        /// <param name="id">Guid des ConnectionTypes</param>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionTypesRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.ConnectionTypesTableAdapter connectionTypesTableAdapter = new CMDBDataSetTableAdapters.ConnectionTypesTableAdapter())
            {
                return connectionTypesTableAdapter.GetDataById(id).FindByConnTypeId(id);
            }
        }

        /// <summary>
        /// Gibt eine Liste von ConnectionTypes zurück, die von einem ItemType abwärts gerichtet erlaubt sind.
        /// </summary>
        /// <param name="itemType">GUID des ItemType, der gesucht wird</param>
        /// <returns>List<CMDBDataSet.ConnectionTypesRow></returns>
        public static CMDBDataSet.ConnectionTypesDataTable GetDownwardConnnectionTypesForItemType(Guid itemType)
        {
            using (CMDBDataSetTableAdapters.ConnectionTypesTableAdapter connectionTypesTableAdapter = new CMDBDataSetTableAdapters.ConnectionTypesTableAdapter())
            {
                return connectionTypesTableAdapter.GetDownwardConnectionsByItemUpperType(itemType);
            }
        }

        /// <summary>
        /// Gibt eine Liste von ConnectionTypes zurück, die von einem ItemType aufwärts gerichtet erlaubt sind.
        /// </summary>
        /// <param name="itemType"></param>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionTypesDataTable GetUpwardConnectionTypesForItemType(Guid itemType)
        {
            using (CMDBDataSetTableAdapters.ConnectionTypesTableAdapter connectionTypesTableAdapter = new CMDBDataSetTableAdapters.ConnectionTypesTableAdapter())
            {
                return connectionTypesTableAdapter.GetUpwardConnectionsByItemLowerType(itemType);
            }
        }

    }
}
