using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Enthält alle Methoden zum Datenzugriff auf Verbindungen
    /// </summary>
    public static class Connections
    {
        /// <summary>
        /// Gibt die Anzahl der Connections zu einem bestimmten ConnectionType zurück
        /// </summary>
        /// <param name="connectionType">Guid des ConnectionType</param>
        /// <returns>Int32</returns>
        public static int GetCountForConnectionType(Guid connectionType)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return Convert.ToInt32(queriesTableAdapter.Connections_GetCountForConnectionType(connectionType));
            }
        }

        /// <summary>
        /// Gibt die Anzahl der Verbindungen zurück, die einer angegebenen Regel entsprechen
        /// </summary>
        /// <param name="ruleId">ID der Regel, für die die Auswertung erfolgt</param>
        /// <returns>Int-Wert mit der Anzahl</returns>
        public static int GetCountForRule(Guid ruleId)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return Convert.ToInt32(queriesTableAdapter.Connections_GetCountForRule(ruleId));
            }
        }

        /// <summary>
        /// Erstellt einen neuen Connections-Datensatz
        /// </summary>
        /// <param name="connId">Guid des Datensatzes</param>
        /// <param name="connUpperItem">Guid des oberen Configuration Item</param>
        /// <param name="connLowerItem">Guid des unteren Configuration Item</param>
        /// <param name="ruleId">Guid der Verbindungsregel, der die aktuelle Verbindung entsprechen soll</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Verbindung anlegt (für die interne Protokollierung)</param>
        public static void Insert(Guid connId, Guid connUpperItem, Guid connLowerItem, Guid ruleId, string description, string changedByToken)
        {
            CMDBDataSet.ConnectionRulesRow rule = ConnectionRules.SelectOne(ruleId);
            if (SelectForUpperItemAndRule(connUpperItem, ruleId).Count() + 1 > rule.MaxConnectionsToLower) // Kann das weg, weil es bereits im DataHandler überprüft wird?
                throw new Exception("Die Verbindung konnte nicht hinzugefügt werden, weil sonst die maximale Anzahl von Verbindungen dieses Typs nach unten überschritten würde.");
            if (SelectForLowerItemAndRule(connLowerItem, ruleId).Count() + 1 > rule.MaxConnectionsToUpper) // Kann das wegg, weil es bereits im DataHandler überprüft wird?
                throw new Exception("Die Verbindung konnte nicht hinzugefügt werden, weil sonst die maximale Anzahl von Verbindungen dieses Typs nach oben überschritten würde.");
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                connectionsTableAdapter.Insert(connId, connUpperItem, connLowerItem, ruleId, description, changedByToken);
            }
        }

        /// <summary>
        /// Löscht einen vorhandenen Connections-Datensatz
        /// </summary>
        /// <param name="connId">Guid des Datensatzes</param>
        /// <param name="connUpperItem">Guid des oberen Configuration Items</param>
        /// <param name="connLowerItem">Guid des unteren Configuration Items</param>
        /// <param name="ruleId">Guid der Verbindungsregel, der die aktuelle Verbindung entsprechen soll</param>
        /// <param name="connCreated">Zeitpunkt, wann der Datensatz erstellt wurde</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public static void Delete(Guid connId, Guid connUpperItem, Guid connLowerItem, Guid ruleId, DateTime connCreated, string description, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                connectionsTableAdapter.Delete(connId, connUpperItem, connLowerItem, ruleId, connCreated, description, changedByToken);
            }
        }

        /// <summary>
        /// Gibt alle Verbindungen zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionsDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                return connectionsTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt eine Verbindung zurück
        /// </summary>
        /// <param name="id">Guid der gesuchten Verbindung</param>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionsRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                return connectionsTableAdapter.GetDataById(id).FindByConnId(id);
            }
        }

        /// <summary>
        /// Liefert einen Datensatz zurück, der über Obere ItemId, Verbindungstyp und untere ItemId eindeutig definiert wird. Liefer NULL zurück, wenn diese Verbindung nicht existiert.
        /// </summary>
        /// <param name="upperItemId">GUID des oberen Items</param>
        /// <param name="connectionType">GUID des Verbindungstyps</param>
        /// <param name="lowerItemId">GUID des unteren Items</param>
        /// <returns>CMDBDataSet.ConnectionsRow</returns>
        public static CMDBDataSet.ConnectionsRow SelectByContent(Guid upperItemId, Guid connectionType, Guid lowerItemId)
        {
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                return connectionsTableAdapter.GetConnectionByContent(upperItemId, lowerItemId, connectionType).FirstOrDefault();
            }
        }

        /// <summary>
        /// Gibt alle Verbindungen zurück, die für ein bestimmtes oberes Configuration Item einer angegebenen Regel entsprechen
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items, für das gesucht wird</param>
        /// <param name="ruleId">Guid der Regel</param>
        /// <returns>ConnectionsDataTable</returns>
        public static CMDBDataSet.ConnectionsDataTable SelectForUpperItemAndRule(Guid itemId, Guid ruleId)
        {
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                return connectionsTableAdapter.GetConnectionsForUpperItemAndRule(itemId, ruleId);
            }
        }

        /// <summary>
        /// Gibt alle Verbindungen zurück, die für ein bestimmtes unteres Configuration Item einer angegebenen Regel entsprechen
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items, für das gesucht wird</param>
        /// <param name="ruleId">Guid der Regel</param>
        /// <returns>ConnectionsDataTable</returns>
        public static CMDBDataSet.ConnectionsDataTable SelectForLowerItemAndRule(Guid itemId, Guid ruleId)
        {
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                return connectionsTableAdapter.GetConnectionsForLowerItemAndRule(itemId, ruleId);
            }
        }

        /// <summary>
        /// Liefert alle abwärts gerichteten Verbindungen für ein Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionsDataTable SelectConnectionsToLowerForItemId(Guid itemId)
        {
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                return connectionsTableAdapter.GetConnectionsToLowerForItemId(itemId);
            }
        }

        /// <summary>
        /// Liefert alle aufwärts gerichteten Verbindungen für ein Configuration Item zurück
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <returns></returns>
        public static CMDBDataSet.ConnectionsDataTable SelectConnectionsToUpperForItemId(Guid itemId)
        {
            using (CMDBDataSetTableAdapters.ConnectionsTableAdapter connectionsTableAdapter = new CMDBDataSetTableAdapters.ConnectionsTableAdapter())
            {
                return connectionsTableAdapter.GetConnectionsToUpperForItemId(itemId);
            }
        }

    }
}
