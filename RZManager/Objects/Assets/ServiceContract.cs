using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class ServiceContract : Asset
    {
        public int SupplierId { get; set; }
        public string SupplierReference { get; set; }
        public string Remarks { get; set; }
        public DateTime BeginningDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public List<int> AttachmentIds { get; private set; } = new List<int>();
        public List<int> ConnectionsIds { get; private set; } = new List<int>();
        public int AttachmentCount { get { return AttachmentIds.Count; } }
        public int ConnectionCount { get { return ConnectionsIds.Count; } }
    }
}
