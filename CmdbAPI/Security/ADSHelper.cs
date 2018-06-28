using System;
using System.Collections.Generic;
using System.Data;
using System.DirectoryServices;
using System.DirectoryServices.ActiveDirectory;
using System.Security.Principal;

namespace CmdbAPI
{
    /// <summary>
    /// Liest Informationen aus dem Active Directory und stellt Hilfsfunktionen für Windows-Accounts bereit.
    /// Standard-Settings: givenname|sn|displayname|title|mail|physicaldeliveryofficename|telephonenumber|userprincipalname|objectsid|samaccountname
    /// </summary>
    public static class ADSHelper
    {
        private static CmdbAPI.Properties.Settings settings = global::CmdbAPI.Properties.Settings.Default;

        /// <summary>
        /// Gibt die Domäne des Computers zurück
        /// </summary>
        /// <returns>Domänenname als string</returns>
        public static string GetDefaultDomain()
        {
            try
            {
                string name = Domain.GetComputerDomain().Name;
                DirectoryContext context = new DirectoryContext(DirectoryContextType.Domain, name);
                Domain domain = Domain.GetDomain(context);
                if (!domain.Name.StartsWith(name, StringComparison.CurrentCultureIgnoreCase))
                    name = domain.Name;
                return name;
            }
            catch
            {
                return "yourdomain.com"; // Falls die Domäne nicht ermittelt wurde, Standard zurückgeben
            }
        }

        /// <summary>
        /// Gibt die SID als Base64-kodierten String zurück
        /// </summary>
        /// <param name="sid">SID, die zurückgegeben werden soll</param>
        /// <returns>string</returns>
        public static string SID2Base64(SecurityIdentifier sid)
        {
            if (sid == null)
                throw new ArgumentNullException();
            byte[] bsid = new byte[sid.BinaryLength];
            sid.GetBinaryForm(bsid, 0);
            return Convert.ToBase64String(bsid);
        }

        /// <summary>
        /// Konvertiert einen Base64-kodierten String in ein SID-Objekt
        /// </summary>
        /// <param name="sid">als Base64 kodiertes ByteArray, das die SID enthält</param>
        /// <returns>SecurityIdentifier-Objekt</returns>
        public static SecurityIdentifier Base64ToSID(string sid)
        {
            byte[] bsid = Convert.FromBase64String(sid.Replace(' ', '+'));
            return new SecurityIdentifier(bsid, 0);
        }

        /// <summary>
        /// Gibt die Daten eines Benutzers zurück
        /// </summary>
        /// <param name="Domainname">Name der Domain</param>
        /// <param name="Username">Kontenname des Benutzers</param>
        /// <returns>Dictionary-Objekt mit den Eigenschaften</returns>
        public static Dictionary<string, string> GetUserProperties(string Domainname, string Username)
        {
            string[] propertiestoload = settings.LDAPProperties.Split('|');
            Dictionary<string, string> ret = new Dictionary<string, string>(propertiestoload.Length);

            SearchResult result = QueryGlobalCatalog(string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "(&(objectClass=user)(objectCategory=person)(userprincipalname={0}@{1}))",
                Username, Domainname));
            if (result == null) return null;
            for (int i = 0; i < propertiestoload.Length; i++)
            {
                ret.Add(propertiestoload[i], GetProperty(result, propertiestoload[i]));
            }
            return ret;
        }

        /// <summary>
        /// Gibt den Benutzer zu einem CN zurück (oder null, wenn er nicht gefunden wurde)
        /// </summary>
        /// <param name="cn">cn, nach dem gesucht werden soll</param>
        /// <returns>Dictionary &lt;string, string&gt;</returns>
        public static Dictionary<string, string> GetUserPropertiesByCN(string cn)
        {
            string[] propertiestoload = settings.LDAPProperties.Split('|');
            Dictionary<string, string> ret = new Dictionary<string, string>(propertiestoload.Length);

            SearchResult result = QueryGlobalCatalog(string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "(&(objectClass=user)(objectCategory=person)(cn={0}))",
                cn));
            if (result == null) return null;
            for (int i = 0; i < propertiestoload.Length; i++)
            {
                ret.Add(propertiestoload[i], GetProperty(result, propertiestoload[i]));
            }
            return ret;
        }

        /// <summary>
        /// Gibt die in den Settings definierten Eigenschaften eines Domänenbenutzers anhand seiner Mailadresse zurück
        /// </summary>
        /// <param name="mail">Mailadresse, nach der gesucht werden soll</param>
        /// <returns>Null, falls kein Benutzer gefunden wird. Sonst ein Propertybag</returns>
        public static Dictionary<string, string> GetUserPropertiesByMail(string mail)
        {
            string[] propertiestoload = settings.LDAPProperties.Split('|');
            Dictionary<string, string> ret = new Dictionary<string, string>(propertiestoload.Length);

            SearchResult result = QueryGlobalCatalog(string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "(&(objectClass=user)(objectCategory=person)(mail={0}))", mail));
            if (result == null) return null;
            for (int i = 0; i < propertiestoload.Length; i++)
            {
                ret.Add(propertiestoload[i], GetProperty(result, propertiestoload[i]));
            }
            return ret;
        }

        /// <summary>
        /// Beliebigen QueryString auf einen GlobalCatalog ausführen
        /// </summary>
        /// <param name="query">LDAP-query</param>
        /// <returns>Genau ein Ergebnis</returns>
        private static SearchResult QueryGlobalCatalog(string query)
        {
            using (GlobalCatalog gc =
                Domain.GetComputerDomain().Forest.FindGlobalCatalog())
            {
                using (DirectorySearcher search = gc.GetDirectorySearcher())
                {
                    try
                    {
                        search.SearchScope = SearchScope.Subtree;
                        search.Filter = query;
                        return search.FindOne();
                    }
                    catch
                    {
                        return null;
                    }
                }
            }
        }

        /// <summary>
        /// Gibt zu einem Benutzernamen eine SID in Base64-Kodierung zurück
        /// </summary>
        /// <param name="UserName">Benutzername (Domain\Username)</param>
        public static string GetBase64SIDFromUserName(string UserName)
        {
            NTAccount acc = new NTAccount(UserName);
            SecurityIdentifier sid = (SecurityIdentifier)acc.Translate(typeof(SecurityIdentifier));
            return SID2Base64(sid);
        }

        /// <summary>
        /// Liest den globalen Katalog mit einer vorgegebenen Abfrage
        /// </summary>
        /// <param name="query">LDAP-Abfrage</param>
        private static SearchResultCollection ReadGlobalCatalog(string query)
        {
            using (GlobalCatalog gc =
                Domain.GetComputerDomain().Forest.FindGlobalCatalog(ActiveDirectorySite.GetComputerSite().Name))
            {
                using (DirectorySearcher search = gc.GetDirectorySearcher())
                {
                    search.SearchScope = SearchScope.Subtree;
                    search.Filter = query;
                    return search.FindAll();
                }
            }
        }

        /// <summary>
        /// (überladen) Gibt Eigenschaften zu einer SID zurück
        /// </summary>
        /// <param name="sid">Bas64 kodierte SID des gesuchten Benutzers</param>
        /// <returns>Dictionary mit den Eigenschaften</returns>
        public static Dictionary<string, string> GetUserProperties(string sid)
        {
            try
            {
                return GetUserProperties(Base64ToSID(sid));
            }
            catch // Falls die Domäne nicht funktioniert, lokale Auflösung versuchen
            {
                Dictionary<string, string> ret = new Dictionary<string, string>();
                string[] propertiestoload = settings.LDAPProperties.Split('|');
                try
                {
                    NTAccount ntAccount = (NTAccount)Base64ToSID(sid).Translate(typeof(NTAccount));
                    for (int i = 0; i < propertiestoload.Length; i++)
                    {
                        if (propertiestoload[i].ToLower().Equals("displayname"))
                            ret.Add(propertiestoload[i], ntAccount.Value);
                        else
                            ret.Add(propertiestoload[i], "unknown");
                    }
                }
                catch // Falls auch die lokale Auflösung nicht funktioniert
                {
                    for (int i = 0; i < propertiestoload.Length; i++)
                    {
                        ret.Add(propertiestoload[i], "unknown");
                    }
                }
                return ret;
            }
        }

        /// <summary>
        /// (überladen) Gibt Eigenschaften zu einer SID zurück
        /// </summary>
        /// <param name="sid">SID des gesuchten Benutzers</param>
        /// <returns>Dictionary mit den Eigenschaften</returns>
        public static Dictionary<string, string> GetUserProperties(SecurityIdentifier sid)
        {
            if (sid == null)
                throw new ArgumentNullException();

            string[] propertiestoload = settings.LDAPProperties.Split('|');
            Dictionary<string, string> ret = new Dictionary<string, string>(propertiestoload.Length);
            DirectoryEntry entry = new DirectoryEntry(string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "LDAP://<SID={0}>", sid));
            for (int i = 0; i < propertiestoload.Length; i++)
            {
                ret.Add(propertiestoload[i], entry.Properties[propertiestoload[i]].Value == null ? "" : entry.Properties[propertiestoload[i]].Value.ToString());
            }
            return ret;
        }

        /// <summary>
        /// (überladen) Gibt Eigenschaften zu einem NTAccount zurück
        /// </summary>
        /// <param name="acc">NT Account des gesuchten Benutzers</param>
        /// <returns>Dictionary mit den Eigenschaften</returns>
        public static Dictionary<string, string> GetUserProperties(NTAccount acc)
        {
            if (acc == null)
                throw new ArgumentNullException();
            string[] accname = acc.Value.Split('\\');
            return GetUserProperties(accname[0], accname[1]);
        }

        /// <summary>
        /// Gibt den Wert eines benannten Property als String zurück
        /// </summary>
        /// <param name="result">Searchresult</param>
        /// <param name="PropertyName">Name des zu suchenden Properties</param>
        /// <returns>Einen String mit dem Wert, ggf. mit mehreren Werten in einzelnen Zeilen</returns>
        private static string GetProperty(SearchResult result, string PropertyName)
        {
            switch (result.Properties[PropertyName].Count)
            {
                case 0:
                    return "";
                case 1:
                    object p = result.Properties[PropertyName][0];
                    if (p.GetType() == typeof(byte[]))
                        return Convert.ToBase64String((byte[])p);
                    return p.ToString();
                default:
                    string ret = "";
                    for (int i = 0; i < result.Properties[PropertyName].Count; i++)
                    {
                        ret += string.Format(System.Globalization.CultureInfo.InvariantCulture,
                            "{0}\r\n", result.Properties[PropertyName][i].ToString());
                    }
                    return ret;
            }

        }

        /// <summary>
        /// Gibt die Benutzerinformationen für den Vorgesetzten zurück
        /// </summary>
        /// <param name="sid">Base64-Kodierte SID des Benutzers, zu dem der vorgesetzte gefunden werden soll</param>
        /// <returns>Dictionary mit den Eigenschaften des Benutzers</returns>
        public static Dictionary<string, string> GetSuperiorProperties(string sid)
        {
            try
            {
                string[] propertiestoload = settings.LDAPProperties.Split('|');
                Dictionary<string, string> employee = GetUserProperties(sid);
                if (employee == null)
                    return null;
                string query = string.Format(System.Globalization.CultureInfo.InvariantCulture,
                    "(&(objectClass=user)(objectCategory=person)(title={0})(userprincipalname=*@{1}))",
                    employee["title"].Substring(0, employee["title"].LastIndexOf(' ')),
                    employee["userprincipalname"].Split('@')[1]);
                Dictionary<string, string> ret = new Dictionary<string, string>();
                SearchResult result = QueryGlobalCatalog(query);
                if (result == null) return null;
                for (int i = 0; i < propertiestoload.Length; i++)
                {
                    ret.Add(propertiestoload[i], GetProperty(result, propertiestoload[i]));
                }
                return ret;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Gibt alle Benutzer der aktuellen Domain zurück
        /// </summary>
        public static DataTable GetUsers()
        {
            string[] propertiestoload = settings.LDAPProperties.Split('|');
            DataTable dt = new DataTable();
            for (int i = 0; i < propertiestoload.Length; i++)
            {
                dt.Columns.Add(propertiestoload[i], typeof(string));
            }
            string query = string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "(&(objectClass=user)(objectCategory=person)(userprincipalname=*@{0})(!(userAccountControl:1.2.840.113556.1.4.803:=2)))",
                GetDefaultDomain());
            using (SearchResultCollection results = ReadGlobalCatalog(query))
            {
                foreach (SearchResult result in results)
                {
                    DataRow r = dt.NewRow();
                    for (int i = 0; i < propertiestoload.Length; i++)
                    {
                        r[propertiestoload[i]] = GetProperty(result, propertiestoload[i]);
                    }
                    dt.Rows.Add(r);
                }
            }
            return dt;
        }
    }
}