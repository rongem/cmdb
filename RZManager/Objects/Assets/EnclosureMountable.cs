using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects.Assets
{
    public abstract class EnclosureMountable : Asset
    {
        /// <summary>
        /// Verbindung zum Enclosure
        /// </summary>
        public Connection ConnectionToEnclosure { get; set; }

        /// <summary>
        /// Slot, gibt den Minimum-Slot-Wert der Verbindung zurück
        /// </summary>
        public int Slot { get { return ConnectionToEnclosure == null ? 0 : ConnectionToEnclosure.MinSlot; } }
    }
}
