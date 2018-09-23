using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class ShippingNote : Asset
    {
        public string Supplier { get; set; }
        public DateTime ShipmentDate { get; set; }
    }
}
