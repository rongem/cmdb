using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataObjects
{
    /// <summary>
    /// Transferobjekt für Verbindungen zwischen Configuration Items
    /// </summary>
    public class ConnectionExtender : TransferObjects.Connection
    {
        #region Eigenschaften

        private ConfigurationItem connectedUpperItem;

        public ConfigurationItem ConnectedUpperItem
        {
            get { return connectedUpperItem; }
            set { connectedUpperItem = value; }
        }

        private ConfigurationItem connectedLowerItem;

        public ConfigurationItem ConnectedLowerItem
        {
            get { return connectedLowerItem; }
            set { connectedLowerItem = value; }
        }

        #endregion

        #region Konstruktoren

        public ConnectionExtender() { }

        public ConnectionExtender(CMDBDataSet.ConnectionsRow r)
        {
            ConnId = r.ConnId;
            ConnType = r.ConnType;
            ConnUpperItem = r.ConnUpperItem;
            ConnLowerItem = r.ConnLowerItem;
            ConnectedUpperItem = new ConfigurationItem() { ItemId = r.ConnUpperItem };
            ConnectedLowerItem = new ConfigurationItem() { ItemId = r.ConnLowerItem };
            RuleId = r.ConnectionRuleId;
        }

        public ConnectionExtender(CmdbAPI.TransferObjects.Connection conn)
        {
            ConnId = conn.ConnId;
            ConnType = conn.ConnType;
            ConnectedUpperItem = new ConfigurationItem() { ItemId = conn.ConnUpperItem };
            ConnectedLowerItem = new ConfigurationItem() { ItemId = conn.ConnLowerItem };
            RuleId = conn.RuleId;
        }

        #endregion

        /// <summary>
        /// Wandelt die Connection in eine CmdbDataObjects.Connection um.
        /// </summary>
        /// <returns>CmdbDataObjects.Connection</returns>
        public TransferObjects.Connection GetTransferObject()
        {
            return this;
        }

        /// <summary>
        /// Konvertiert eine Liste von Connections in CmdbDataObjects.Connections
        /// </summary>
        /// <param name="collection">Liste der Connections</param>
        /// <returns></returns>
        public static IEnumerable<TransferObjects.Connection> ConvertConnectionsToTransferObjects(IEnumerable<ConnectionExtender> collection)
        {
            foreach (ConnectionExtender conn in collection)
            {
                yield return conn.GetTransferObject();
            }
        }

        /// <summary>
        /// Konvertiert eine Liste von CmdbDataObjects.Connections in Connections
        /// </summary>
        /// <param name="collection">Liste der CmdbDataObjects.Connections</param>
        /// <returns></returns>
        public static IEnumerable<ConnectionExtender> CreateConnectionsFromTransferObjects(IEnumerable<CmdbAPI.TransferObjects.Connection> collection)
        {
            foreach (CmdbAPI.TransferObjects.Connection conn in collection)
            {
                yield return new DataObjects.ConnectionExtender(conn);
            }
        }
    }
}
