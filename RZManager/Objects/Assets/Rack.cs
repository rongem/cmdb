using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class Rack : Asset
    {
        public int MaxHeight { get; set; }
        public RoomConnection ConnectionToRoom { get; set; }
    }
}
