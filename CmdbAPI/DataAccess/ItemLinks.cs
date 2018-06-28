using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    public static class ItemLinks
    {
        /// <summary>
        /// Erstellt einen neuen ItemLink-Datensatz
        /// </summary>
        /// <param name="LinkId">Guid des Link</param>
        /// <param name="itemId">Guid des zugehörigen Items</param>
        /// <param name="LinkURI">Zieladresse des Link</param>
        /// <param name="LinkDescription">Beschreibung des Link</param>
        public static void Insert(Guid LinkId, Guid itemId, string LinkURI, string LinkDescription)
        {
            using (CMDBDataSetTableAdapters.ItemLinksTableAdapter itemLinksTableAdapter = new CMDBDataSetTableAdapters.ItemLinksTableAdapter())
            {
                itemLinksTableAdapter.Insert(LinkId, itemId, LinkURI, LinkDescription);
            }
        }

        /// <summary>
        /// Ändert einen bestehenden Link
        /// </summary>
        /// <param name="LinkId">Guid des Link (kann nicht geändert werden</param>
        /// <param name="itemId">Guid des zugehörigen Items (kann nicht geändert werden)</param>
        /// <param name="LinkURI">Zieladresse des Link</param>
        /// <param name="LinkDescription">Beschreibung des Link</param>
        /// <param name="Original_LinkURI">Bisherige Zieladresse des Link</param>
        /// <param name="Original_LinkDescription">Bisherige Beschreibung des Link</param>
        public static void Update(Guid LinkId, Guid itemId, string LinkURI, string LinkDescription, string Original_LinkURI, string Original_LinkDescription)
        {
            using (CMDBDataSetTableAdapters.ItemLinksTableAdapter itemLinksTableAdapter = new CMDBDataSetTableAdapters.ItemLinksTableAdapter())
            {
                itemLinksTableAdapter.Update(LinkURI, LinkDescription, LinkId, itemId, Original_LinkURI, Original_LinkDescription);
            }
        }

        /// <summary>
        /// Löscht einen bestehenden ItemLink-Datensatz
        /// </summary>
        /// <param name="LinkId">Guid des Link</param>
        /// <param name="itemId">Guid des zugehörigen Items</param>
        /// <param name="LinkURI">Zieladresse des Link</param>
        /// <param name="LinkDescription">Beschreibung des Link</param>
        public static void Delete(Guid LinkId, Guid itemId, string LinkURI, string LinkDescription)
        {
            using (CMDBDataSetTableAdapters.ItemLinksTableAdapter itemLinksTableAdapter = new CMDBDataSetTableAdapters.ItemLinksTableAdapter())
            {
                itemLinksTableAdapter.Delete(LinkId, itemId, LinkURI, LinkDescription);
            }
        }

        /// <summary>
        /// Gibt alle ItemLinks zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.ItemLinksDataTable SelectAll()
        {
            using (CMDBDataSetTableAdapters.ItemLinksTableAdapter itemLinksTableAdapter = new CMDBDataSetTableAdapters.ItemLinksTableAdapter())
            {
                return itemLinksTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt einen ItemLink zurück
        /// </summary>
        /// <param name="id">Guid des ItemLink</param>
        /// <returns></returns>
        public static CMDBDataSet.ItemLinksRow SelectOne(Guid id)
        {
            using (CMDBDataSetTableAdapters.ItemLinksTableAdapter itemLinksTableAdapter = new CMDBDataSetTableAdapters.ItemLinksTableAdapter())
            {
                return itemLinksTableAdapter.GetDataById(id).FindByLinkId(id);
            }
        }

        /// <summary>
        /// Gibt alle Links für ein ConfigurationItem zurück
        /// </summary>
        /// <param name="itemId">Guid des Items, dessen Links angezeigt werden</param>
        /// <returns>ItemLinksDataTable</returns>
        public static CMDBDataSet.ItemLinksDataTable SelectForItem(Guid itemId)
        {
            using (CMDBDataSetTableAdapters.ItemLinksTableAdapter itemLinksTableAdapter = new CMDBDataSetTableAdapters.ItemLinksTableAdapter())
            {
                return itemLinksTableAdapter.GetItemLinksForItem(itemId);
            }
        }

    }
}
