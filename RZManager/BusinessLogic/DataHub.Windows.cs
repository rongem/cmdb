using RZManager.HardwareWindows.Blades;
using RZManager.HardwareWindows.Racks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.BusinessLogic
{
    public partial class DataHub
    {
        /// <summary>
        /// Verwaltet die Fenster, die zu einem Rack geöffnet werden.
        /// </summary>
        public Dictionary<Guid, RackWindow> RackWindows { get; } = new Dictionary<Guid, RackWindow>();

        /// <summary>
        /// Verwaltet die Fenster, die zu einem Enclosre geöffnet werden.
        /// </summary>
        public Dictionary<Guid, EnclosureWindow> EnclosureWindows { get; } = new Dictionary<Guid, EnclosureWindow>();

        /// <summary>
        /// Verwaltet das Fesnter, das zur Eingabe von Enclosure-Typen verwendet wird
        /// </summary>
        public EnclosureTypesWindow EnclosureTypesWindow { get; set; }

    }
}
