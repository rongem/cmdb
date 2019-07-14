using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    public static class ItemAttributes
    {
        /// <summary>
        /// Gibt alle Attribute zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.ItemAttributesDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                return itemAttributesTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt ein Attribut zurück
        /// </summary>
        /// <param name="id">Guid des gesuchten Attributs</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemAttributesRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                return itemAttributesTableAdapter.GetAttributeById(id).FindByAttributeId(id);
            }
        }

        /// <summary>
        /// Gibt alle Attribute zurück, die einem angegebenen Item zugeordnet sind
        /// </summary>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <returns>ItemAttributesDataTable</returns>
        public static CMDBDataSet.ItemAttributesDataTable SelectForItem(Guid itemId)
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                return itemAttributesTableAdapter.GetAttributesByItem(itemId);
            }
        }


        /// <summary>
        /// Gibt ein Attribut zurück, das zum angegebenen Item gehört und den angegebenen Attributtyp besitzt
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemAttributesRow SelectForItemAndAttributeType(Guid itemId, Guid attributeTypeId)
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                return itemAttributesTableAdapter.GetAttributesByItemAndType(itemId, attributeTypeId).FirstOrDefault();
            }
        }

        /// <summary>
        /// Gibt alle Attribute eines angegebenen Attributtyps zurück
        /// </summary>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemAttributesDataTable SelectForAttributeType(Guid attributeTypeId)
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                return itemAttributesTableAdapter.GetAttributesByAttributeType(attributeTypeId);
            }
        }

        /// <summary>
        /// Erstellt ein neues Attribut zu einem Item
        /// </summary>
        /// <param name="attributeId">Guid des Attributs</param>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <param name="attributeValue">Wert des Attributs</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die das Attribut hinzufügt</param>
        public static void Insert(Guid attributeId, Guid itemId, Guid attributeTypeId, string attributeValue, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                itemAttributesTableAdapter.Insert(attributeId, itemId, attributeTypeId, attributeValue, changedByToken);
            }
        }

        /// <summary>
        /// Aktualisiert ein vorhandenes Attribut zu einem Item
        /// </summary>
        /// <param name="attributeId">Guid des Attributs</param>
        /// <param name="attributeValue">Wert des Attributs</param>
        /// <param name="attributeLastChange">Datum der letzten Änderung am Attribu</param>
        /// <param name="attributeVersion">Version des Attributs</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public static void Update(Guid attributeId, string attributeValue, DateTime attributeLastChange, int attributeVersion, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                itemAttributesTableAdapter.Update(attributeValue, attributeId, attributeLastChange, attributeVersion, changedByToken);
            }
        }

        /// <summary>
        /// Löscht ein vorhandenes Attribut zu einem Item
        /// </summary>
        /// <param name="attributeId">Guid des Attributs</param>
        /// <param name="itemId">Guid des Configuration Items</param>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <param name="attributeValue">Wert des Attributs</param>
        /// <param name="attributeCreated">Datum der Erstellung des Attributs</param>
        /// <param name="attributeLastChange">Datum der letzten Änderung am Attribu</param>
        /// <param name="attributeVersion">Version des Attributs</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public static void Delete(Guid attributeId, Guid itemId, Guid attributeTypeId, string attributeValue, DateTime attributeCreated, DateTime attributeLastChange, int attributeVersion, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                itemAttributesTableAdapter.Delete(attributeId, itemId, attributeTypeId, attributeValue, attributeCreated, attributeLastChange, attributeVersion, changedByToken);
            }
        }

        /// <summary>
        /// Admin-Funktion: Löscht vorhandene Attribute zu mehreren Items, die alle einem bestimmten Typ angehören
        /// </summary>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        /// <param name="expectedNumberOfRows">Anzahl der Zeilen, die als Ergebnis erwartet wird</param>
        public static void DeleteByType(Guid attributeTypeId, string changedByToken, int expectedNumberOfRows)
        {
            using (CMDBDataSetTableAdapters.ItemAttributesTableAdapter itemAttributesTableAdapter = new CMDBDataSetTableAdapters.ItemAttributesTableAdapter())
            {
                CMDBDataSet.ItemAttributesRow[] attrs = itemAttributesTableAdapter.GetAttributesByAttributeType(attributeTypeId).ToArray();
                if (attrs.Length != expectedNumberOfRows)
                    throw new Exception("Die Anzahl der Attributwerte hat sich seit dem letzten Aufruf geändert. Bitte versuchen Sie es später erneut.");
                for (int i = 0; i < attrs.Length; i++)
                {
                    CMDBDataSet.ItemAttributesRow attr = attrs[i];
                    itemAttributesTableAdapter.Delete(attr.AttributeId, attr.ItemId, attr.AttributeTypeId, attr.AttributeValue, attr.AttributeCreated, attr.AttributeLastChange, attr.AttributeVersion, changedByToken);
                }
            }
        }

        /// <summary>
        /// Admin-Funktion: Löscht vorhandene Attribute zu mehreren Items, die alle einer bestimmten Gruppe angehören
        /// </summary>
        /// <param name="groupId">Guid der Attributgruppe, die verwendet wird</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public static void DeleteByGroup(Guid groupId, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                queriesTableAdapter.ItemAttributes_DeleteByAttributeGroup(groupId, changedByToken);
            }
        }

        /// <summary>
        /// Admin-Funktion: Löscht vorhandene Attribute zu mehreren Items, die alle einem bestimmten Typ angehören
        /// </summary>
        /// <param name="groupId">Guid der Attributgruppe, die verwendet wird</param>
        /// <param name="itemTypeId">Guid des ItemType, der verwendet wird</param>
        /// <param name="changedByToken">Die Benutzerkennung der Person, die die Löschung durchführt (für die interne Protokollierung)</param>
        public static void DeleteByGroupAndItemType(Guid groupId, Guid itemTypeId, string changedByToken)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                queriesTableAdapter.ItemAttributes_DeleteByAttributeGroupAndItemType(groupId, itemTypeId, changedByToken);
            }
        }

        /// <summary>
        /// Gibt die Anzahl der verwendeten Attribute von einem bestimmten Typ zurück
        /// </summary>
        /// <param name="attributeTypeId">Guid des Attributtyps</param>
        /// <returns>Int32</returns>
        public static int GetCountForAttributeType(Guid attributeTypeId)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return Convert.ToInt32(queriesTableAdapter.ItemAttributes_GetCountForAttributeType(attributeTypeId));
            }
        }

        /// <summary>
        /// Gibt die Anzahl der verwendeten Attribute zurück, deren Typ einer angegebenen Attributgruppe zugeordnet ist
        /// </summary>
        /// <param name="groupId">Guid der Attributgruppe</param>
        /// <returns>Int32</returns>
        public static int GetCountForAttributeGroup(Guid groupId)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return Convert.ToInt32(queriesTableAdapter.ItemAttributes_GetCountForAttributeGroup(groupId));
            }
        }

        /// <summary>
        /// Gibt die Anzahl der verwendeten Attribute zurück, deren Typ einer angegebenen Attributgruppe zugeordnet ist
        /// </summary>
        /// <param name="groupId">Guid der Attributgruppe</param>
        /// <returns>Int32</returns>
        public static int GetCountForAttributeGroupAndItemType(Guid groupId, Guid itemTypeId)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return Convert.ToInt32(queriesTableAdapter.ItemAttributes_GetCountForAttributeGroupAndItemType(groupId, itemTypeId));
            }
        }

    }
}
