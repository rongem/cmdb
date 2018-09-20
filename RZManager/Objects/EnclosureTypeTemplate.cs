using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects
{
    public class EnclosureTypeTemplate
    {
        /// <summary>
        /// Bezeichnung des Enclosure-Typs
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Vertikale Anzahl der Slots für Server
        /// </summary>
        public int ServerCountVertical { get; set; }

        /// <summary>
        /// Horizontale Anzahl der Slots für Server
        /// </summary>
        public int ServerCountHorizontal { get; set; }

        /// <summary>
        /// Vertikale Anzahl der Slots für Interconnects
        /// </summary>
        public int InterconnectCountVertical { get; set; }

        /// <summary>
        /// Horizontale Anzahl der Slots für Interconnects
        /// </summary>
        public int InterconnectCountHorizontal { get; set; }

        /// <summary>
        /// Vertikale Anzahl der Slots für InterFrameLinks
        /// </summary>
        //public int InterFrameLinkCountVertical { get; set; }

        /// <summary>
        /// Horizontale Anzahl der Slots für InterFrameLinks
        /// </summary>
        //public int InterFrameLinkCountHorizontal { get; set; }

        /// <summary>
        /// Vertikale Anzahl der Slots für Appliances zur Verwaltung
        /// </summary>
        public int ApplianceCountVertical { get; set; }

        /// <summary>
        /// Horizontale Anzahl der Slots für Appliances zur Verwaltung
        /// </summary>
        public int ApplianceCountHorizontal { get; set; }

    }
}
