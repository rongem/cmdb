using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    /// <summary>
    /// Stellt alle Methoden zum Datenzugriff auf ItemTypen bereit
    /// </summary>
    public static class ItemTypes
    {
        /// <summary>
        /// Gibt die Anzahl der vorhandenen Item-Typen zurück
        /// </summary>
        /// <returns></returns>
        public static int GetCount()
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queryTablesAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                return (int)queryTablesAdapter.ItemTypes_GetCount();
            }
        }
        /// <summary>
        /// Löscht einen existierenden ItemType-Datensatz
        /// </summary>
        /// <param name="typeId">GUID des ItemType</param>
        /// <param name="typeName">Bezeichnung des ItemType</param>
        public static void Delete(Guid typeId, string typeName)
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                itemTypesTableAdapter.Delete(typeId, typeName);
            }
        }

        /// <summary>
        /// Speichert einen geänderten ItemType-Datensatz
        /// </summary>
        /// <param name="r">Geänderter Datensatz des ItemType</param>
        public static void Update(CMDBDataSet.ItemTypesRow r)
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                itemTypesTableAdapter.Update(r);
            }
        }

        /// <summary>
        /// Fügt einen neuen ItemType-Datensatz hinzu
        /// </summary>
        /// <param name="typeId">GUID des ItemType</param>
        /// <param name="typeName">Bezeichnung des ItemType</param>
        public static void Insert(Guid typeId, string typeName, string backColor)
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                itemTypesTableAdapter.Insert(typeId, typeName, backColor);
            }
        }

        /// <summary>
        /// Liefert alle ItemTypen zurück
        /// </summary>
        public static CMDBDataSet.ItemTypesDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                return itemTypesTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Liefert einen ItemTypen zurück
        /// </summary>
        /// <param name="id">Guid des gesuchten Itemtyps</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemTypesRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                return itemTypesTableAdapter.GetDataById(id).FindByTypeId(id);
            }
        }

        /// <summary>
        /// Liefert einen Attributtypen zurück, der dem angegebenen Namen entspricht
        /// </summary>
        /// <param name="typeName">Name des Attributtypen</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemTypesRow SelectByName(string typeName)
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                return itemTypesTableAdapter.GetDataByName(typeName).FirstOrDefault();
            }
        }

        /// <summary>
        /// Liefert alle ItemTypen zurück, den ein angegebener AttributTyp zugeordnet werden kann
        /// </summary>
        /// <param name="attributeTypeId">Guid des Attributtypen</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemTypesDataTable SelectByAllowedAttributeType(Guid attributeTypeId)
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                return itemTypesTableAdapter.GetDataByAllowedAttributeType(attributeTypeId);
            }
        }

        /// <summary>
        /// Gibt eine Liste mit ItemTypes zurück, die bei einem gegebenen oberen ItemType und einem ConnectionType erlaubt sind
        /// </summary>
        /// <param name="itemUpperType">Oberer ItemType</param>
        /// <param name="connType">ConnectionType</param>
        /// <returns>Liste</returns>
        public static CMDBDataSet.ItemTypesDataTable GetLowerItemTypeForUpperItemTypeAndConnectionType(Guid itemUpperType, Guid connType)
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                return itemTypesTableAdapter.GetDataByConnectionForItemUpperTypeAndConnType(itemUpperType, connType);
            }
        }

        /// <summary>
        /// Gibt eine LIste mit ItemTypes zurück, die bei einem gegebenen unteren ItemType und einem ConnectionType erlaubt sind
        /// </summary>
        /// <param name="itemLowerType">Unterer ItemType</param>
        /// <param name="connType">ConnectionType</param>
        /// <returns>Liste</returns>
        public static CMDBDataSet.ItemTypesDataTable GetUpperItemTypeForLowerItemTypeAndConnectionType(Guid itemLowerType, Guid connType)
        {
            using (CMDBDataSetTableAdapters.ItemTypesTableAdapter itemTypesTableAdapter = new CMDBDataSetTableAdapters.ItemTypesTableAdapter())
            {
                return itemTypesTableAdapter.GetDataByConnectionForItemLowerTypeAndConnType(itemLowerType, connType);
            }
        }

    }
}
