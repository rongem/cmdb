using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Enthält alle Methoden zum Zugriff auf Verbindungsregeln
    /// </summary>
    public static class ConnectionRules
    {
        /// <summary>
        /// Erstellt einen neuen ConnectionRule-Datensatz
        /// </summary>
        /// <param name="ruleId">ID der neu zu erstellenden Regel</param>
        /// <param name="upperType">Oberer ItemType</param>
        /// <param name="connType">ConnectionType</param>
        /// <param name="lowerType">Unterer ItemType</param>
        /// <param name="maxConnectionsToUpper">Maximalanzahl der Verbindungen in Richtung des oberen Typs</param>
        /// <param name="maxConnectionsToLower">Maximalanzahl der Verbindungen in Richtung des unteren Typs</param>
        public static void Insert(Guid ruleId, Guid upperType, Guid connType, Guid lowerType, int maxConnectionsToUpper, int maxConnectionsToLower)
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                connectionRulesTableAdapter.Insert(ruleId, upperType, lowerType, connType, maxConnectionsToUpper, maxConnectionsToLower);
            }
        }

        /// <summary>
        /// Führt die Änderungen an einem ConnectionRule-Datensatz durch
        /// </summary>
        /// <param name="r">Der geänderte ConnectionRule-Datensatz</param>
        public static void Update(CMDBDataSet.ConnectionRulesRow r)
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                connectionRulesTableAdapter.Update(r);
            }
        }

        /// <summary>
        /// Löscht einen ConnectionRules-Datensatz
        /// </summary>
        /// <param name="ruleId">ID der zu löschenden Regel</param>
        /// <param name="upperItemType">Typ des oberen Items</param>
        /// <param name="connType">Typ der Verbindung</param>
        /// <param name="lowerItemType">Typ des unteren Items</param>
        /// <param name="maxConnectionsToUpper">Maximalanzahl der Verbindungen in Richtung des oberen Typs</param>
        /// <param name="maxConnectionsToLower">Maximalanzahl der Verbindungen in Richtung des unteren Typs</param>
        public static void Delete(Guid ruleId, Guid upperItemType, Guid connType, Guid lowerItemType, int maxConnectionsToUpper, int maxConnectionsToLower)
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                connectionRulesTableAdapter.Delete(ruleId, upperItemType, lowerItemType, connType, maxConnectionsToUpper, maxConnectionsToLower);
            }
        }

        /// <summary>
        /// Gibt die Regeln zurück, die ausgehend vom Typ abwärts gerichtet sind
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns>ConnectionRulesDataTable</returns>
        public static CMDBDataSet.ConnectionRulesDataTable GetByItemUpperType(Guid itemType)
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                return connectionRulesTableAdapter.GetRulesForUpperType(itemType);
            }
        }

        /// <summary>
        /// Gibt die Regeln zurück, die ausgehend vom Typ aufwärts gerichtet sind
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns>ConnectionRulesDataTable</returns>
        public static CMDBDataSet.ConnectionRulesDataTable GetByItemLowerType(Guid itemType)
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                return connectionRulesTableAdapter.GetRulesForLowerType(itemType);
            }
        }

        /// <summary>
        /// Gibt alle Verbindungsregeln zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionRulesDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                return connectionRulesTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt eine Verbindungsregel zurück
        /// </summary>
        /// <param name="id">Guid der gesuchten Verbindungsregel</param>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionRulesRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                return connectionRulesTableAdapter.GetDataById(id).FindByRuleId(id);
            }
        }

        /// <summary>
        /// Gibt den Datensatz mit der Regel zurück, die für gegebene Typen gilt. Gibt NULL zurück, wenn nichts gefunden wird.
        /// </summary>
        /// <param name="itemUpperType">GUID des oberen ItemTypen</param>
        /// <param name="connType">GUID des Verbindungstypen</param>
        /// <param name="itemLowerType">GUID des unteren ItemTypen</param>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionRulesRow SelectByContent(Guid itemUpperType, Guid connType, Guid itemLowerType)
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                return connectionRulesTableAdapter.GetDataByContent(itemUpperType, itemLowerType, connType).FirstOrDefault();
            }
        }

        /// <summary>
        /// Gibt Datensätze mit der Regel zurück, die für gegebene Item-Typen gilt. Gibt NULL zurück, wenn nichts gefunden wird.
        /// </summary>
        /// <param name="itemUpperType">GUID des oberen ItemTypen</param>
        /// <param name="itemLowerType">GUID des unteren ItemTypen</param>
        /// <returns></returns>
        public static IEnumerable<CMDBDataSet.ConnectionRulesRow> SelectByUpperAndLowerItemType(Guid itemUpperType, Guid itemLowerType)
        {
            using (CMDBDataSetTableAdapters.ConnectionRulesTableAdapter connectionRulesTableAdapter = new CMDBDataSetTableAdapters.ConnectionRulesTableAdapter())
            {
                return connectionRulesTableAdapter.GetDataByUpperAndLowerItemType(itemUpperType, itemLowerType);
            }
        }

    }
}
