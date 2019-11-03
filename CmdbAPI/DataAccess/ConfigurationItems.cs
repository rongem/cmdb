using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Enthält alle Methoden zum Datenzugriff auf Configuration Items
    /// </summary>
    public static class ConfigurationItems
    {
        /// <summary>
        /// Erzeugt einen neuen ConfigurationItems-Datensatz
        /// </summary>
        /// <param name="itemId">Guid des neuen Items</param>
        /// <param name="itemType">TypeId des neuen Items</param>
        /// <param name="itemName">Name des neuen Items</param>
        public static void Insert(Guid itemId, Guid itemType, string itemName, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter())
            {
                configurationItemsTableAdapter.Insert(itemId, itemType, itemName, changedByToken);
            }
        }

        /// <summary>
        /// Ändert einen bestehenden ConfigurationItems-Datensatz
        /// Zuerst wird überprüft, ob der Datensatz nicht von jemand anderem schon geändert wurde; danach wird der alte Datensatz in die History-Tabelle kopiert,
        /// zusammen mit dem Namen dessen, die den Datensatz gerade ändert. Danach erst wird der Datensatz geändert.
        /// </summary>
        /// <param name="itemId">Die GUID des Configuration Items</param>
        /// <param name="itemType">Die GUID des ItemTypes</param>
        /// <param name="itemName">Der neue Name des Items</param>
        /// <param name="itemCreated">Der Zeitpunkt der Erstellung des Configuration Items (nur zur Kontrolle, kann nicht mehr geändert werden)</param>
        /// <param name="itemLastChange">Der Zeitpunkt der letzten Änderung des Configuration Items (nur zur Kontrolle, wird automatisch von der Stored Procedure geändert)</param>
        /// <param name="itemVersion">Die Datensatzversion des Configuration Items (nur zur Kontrolle, automatisch von der Stored Procedure geändert)</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Änderung durchführt (für die interne Protokollierung</param>
        public static void Update(Guid itemId, Guid itemType, string itemName, DateTime itemCreated, DateTime itemLastChange, int itemVersion, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter())
            {
                configurationItemsTableAdapter.Update(itemId, itemType, itemName, itemCreated, itemLastChange, itemVersion, changedByToken);
            }
        }

        /// <summary>
        /// Löscht einen bestehenden ConfigurationItems-Datensatz
        /// Zuerst wird überprüft, ob der Datensatz nicht von jemand anderem schon geändert wurde; danach wird der alte Datensatz in die History-Tabelle kopiert,
        /// zusammen mit dem Namen dessen, die den Datensatz gerade löscht. Danach erst wird der Datensatz gelöscht.
        /// </summary>
        /// <param name="itemId">Die GUID des Configuration Items</param>
        /// <param name="itemType">Die GUID des ItemTypes</param>
        /// <param name="itemName">Der Name des Items</param>
        /// <param name="itemCreated">Der Zeitpunkt der Erstellung des Configuration Items (nur zur Kontrolle, kann nicht mehr geändert werden)</param>
        /// <param name="itemLastChange">Der Zeitpunkt der letzten Änderung des Configuration Items (nur zur Kontrolle, wird automatisch von der Stored Procedure geändert)</param>
        /// <param name="itemVersion">Die Datensatzversion des Configuration Items (nur zur Kontrolle, automatisch von der Stored Procedure geändert)</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public static void Delete(Guid itemId, Guid itemType, string itemName, DateTime itemCreated, DateTime itemLastChange, int itemVersion, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter())
            {
                configurationItemsTableAdapter.Delete(itemId, itemType, itemName, itemCreated, itemLastChange, itemVersion, changedByToken);
            }
        }

        /// <summary>
        /// Liefert alle ConfigurationItems zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.ConfigurationItemsDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter())
            {
                return configurationItemsTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt ein Configuration Item zurück
        /// </summary>
        /// <param name="id">Guid des gesuchten Configuration Item</param>
        /// <returns></returns>
        public static CMDBDataSet.ConfigurationItemsRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter())
            {
                return configurationItemsTableAdapter.GetDataById(id).FindByItemId(id);
            }
        }

        /// <summary>
        /// Gibt ein Configuration Item zurück
        /// </summary>
        /// <param name="itemTypeId">Guid des Itemtyp</param>
        /// <param name="itemName">Name des gesuchten Items</param>
        /// <returns></returns>
        public static CMDBDataSet.ConfigurationItemsRow SelectOneByTypeAndName(Guid itemTypeId, string itemName)
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter())
            {
                return configurationItemsTableAdapter.GetDataByItemTypeAndName(itemTypeId, itemName).FirstOrDefault();
            }
        }

        public static CMDBDataSet.ConfigurationItemsDataTable SelectAvailableForRule(Guid ruleId, int itemsToConnect)
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter())
            {
                return configurationItemsTableAdapter.GetDataByAvailabilityForRule(ruleId, itemsToConnect);
            }
        }

        /// <summary>
        /// Gibt die Anzahl der ConfigurationItems zurück, die einen bestimmten Typ besitzen
        /// </summary>
        /// <param name="itemType">Guid des ItemType</param>
        /// <returns>Int32</returns>
        public static int GetCountForType(Guid itemType)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return Convert.ToInt32(queriesTableAdapter.ConfigurationItems_GetCountForItemType(itemType));
            }
        }

        /// <summary>
        /// Gibt die Anzahl der verbundenen CIs eines bestimmten Typs mit einem bestimmten Verbindungstyp für ein CI zurück
        /// </summary>
        /// <param name="itemId">Guid des Items, von dem aus gesucht wird</param>
        /// <param name="connType">Guid des Verbindungstyps</param>
        /// <param name="itemType">Guid des Itemstyps, von dem die Ziel-CIs sein sollen</param>
        public static int GetCountForConnectedItems(Guid itemId, Guid connType, Guid itemType)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return Convert.ToInt32(queriesTableAdapter.ConfigurationItems_GetCountForConnectedItems(itemId, connType, itemType));
            }
        }

        /// <summary>
        /// Gibt alle Items zurück, die ausgehend von einem gegebenen Item über eine Regel verbunden sind.
        /// Anmerkung: Die Methode gibt abhängig von der Regel die Items oberhalb oder unterhalb des gegebenen Items zurück.
        /// </summary>
        /// <param name="itemId">Guid des Items, ab dem gesucht wird</param>
        /// <param name="ruleId">Guid der Regel</param>
        /// <returns>ConfigurationItemsDataTable</returns>
        public static CMDBDataSet.ConfigurationItemsDataTable SelectNeighborForItemAndConnectionRule(Guid itemId, Guid ruleId)
        {
            using (CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter configurationItemsTableAdapter = new CMDBDataSetTableAdapters.ConfigurationItemsTableAdapter())
            {
                return configurationItemsTableAdapter.GetItemsByItemAndConnectionRule(itemId, ruleId);
            }
        }

    }
}
