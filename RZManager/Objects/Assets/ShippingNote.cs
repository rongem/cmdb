using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class ShippingNote : Asset
    {
        public int SupplierId { get; set; }
        public DateTime ShipmentDate { get; set; }
        public int AttachmentId { get; set; }
        public string AttachmentFileName { get; set; }
        public byte[] AttachmentContent { get; set; }
    }
}
