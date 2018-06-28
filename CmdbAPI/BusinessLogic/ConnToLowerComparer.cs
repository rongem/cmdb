using CmdbAPI.TransferObjects;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CmdbAPI.BusinessLogic
{
    /// <summary>
    /// Vergleicht, ob der Typ und das untere Configuration Item in Verbindungen identisch sind
    /// </summary>
    public class ConnToLowerComparer : IEqualityComparer<Connection>
    {
        public ConnToLowerComparer()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        public bool Equals(Connection x, Connection y)
        {
            return (x.ConnType.Equals(y.ConnType) && x.ConnLowerItem.Equals(y.ConnLowerItem));
        }

        public int GetHashCode(Connection obj)
        {
            return obj.ConnType.GetHashCode() ^ obj.ConnLowerItem.GetHashCode();
        }
    }
}