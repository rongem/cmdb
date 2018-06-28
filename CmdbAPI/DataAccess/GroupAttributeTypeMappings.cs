using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Stellt alle Methoden zum Zugriff auf Zuordnungen von Attributgruppen zu Attributtypen bereit
    /// </summary>
    public static class GroupAttributeTypeMappings
    {
        /// <summary>
        /// Erstellt einen neuen GroupAttribute-Datensatz
        /// </summary>
        /// <param name="group">ID der Attributgruppe</param>
        /// <param name="attributeType">ID des AttributTyps</param>
        public static void Insert(Guid group, Guid attributeType)
        {
            using (CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter groupAttributeTypeMappingsTableAdapter = new CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter())
            {
                groupAttributeTypeMappingsTableAdapter.Insert(group, attributeType);
            }
        }

        /// <summary>
        /// Ändert die Gruppenzuordnung eines Attributtyps und fügt den Item-Typen die Gruppen so zu, dass die Items die Attribute auch besitzen
        /// </summary>
        /// <param name="newGroup">Guid der neuen Gruppe</param>
        /// <param name="oldGroup">Guid der alten Gruppe</param>
        /// <param name="attributeType">Guid des zu ändernden Attributtyps</param>
        public static void Update (Guid newGroup, Guid oldGroup, Guid attributeType)
        {
            using (CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter groupAttributeTypeMappingsTableAdapter = new CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter())
            {
                groupAttributeTypeMappingsTableAdapter.Update(newGroup, oldGroup, attributeType);
            }
        }

        /// <summary>
        /// Löscht einen existierenden GroupAttribute-Datensatz
        /// </summary>
        /// <param name="group">ID der Attributgruppe</param>
        /// <param name="attributeType">ID des AttributTyps</param>
        public static void Delete(Guid group, Guid attributeType)
        {
            using (CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter groupAttributeTypeMappingsTableAdapter = new CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter())
            {
                groupAttributeTypeMappingsTableAdapter.Delete(group, attributeType);
            }
        }

        /// <summary>
        /// Liefert alle Zuordnungen von Attributtypen zu Attributgruppen zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.GroupAttributeTypeMappingsDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter groupAttributeTypeMappingsTableAdapter = new CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter())
            {
                return groupAttributeTypeMappingsTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Liefert die Zuordnung einer Attributgruppe zu einem bestimmten Attributtypen zurück
        /// </summary>
        /// <param name="attributeTypeId">Guid des AttributTypen</param>
        /// <returns></returns>
        public static CMDBDataSet.GroupAttributeTypeMappingsRow SelectByAttributeType(Guid attributeTypeId)
        {
            using (CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter groupAttributeTypeMappingsTableAdapter = new CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter())
            {
                return groupAttributeTypeMappingsTableAdapter.GetDataByAttributeId(attributeTypeId).FirstOrDefault();
            }
        }

        /// <summary>
        /// Liefert alle Attribute zurück, die zu einer Gruppe gehören
        /// </summary>
        /// <param name="groupId">Guid der Attributgruppe</param>
        /// <returns></returns>
        public static CMDBDataSet.GroupAttributeTypeMappingsDataTable SelectByGroup(Guid groupId)
        {
            using (CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter groupAttributeTypeMappingsTableAdapter = new CMDBDataSetTableAdapters.GroupAttributeTypeMappingsTableAdapter())
            {
                return groupAttributeTypeMappingsTableAdapter.GetDataByGroup(groupId);
            }
        }
    }
}
