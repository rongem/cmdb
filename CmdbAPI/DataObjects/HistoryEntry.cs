using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataObjects
{
    /// <summary>
    /// Veränderungseintrag
    /// </summary>
    public class HistoryEntry
    {
        /// <summary>
        /// Zeitpunkt der Änderung
        /// </summary>
        public DateTime DateTime { get; set; }

        /// <summary>
        /// Betreff der Änderung
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Ausführliche Beschreibung der Änderung
        /// </summary>
        public string Text { get; set; }
    }
}
