using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class ServiceContract : Asset
    {
        public string SupplierName { get; set; }
        public string SupplierReference { get; set; }
        public string Remarks { get; set; }
        public DateTime BeginningDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public List<Guid> ConnectionsIds { get; private set; } = new List<Guid>();
        public int ConnectionCount { get { return ConnectionsIds.Count; } }
    }
}
