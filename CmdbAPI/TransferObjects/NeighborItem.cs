using System;
using System.Runtime.Serialization;

namespace CmdbAPI.TransferObjects
{
    [Serializable]
    [DataContract]
    /// <summary>
    /// Configuration Item mit einer Verbindung zum aktuellen Item, wobei die Verbindung über mehrere Stationen bestehen kann
    /// </summary>
    public class NeighborItem
    {
        [DataMember]
        /// <summary>
        /// Anzahl der Hops vom aktuellen Item bis zum Nachbar-Item
        /// </summary>
        public int Level { get; set; }

        [DataMember]
        /// <summary>
        /// DataRow-Objekt des Nachbar-Items
        /// </summary>
        public ConfigurationItem Item { get; set; }

        [DataMember]
        /// <summary>
        /// Pfad zum Nachbar-Item (d. h. die Namen aller Zwischenstationen, jeweils mit einem Trennzeichen getrennt.
        /// </summary>
        public string Path { get; set; }
    }
}