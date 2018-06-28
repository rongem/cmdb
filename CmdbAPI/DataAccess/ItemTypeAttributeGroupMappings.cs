using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    public static class ItemTypeAttributeGroupMappings
    {
        /// <summary>
        /// Fügt eine neue Zuordnung einer Attributgruppe zu einem ItemType hinzu
        /// </summary>
        /// <param name="groupId">GUID der Attributgruppe</param>
        /// <param name="itemTypeId">GUID des ItemType</param>
        public static void Insert(Guid groupId, Guid itemTypeId)
        {
            using (CMDBDataSetTableAdapters.ItemTypeAttributeGroupMappingsTableAdapter itemTypeAttributeGroupMappingsTableAdapter = new CMDBDataSetTableAdapters.ItemTypeAttributeGroupMappingsTableAdapter())
            {
                itemTypeAttributeGroupMappingsTableAdapter.Insert(groupId, itemTypeId);
            }
        }

        /// <summary>
        /// Löscht eine bestehende Zuordnung einer Attributgruppe zu einem ItemType
        /// </summary>
        /// <param name="groupId">GUID der Attributgruppe</param>
        /// <param name="itemTypeId">GUID des ItemType</param>
        public static void Delete(Guid groupId, Guid itemTypeId)
        {
            using (CMDBDataSetTableAdapters.ItemTypeAttributeGroupMappingsTableAdapter itemTypeAttributeGroupMappingsTableAdapter = new CMDBDataSetTableAdapters.ItemTypeAttributeGroupMappingsTableAdapter())
            {
                itemTypeAttributeGroupMappingsTableAdapter.Delete(groupId, itemTypeId);
            }
        }

        /// <summary>
        /// Liefert alle Zuordnungen von Attributgruppen zu ItemTypen zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.ItemTypeAttributeGroupMappingsDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ItemTypeAttributeGroupMappingsTableAdapter itemTypeAttributeGroupMappingsTableAdapter = new CMDBDataSetTableAdapters.ItemTypeAttributeGroupMappingsTableAdapter())
            {
                return itemTypeAttributeGroupMappingsTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt eine Attributgruppe anhand ihres Inhalts zurück
        /// </summary>
        /// <param name="attributeGroupId">Guid der Attributgruppe</param>
        /// <param name="ItemTypeId">Guid des ItemTyps</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemTypeAttributeGroupMappingsRow SelectByContent(Guid attributeGroupId, Guid ItemTypeId)
        {
            using (CMDBDataSetTableAdapters.ItemTypeAttributeGroupMappingsTableAdapter itemTypeAttributeGroupMappingsTableAdapter = new CMDBDataSetTableAdapters.ItemTypeAttributeGroupMappingsTableAdapter())
            {
                return itemTypeAttributeGroupMappingsTableAdapter.GetDataByContent(attributeGroupId, ItemTypeId).FindByGroupIdItemTypeId(attributeGroupId, ItemTypeId);
            }
        }

        /// <summary>
        /// Gibt die Anzahl der einer Gruppe zugeordneten ItemTypen zurück
        /// </summary>
        /// <param name="groupId">Guid der gesuchten Attributgruppe</param>
        /// <returns></returns>
        public static int GetCountForGroup(Guid groupId)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return (int)queriesTableAdapter.ItemTypeAttributeGroupMappings_GetCountForGroup(groupId);
            }
        }

    }
}
