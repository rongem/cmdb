using CmdbAPI.DataObjects;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.BusinessLogic
{
    public class SearchItems
    {
        private IEnumerable<ConfigurationItemExtender> items;
        private IEnumerable<ItemAttribute> attributes;
        private IEnumerable<Connection> connections;
        private IEnumerable<ItemResponsibility> responsibilites;

        #region Konstruktoren
        /// <summary>
        /// Konstruktor
        /// </summary>
        /// <param name="withAttributes">Gibt an, ob die Suche mit Attributen stattfindet</param>
        /// <param name="withConnections">Gibt an, ob auch Verbindungen durchsucht werden</param>
        /// <param name="withResponsibilities">Gibt an, ob Verantwortlichkeiten durchsucht werden</param>
        private SearchItems(bool withAttributes, bool withConnections, bool withResponsibilities)
        {
            // Alle Items laden, in Objekte verwandeln und mit Attributen versehen
            items = Factories.ConfigurationItemFactory.GetAllItems(withConnections, withResponsibilities);
            if (withAttributes)
                attributes = Factories.ItemAttributeFactory.GetAllAttributes();
            if (withConnections)
                connections = Factories.ConnectionFactory.GetAllConnections();
            if (withResponsibilities)
                responsibilites = Factories.ResponsibilityFactory.GetAllResponsibilites();
        }

        #endregion

        #region Filterfunktionen

        /// <summary>
        /// Filtert nach dem Typ des Configuration Item
        /// </summary>
        /// <param name="itemType">GUID des Itemtyps</param>
        public void FilterByItemType(Guid itemType)
        {
            items = items.Where(i => i.ConfigurationItem.ItemType.Equals(itemType)).ToList();
        }

        /// <summary>
        /// Filtert nach einem String im Namen oder einem Attributwert
        /// </summary>
        /// <param name="Value">Teilstring, nach dem gesucht wird</param>
        public void FilterByNameOrAttribute(string Value)
        {
            if (attributes == null)
                throw new Exception("Wenn die Suche nicht mit Attributen initialisiert wird, kann auch nicht nach Attributen gesucht werden.");
            if (Value.StartsWith("!"))
                items = items.Where(i => i.ConfigurationItem.ItemName.IndexOf(Value.Substring(1), StringComparison.CurrentCultureIgnoreCase) < 0 &&
                    attributes.Where(a => a.ItemId.Equals(i.ConfigurationItem.ItemId) && a.AttributeValue.IndexOf(Value.Substring(1), StringComparison.CurrentCultureIgnoreCase) >= 0).Count() == 0).ToList();
            else
                items = items.Where(i => i.ConfigurationItem.ItemName.IndexOf(Value, StringComparison.CurrentCultureIgnoreCase) >= 0 ||
                    attributes.Where(a => a.ItemId.Equals(i.ConfigurationItem.ItemId) && a.AttributeValue.IndexOf(Value, StringComparison.CurrentCultureIgnoreCase) >= 0).Count() > 0).ToList();
        }

        /// <summary>
        /// Filtert nach einem Attribut eines bestimmten Typs, der einen Attributwert enthält
        /// </summary>
        /// <param name="attributeType">Guid des Attributtyps</param>
        /// <param name="attributeValue">Teilstring, nach dem gesucht wird</param>
        public void FilterByAttributeTypeAndValue(Guid attributeType, string attributeValue)
        {
            if (attributes == null)
                throw new Exception("Wenn die Suche nicht mit Attributen initialisiert wird, kann auch nicht nach Attributen gesucht werden.");
            if (string.IsNullOrWhiteSpace(attributeValue)) // auf nicht vorhandene Attribute prüfen
                items = items.Where(i => attributes.Where(a => a.ItemId.Equals(i.ConfigurationItem.ItemId) && a.AttributeTypeId.Equals(attributeType)).Count() == 0).ToList();
            else if (attributeValue.Equals("!")) // ! am Anfang bedeutet die Umkehrung der Suche: Attribut muss vorhanden sein
                items = items.Where(i => attributes.Where(a => a.ItemId.Equals(i.ConfigurationItem.ItemId) && a.AttributeTypeId.Equals(attributeType)).Count() > 0).ToList();
            else if (attributeValue.StartsWith("!")) // ! am Anfang bedeutet die Umkehrung der Suche: finde alle Attribute des angegebenen Typs, die nicht den Text enthalten
                items = items.Where(i => attributes.Where(a => a.ItemId.Equals(i.ConfigurationItem.ItemId) && a.AttributeTypeId.Equals(attributeType) && a.AttributeValue.IndexOf(attributeValue.Substring(1), StringComparison.CurrentCultureIgnoreCase) >= 0).Count() == 0).ToList();
            else // Finde alle Attribute des angegebenen Typs, die den Text enthalten
                items = items.Where(i => attributes.Where(a => a.ItemId.Equals(i.ConfigurationItem.ItemId) && a.AttributeTypeId.Equals(attributeType) && a.AttributeValue.IndexOf(attributeValue, StringComparison.CurrentCultureIgnoreCase) >= 0).Count() > 0).ToList();
        }

        /// <summary>
        /// Filtert nach einem Attribut eines bestimmten Typs, der einen Attributwert enthält
        /// </summary>
        /// <param name="attributeType">Name des Attributtyps</param>
        /// <param name="attributeValue">Teilstring, nach dem gesucht wird</param>
        public void FilterByAttributeTypeAndValue(string attributeType, string attributeValue)
        {
            if (attributes == null)
                throw new Exception("Wenn die Suche nicht mit Attributen initialisiert wird, kann auch nicht nach Attributen gesucht werden.");
            items = items.Where(i => attributes.Where(a => a.ItemId.Equals(i.ConfigurationItem.ItemId) && a.AttributeTypeName.Equals(attributeType, StringComparison.CurrentCulture) && a.AttributeValue.IndexOf(attributeValue, StringComparison.CurrentCultureIgnoreCase) >= 0).Count() > 0).ToList();
        }

        /// <summary>
        /// Filtert nach einen abwärts gerichteten Verbindungstyp, wobei alle erlaubten unteren ItemTypen akzeptiert werden.
        /// </summary>
        /// <param name="connectionType">GUID des Verbindungstyps</param>
        /// <param name="count">Anzahl (0 oder 1) bzw. symbolischer Wert (1+ oder 2+)</param>
        public void FilterByDownwardConnectionType(Guid connectionType, string count)
        {
            if (connections == null)
                throw new Exception("Wenn die Suche nicht mit Verbindungen initialisiert wird, kann auch nicht nach Verbindungen gesucht werden.");
            items = items.Where(i => isConnectionCountCorrect(i.DownwardConnections.Where(c => c.ConnType.Equals(connectionType)), count)).ToList();
        }

        /// <summary>
        /// Filtert nach einen abwärts gerichteten Verbindungstyp und zugehörigen unteren ItemTyp
        /// </summary>
        /// <param name="connectionType">GUID des Verbindungstyps</param>
        /// <param name="lowerItemType">GUID des unteren Itemtyps</param>
        /// <param name="count">Anzahl (0 oder 1) bzw. symbolischer Wert (1+ oder 2+)</param>
        public void FilterByDownwardConnectionType(Guid connectionType, Guid lowerItemType, string count)
        {
            items = items.Where(i => isConnectionCountCorrect(i.DownwardConnections.Where(c => c.ConnType.Equals(connectionType) && c.ConnectedLowerItem.ItemType.Equals(lowerItemType)), count)).ToList();
        }

        /// <summary>
        /// Filtert nach einen aufwärts gerichteten Verbindungstyp, wobei alle erlaubten oberen ItemTypen akzeptiert werden.
        /// </summary>
        /// <param name="connectionType">GUID des Verbindungstyps</param>
        /// <param name="count">Anzahl (0 oder 1) bzw. symbolischer Wert (1+ oder 2+)</param>
        public void FilterByUpwardConnectionType(Guid connectionType, string count)
        {
            items = items.Where(i => isConnectionCountCorrect(i.UpwardConnections.Where(c => c.ConnType.Equals(connectionType)), count)).ToList();
        }

        /// <summary>
        /// Filtert nach einen aufwärts gerichteten Verbindungstyp und zugehörigen oberen ItemTyp
        /// </summary>
        /// <param name="connectionType">GUID des Verbindungstyps</param>
        /// <param name="upperItemType">GUID des oberen Itemtyps</param>
        /// <param name="count">Anzahl (0 oder 1) bzw. symbolischer Wert (1+ oder 2+)</param>
        public void FilterByUpwardConnectionType(Guid connectionType, Guid upperItemType, string count)
        {
            items = items.Where(i => isConnectionCountCorrect(i.UpwardConnections.Where(c => c.ConnType.Equals(connectionType) && c.ConnectedUpperItem.ItemType.Equals(upperItemType)), count)).ToList();
        }

        /// <summary>
        /// Filtert nach Verantwortlichen Personen
        /// </summary>
        /// <param name="userName">Benutzername, nach dem gesucht wird</param>
        public void FilterByResponsiblePersons(string userName)
        {
            items = items.Where(i => i.ConfigurationItem.ResponsibleUsers.Where(u => u.Equals(userName, StringComparison.CurrentCultureIgnoreCase)).Count() == 1).ToList();
        }

        #endregion

        /// <summary>
        /// Gibt die gefilterte Liste von Configuration Items zurück.
        /// </summary>
        public IEnumerable<ConfigurationItemExtender> MatchingConfigurationItems
        {
            get { return items.OrderBy(a => a.FullName); }
        }

        #region Hilfsfunktionen

        /// <summary>
        /// Überprüft, ob die Anzahl der Verbindungen dem angegebenen symbolischen Wert entspricht
        /// </summary>
        /// <param name="connections">Verbindung</param>
        /// <param name="count">Wie viele Verbindungen sollen vorhanden sein</param>
        /// <returns></returns>
        private bool isConnectionCountCorrect(IEnumerable<CmdbAPI.DataObjects.ConnectionExtender> connections, string count)
        {
            switch (count)
            {
                case "0":
                case "1":
                    return connections.Count() == int.Parse(count);
                case "1+":
                    return connections.Count() > 0;
                case "2+":
                    return connections.Count() > 1;
                default:
                    return false;
            }
        }

        #endregion

        #region Statische Suchfunktion

        /// <summary>
        /// Führt eine vollständige Suche mit einem Suchobjekt durch
        /// </summary>
        /// <param name="search">Suchobjekt</param>
        /// <returns></returns>
        public static IEnumerable<ConfigurationItemExtender> Search(Search search)
        {
            AssertConnectionsOnlyWithItemType(search);
            if (string.IsNullOrWhiteSpace(search.NameOrValue) && search.ItemType == null && search.Attributes == null && string.IsNullOrWhiteSpace(search.ResponsibleToken))
                throw new ArgumentException("Es muss mindestens ein Suchkriterium angegeben werden.");
            SearchItems si = new SearchItems(true, search.ConnectionsToLower != null || search.ConnectionsToUpper != null, !string.IsNullOrWhiteSpace(search.ResponsibleToken));
            if (!string.IsNullOrWhiteSpace(search.NameOrValue)) // Nach Namen oder Attribut-Wert filtern
                si.FilterByNameOrAttribute(search.NameOrValue);
            if (search.ItemType != null) // Nach Typ filtern
            {
                si.FilterByItemType((Guid)search.ItemType);
                if (search.ConnectionsToLower != null) // Verbindungen abwärts suchen (nur für ItemTyp)
                {
                    foreach (Search.SearchConnection conn in search.ConnectionsToLower)
                    {
                        AssertSearchConnection(conn);
                        if (conn.ConfigurationItemType == null)
                            si.FilterByDownwardConnectionType(conn.ConnectionType, conn.Count);
                        else
                            si.FilterByDownwardConnectionType(conn.ConnectionType, (Guid)conn.ConfigurationItemType, conn.Count);
                    }
                }
                if (search.ConnectionsToUpper != null) // Verbindungen aufwärts suchen (nur für ItemTyp)
                {
                    foreach (Search.SearchConnection conn in search.ConnectionsToUpper)
                    {
                        AssertSearchConnection(conn);
                        if (conn.ConfigurationItemType == null)
                            si.FilterByUpwardConnectionType(conn.ConnectionType, conn.Count);
                        else
                            si.FilterByUpwardConnectionType(conn.ConnectionType, (Guid)conn.ConfigurationItemType, conn.Count);
                    }
                }
            }
            if (search.Attributes != null) // Attributtypen suchen. Attribute können nur zu bestimmten ItemTypen gehören, was für die Suche aber nicht schlimm ist, die die nicht erlaubten ItemTypen ausgefiltert werden.
            {
                foreach (Search.SearchAttribute attribute in search.Attributes)
                {
                    if (attribute.AttributeTypeId.Equals(Guid.Empty))
                        throw new ArgumentException("Der Attributtyp muss gesetzt sein.");
                    si.FilterByAttributeTypeAndValue(attribute.AttributeTypeId, attribute.AttributeValue);
                }
            }
            if (!string.IsNullOrWhiteSpace(search.ResponsibleToken)) // Überprüft, ob der angegebene Verantwortliche vorhanden ist.
                si.FilterByResponsiblePersons(search.ResponsibleToken);
            return si.MatchingConfigurationItems;
        }

        /// <summary>
        /// Stellt sicher, dass Verbindungen nur zusammen mit einem Item-Typen übermittelt werden
        /// </summary>
        /// <param name="search">Suchanfrage</param>
        private static void AssertConnectionsOnlyWithItemType(Search search)
        {
            if (search.ItemType == null && ((search.ConnectionsToLower != null && search.ConnectionsToLower.Count() > 0) ||
                (search.ConnectionsToUpper != null && search.ConnectionsToUpper.Count() > 0)))
                throw new InvalidOperationException("Verbindungen können nur gesucht werden, wenn ein ItemTyp angegeben ist");
        }

        /// <summary>
        /// Überprüft, ob eine Suchverbindung korrekte Daten enthält
        /// </summary>
        /// <param name="conn">Verbindungsdaten, nach denen gesucht wird</param>
        private static void AssertSearchConnection(Search.SearchConnection conn)
        {
            if (conn.ConnectionType.Equals(Guid.Empty))
                throw new ArgumentException("Der Verbindungstyp muss gesetzt sein.");
            if (string.IsNullOrWhiteSpace(conn.Count))
                throw new ArgumentException("Die Anzahl der Verbindungen muss angegeben sein.");
        }

        #endregion


    }
}
