using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataObjects
{
    /// <summary>
    /// Transferobjekt für Configuration Items
    /// </summary>
    public class ConfigurationItemExtender
    {

        #region Eigenschaften

        public string FullName
        {
            get { return string.Format("{0}: {1}", ConfigurationItem.TypeName, ConfigurationItem.ItemName); }
        }

        private List<ConnectionExtender> connections = new List<ConnectionExtender>();

        private ConfigurationItem item;

        public ConfigurationItem ConfigurationItem
        {
            get { return item; }
        }

        public List<ConnectionExtender> Connections
        {
            get { return connections; }
        }

        public IEnumerable<ConnectionExtender> DownwardConnections
        {
            get { return connections.Where(c => c.ConnectedUpperItem.ItemId.Equals(this.ConfigurationItem.ItemId)); }
        }

        public IEnumerable<ConnectionExtender> UpwardConnections
        {
            get { return connections.Where(c => c.ConnectedLowerItem.ItemId.Equals(this.ConfigurationItem.ItemId)); }
        }

        #endregion

        /// <summary>
        /// Konvertiert eine Liste von ConfigurationItems in die zugehörigen Transferobjekte
        /// </summary>
        /// <param name="collection">Liste der ConfigurationItems</param>
        /// <returns></returns>
        public static IEnumerable<ConfigurationItem> ConvertConfigurationItemsToTransferObjects(IEnumerable<ConfigurationItemExtender> collection)
        {
            foreach (ConfigurationItemExtender item in collection)
            {
                yield return item.ConfigurationItem;
            }
        }

        #region Konstruktoren

        public ConfigurationItemExtender() { }

        public ConfigurationItemExtender(CMDBDataSet.ConfigurationItemsRow r)
        {
            if (r == null)
                return;
            item = new ConfigurationItem()
            {
                ItemId = r.ItemId,
                ItemType = r.ItemType,
                TypeName = r.TypeName,
                ItemName = r.ItemName,
                ItemLastChange = r.ItemLastChange.Ticks - Constants.ticksDifference,
                ItemVersion = r.ItemVersion,
            };
        }

        public ConfigurationItemExtender(Guid newItemId, Guid itemTypeId, string itemTypeName, string newItemName)
        {
            item = new ConfigurationItem()
            {
                ItemId = newItemId,
                ItemName = newItemName,
                ItemType = itemTypeId,
                TypeName = itemTypeName,
                ItemLastChange = DateTime.Now.Ticks - Constants.ticksDifference,
                ItemVersion = 0,
            };
        }

        #endregion
    }
}
