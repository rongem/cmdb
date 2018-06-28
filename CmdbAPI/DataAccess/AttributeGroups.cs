using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Stelle alle Methoden zum Zugriff auf Attributgruppen bereit
    /// </summary>
    public static class AttributeGroups
    {
        /// <summary>
        /// Erstellt einen neuen AttributeGroup-Datensatz
        /// </summary>
        /// <param name="id">ID der neuen Attributgruppe</param>
        /// <param name="name">Bezeichnung der neuen Attributgruppe</param>
        public static void Insert(Guid id, string name)
        {
            using (CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter())
            {
                attributeGroupsTableAdapter.Insert(id, name);
            }
        }

        /// <summary>
        /// Speichert einen geänderten AttributeGroup-Datensatz
        /// </summary>
        /// <param name="r">Geänderter Datensatz mit Attributgruppe</param>
        public static void Update(CMDBDataSet.AttributeGroupsRow r)
        {
            using (CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter())
            {
                attributeGroupsTableAdapter.Update(r);
            }
        }

        /// <summary>
        /// Löscht einen existierenden AttributeGroup-Datensatz
        /// </summary>
        /// <param name="id">ID der Attributgruppe</param>
        /// <param name="name">Bezeichnung der Attributgruppe</param>
        public static void Delete(Guid id, string name)
        {
            using (CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter())
            {
                attributeGroupsTableAdapter.Delete(id, name);
            }
        }

        /// <summary>
        /// Gibt alle Attributgruppen zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.AttributeGroupsDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter())
            {
                return attributeGroupsTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt eine Attributgruppe zurück
        /// </summary>
        /// <param name="id">Guid der Attributgruppe</param>
        /// <returns></returns>
        public static CMDBDataSet.AttributeGroupsRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter())
            {
                return attributeGroupsTableAdapter.GetDataById(id).FindByGroupId(id);
            }
        }

        /// <summary>
        /// Gibt eine Attributgruppe zurück
        /// </summary>
        /// <param name="groupName">Guid der Attributgruppe</param>
        /// <returns></returns>
        public static CMDBDataSet.AttributeGroupsRow SelectByName(string groupName)
        {
            using (CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter())
            {
                return attributeGroupsTableAdapter.GetDataByName(groupName).FirstOrDefault();
            }
        }

        /// <summary>
        /// Gibt alle Attributgruppen zurück, die einem Itemtype nicht zugeordnet sind
        /// </summary>
        /// <param name="itemtype">GUID des Itemtype</param>
        public static CMDBDataSet.AttributeGroupsDataTable GetUnassigned(Guid itemtype)
        {
            using (CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter())
            {
                return attributeGroupsTableAdapter.GetUnassignedToItem(itemtype);
            }
        }

        /// <summary>
        /// Gibt alle Attributgruppen zurück, die einem ItemType zugeordnet sind
        /// </summary>
        /// <param name="itemtype">GUID des Itemtype</param>
        public static CMDBDataSet.AttributeGroupsDataTable GetAssignedToItem(Guid itemtype)
        {
            using (CMDBDataSetTableAdapters.AttributeGroupsTableAdapter attributeGroupsTableAdapter = new CMDBDataSetTableAdapters.AttributeGroupsTableAdapter())
            {
                return attributeGroupsTableAdapter.GetAssignedToItem(itemtype);
            }
        }

    }
}
