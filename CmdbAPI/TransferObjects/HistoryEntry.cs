using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.TransferObjects
{
    /// <summary>
    /// Veränderungseintrag
    /// </summary>
    [Serializable]
    [DataContract]
    public class HistoryEntry
    {
        /// <summary>
        /// Zeitpunkt der Änderung
        /// </summary>
        [DataMember]
        public string DateTime { get; set; }

        /// <summary>
        /// Betreff der Änderung
        /// </summary>
        [DataMember]
        public string Subject { get; set; }

        /// <summary>
        /// Ausführliche Beschreibung der Änderung
        /// </summary>
        [DataMember]
        public string Text { get; set; }

        /// <summary>
        /// Verantwortlicher für die Durchführung
        /// </summary>
        [DataMember]
        public string Responsible { get; set; }
    }
}
