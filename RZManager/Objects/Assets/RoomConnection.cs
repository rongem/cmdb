using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public class RoomConnection
    {
        public Guid id;
        public Rack Rack;
        public Room Room;
        public Guid ConnectionType;
    }
}
