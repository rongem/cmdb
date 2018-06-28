using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Stellt alle Methoden zum Zugriff auf Attributtypen
    /// </summary>
    public static class AttributeTypes
    {
        /// <summary>
        /// Speichert einen neuen AttributeType-Datensatz
        /// </summary>
        /// <param name="id">ID des Datensatzes</param>
        /// <param name="name">Name</param>
        public static void Insert(Guid id, string name)
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                attributeTypesTableAdapter.Insert(id, name);
            }
        }

        /// <summary>
        /// Speichert einen aktualisierten AttributeType-Datensatz in die Datenbank
        /// </summary>
        /// <param name="r">Veränderter Datensatz</param>
        public static void Update(CMDBDataSet.AttributeTypesRow r)
        {
            if (r == null)
                throw new Exception("Kein Datensatz angegeben");
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                attributeTypesTableAdapter.Update(r);
            }
        }

        /// <summary>
        /// Löscht einen vorhandenen AttributeType-Datensatz
        /// </summary>
        /// <param name="id">ID des Datensatzes</param>
        /// <param name="name">Name des Datensatzes</param>
        public static void Delete(Guid id, string name)
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                attributeTypesTableAdapter.Delete(id, name);
            }
        }

        /// <summary>
        /// Gibt eine Tabelle mit allen zu einer Gruppe gehörigen AttributeTypes zurück
        /// </summary>
        /// <param name="groupId">GUID der Gruppe, nach der gesucht wird</param>
        public static CMDBDataSet.AttributeTypesDataTable GetForGroup(Guid groupId)
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                return attributeTypesTableAdapter.GetGroupedByGroupId(groupId);
            }
        }

        /// <summary>
        /// Gibt eine Tabelle mit allen nicht zu einer Gruppe gehörigen AttributeTypes zurück
        /// </summary>
        public static CMDBDataSet.AttributeTypesDataTable GetUngrouped()
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                return attributeTypesTableAdapter.GetUngrouped();
            }
        }

        /// <summary>
        /// Gibt eine Tabelle mit allen Attributtypen zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.AttributeTypesDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                return attributeTypesTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt einen Attributtypen zurück, der die angegebene ID besitzt
        /// </summary>
        /// <param name="id">Guid des Attributtypen</param>
        /// <returns></returns>
        public static CMDBDataSet.AttributeTypesRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                return attributeTypesTableAdapter.GetDataById(id).FindByAttributeTypeId(id);
            }
        }

        /// <summary>
        /// Gibt einen Attributtypen zurück, der dem angegebenen Namen entspricht
        /// </summary>
        /// <param name="typeName">Name des gesuchten Attributtypen</param>
        /// <returns></returns>
        public static CMDBDataSet.AttributeTypesRow SelectByName(string typeName)
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                return attributeTypesTableAdapter.GetDataByName(typeName).FirstOrDefault();
            }
        }

        /// <summary>
        /// Gibt alle Attributtypen für einen Item-Typen mit den Mengenangaben aus der AttributGruppe zurück
        /// </summary>
        /// <param name="itemTypeId">Guid des ItemTyps</param>
        public static CMDBDataSet.AttributeTypesDataTable SelectForItemType(Guid itemTypeId)
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                return attributeTypesTableAdapter.GetDataByItemType(itemTypeId);
            }
        }

        /// <summary>
        /// Gibt alle Attributtypen zurück, deren Attribute innerhalb der Configuration Items identische Werte zu jeweiligen Wert der Attribute des angegebenen Attributtypen besitzen.
        /// </summary>
        /// <param name="attributeTypeId">Guid des AttributTyps</param>
        public static CMDBDataSet.AttributeTypesDataTable SelectForCorrespondingValuesToAttributeType(Guid attributeTypeId)
        {
            using (CMDBDataSetTableAdapters.AttributeTypesTableAdapter attributeTypesTableAdapter = new CMDBDataSetTableAdapters.AttributeTypesTableAdapter())
            {
                return attributeTypesTableAdapter.GetDataByCorrespondingValuesForType(attributeTypeId);
            }
        }

    }
}
