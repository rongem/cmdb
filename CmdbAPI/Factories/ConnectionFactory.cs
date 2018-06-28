using CmdbAPI.TransferObjects;
using CmdbAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.Factories
{
    public static class ConnectionFactory
    {
        /// <summary>
        /// Erzeugt ein Connection-Objekt aus einer ConnectionsRow
        /// </summary>
        /// <param name="cr">Datensatz, der konvertiert werden soll</param>
        /// <returns></returns>
        public static Connection CreateConnectionTransferObject(CMDBDataSet.ConnectionsRow cr)
        {
            return new Connection() {
                ConnId = cr.ConnId,
                ConnUpperItem = cr.ConnUpperItem,
                ConnType = cr.ConnType,
                ConnLowerItem = cr.ConnLowerItem,
                RuleId = cr.ConnectionRuleId,
                Description = cr.ConnDescription,
            };
        }

        /// <summary>
        /// Liefert alle Connections aus der Datenbank zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Connection> GetAllConnections()
        {
            foreach (CMDBDataSet.ConnectionsRow cr in DataAccess.Connections.SelectAll())
            {
                yield return CreateConnectionTransferObject(cr);
            }
        }
    }
}
