using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RZManager.Objects
{
    public class EnclosureType : EnclosureTypeTemplate
    {
        /// <summary>
        /// Name der Vorlage aus der Konfigurationdatei. Ist identisch mit der Name-Eigenschaft, wenn in der Konfigurationsdatei ein Eintrag gefunden wurde, sonst steht hier "Default"
        /// </summary>
        public string TemplateName { get; set; }

        /// <summary>
        /// Anzahl der Höheneinheiten, die das Enclosre im Rack benötigt
        /// </summary>
        public int HeightUnits { get; set; }
    }
}
