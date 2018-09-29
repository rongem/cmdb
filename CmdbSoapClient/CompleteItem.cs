using CmdbClient.CmsService;
using System;
using System.Collections.Generic;

namespace CmdbClient
{
    /// <summary>
    /// Gibt ein Configuration Item mit allen Attributen und Verbindungen zurück
    /// </summary>
    public class CompleteItem
    {
        /// <summary>
        /// Das Configuration Item
        /// </summary>
        public ConfigurationItem ConfigurationItem { get; set; }
        /// <summary>
        /// Alle Attribute
        /// </summary>
        public IEnumerable<ItemAttribute> Attributes { get; set; }
        /// <summary>
        /// Alle Verbindungen nach unten
        /// </summary>
        public IEnumerable<Connection> ConnectionsToLower { get; set; }
        /// <summary>
        /// Alle Verbindungen nach oben
        /// </summary>
        public IEnumerable<Connection> ConnectionsToUpper { get; set; }
    }
}
