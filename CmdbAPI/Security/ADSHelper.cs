using System;
using System.Collections.Generic;
using System.Data;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.DirectoryServices.ActiveDirectory;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Principal;

namespace CmdbAPI.Security
{
    /// <summary>
    /// Liest Informationen aus dem Active Directory und stellt Hilfsfunktionen für Windows-Accounts bereit.
    /// Standard-Settings: givenname|sn|displayname|title|mail|physicaldeliveryofficename|telephonenumber|userprincipalname|objectsid|samaccountname
    /// </summary>
    public static class ADSHelper
    {
        public class UserObject
        {
            public string userprincipalname { get; set; }
            public string samaccountname { get; set; }
            public string displayname { get; set; }
            public string givenname { get; set; }
            public string sn { get; set; }
            public string title { get; set; }
            public string physicaldeliveryofficename { get; set; }
            public string telephonenumber { get; set; }
            public string mail { get; set; }
            public string objectsid { get; set; }

            public enum SourceType
            {
                Unknown,
                LocalMachine,
                Domain,
            }
            public SourceType Source { get; set; }
            public NTAccount NTAccount { get; set; }
        }

        /// <summary>
        /// Stellt Funktionen zum Win32-Zugriff bereit
        /// </summary>
        internal class Win32
        {
            public const int ErrorSuccess = 0;

            [DllImport("Netapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
            public static extern int NetGetJoinInformation(string server, out IntPtr domain, out NetJoinStatus status);

            [DllImport("Netapi32.dll")]
            public static extern int NetApiBufferFree(IntPtr Buffer);

            public enum NetJoinStatus
            {
                NetSetupUnknownStatus = 0,
                NetSetupUnjoined,
                NetSetupWorkgroupName,
                NetSetupDomainName
            }

        }

        /// <summary>
        /// Prüft, ob der Computer Domänenmitglied ist
        /// </summary>
        /// <returns></returns>
        private static bool IsInDomain()
        {
            Win32.NetJoinStatus status = Win32.NetJoinStatus.NetSetupUnknownStatus;
            IntPtr pDomain = IntPtr.Zero;
            int result = Win32.NetGetJoinInformation(null, out pDomain, out status);
            if (pDomain != IntPtr.Zero)
            {
                Win32.NetApiBufferFree(pDomain);
            }
            if (result == Win32.ErrorSuccess)
            {
                return status == Win32.NetJoinStatus.NetSetupDomainName;
            }
            else
            {
                throw new Exception("Domain Info Get Failed", new System.ComponentModel.Win32Exception());
            }
        }

        /// <summary>
        /// Gibt die erlaubten Eigenschaftsnamen für Active Directory zurück
        /// </summary>
        /// <returns></returns>
        private static IEnumerable<string> GetPropertyNamesForAd()
        {
            foreach (PropertyInfo prop in typeof(UserObject).GetProperties())
            {
                if (prop.PropertyType == typeof(string))
                    yield return prop.Name;
            }
        }

        private static string[] propertiestoload = GetPropertyNamesForAd().ToArray();

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
        /// Wandelt einen Benutzernamen in ein WindowsIdentity-Objekt um
        /// </summary>
        /// <param name="userName">Benutzername im Format DOMAIN\USER</param>
        /// <returns></returns>
        public static WindowsIdentity GetWindowsIdentityFromUserName(string userName)
        {
            using (UserPrincipal user =
              UserPrincipal.FindByIdentity(
                UserPrincipal.Current.Context,
                IdentityType.SamAccountName,
                userName
                ) ??
              UserPrincipal.FindByIdentity(
                UserPrincipal.Current.Context,
                IdentityType.UserPrincipalName,
                userName
                ))
            {
                return user == null
                  ? null
                  : new WindowsIdentity(user.UserPrincipalName);
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
        public static UserObject GetUserProperties(string Domainname, string Username)
        {
            return QueryUserProperties(string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "(&(objectClass=user)(objectCategory=person)(userprincipalname={0}@{1}))",
                Username, Domainname));
        }

        /// <summary>
        /// Gibt den Benutzer zu einem CN zurück (oder null, wenn er nicht gefunden wurde)
        /// </summary>
        /// <param name="cn">cn, nach dem gesucht werden soll</param>
        /// <returns>Dictionary &lt;string, string&gt;</returns>
        public static UserObject GetUserPropertiesByCN(string cn)
        {
            return QueryUserProperties(string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "(&(objectClass=user)(objectCategory=person)(cn={0}))",
                cn));
        }

        /// <summary>
        /// Gibt die in den Settings definierten Eigenschaften eines Domänenbenutzers anhand seiner Mailadresse zurück
        /// </summary>
        /// <param name="mail">Mailadresse, nach der gesucht werden soll</param>
        /// <returns>Null, falls kein Benutzer gefunden wird. Sonst ein Propertybag</returns>
        public static UserObject GetUserPropertiesByMail(string mail)
        {
            return QueryUserProperties(string.Format(System.Globalization.CultureInfo.InvariantCulture,
                "(&(objectClass=user)(objectCategory=person)(mail={0}))", mail));
        }

        /// <summary>
        /// Gibt die Daten eines Benutzers zurück
        /// </summary>
        /// <param name="query">LDAP-Query zum Suchen</param>
        /// <returns></returns>
        private static UserObject QueryUserProperties(string query)
        {
            return CreateUserObject(QueryGlobalCatalog(query));
        }

        /// <summary>
        /// Erzeugt ein UserObject aus einem SearchResult-Objekt
        /// </summary>
        /// <param name="result">SearchResult</param>
        /// <returns></returns>
        private static UserObject CreateUserObject(SearchResult result)
        {
            if (result == null) return null;
            UserObject ret = new UserObject() { Source = UserObject.SourceType.Domain };
            for (int i = 0; i < propertiestoload.Length; i++)
            {
                PropertyInfo pi = ret.GetType().GetProperty(propertiestoload[i]);
                pi.SetValue(ret, GetProperty(result, propertiestoload[i]));
            }
            ret.NTAccount = (NTAccount)(new SecurityIdentifier(ret.objectsid)).Translate(typeof(NTAccount));
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
            try
            {
                SecurityIdentifier sid = (SecurityIdentifier)acc.Translate(typeof(SecurityIdentifier));
                return SID2Base64(sid);
            }
            catch (IdentityNotMappedException) // Konto existiert nicht
            {
                return null;
            }
        }

        /// <summary>
        /// Gibt zu einem Benutzernamen eine SID zurück
        /// </summary>
        /// <param name="UserName">Benutzername (Domain\Username)</param>
        public static SecurityIdentifier GetSIDFromUserName(string UserName)
        {
            NTAccount acc = new NTAccount(UserName);
            try
            {
                return (SecurityIdentifier)acc.Translate(typeof(SecurityIdentifier));
            }
            catch (IdentityNotMappedException) // Konto existiert nicht
            {
                return null;
            }
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
        /// (überladen) Gibt Eigenschaften zu einer Benutzerkennung zurück
        /// </summary>
        /// <param name="userName">Benutzername des gesuchten Benutzers</param>
        /// <returns>Dictionary mit den Eigenschaften</returns>
        public static UserObject GetUserProperties(string userName)
        {
            UserObject userObject = new UserObject() { displayname = userName, samaccountname = userName, Source = UserObject.SourceType.Unknown };
            SetPropertiesToUnknown(userObject);
            if (string.IsNullOrWhiteSpace(userName))
                return userObject;
            if (userName.Contains(@"\"))
            {
                try
                {
                    NTAccount acc = new NTAccount(userName);
                    userObject.displayname = acc.Value;
                    string domain = userName.Split('\\')[0];
                    if (domain.Equals(Environment.MachineName, StringComparison.CurrentCultureIgnoreCase)) // Lokales Konto
                    {
                        return GetUserProperties(acc);
                    }
                    else
                    {
                        SecurityIdentifier sid = (SecurityIdentifier)acc.Translate(typeof(SecurityIdentifier));
                        return GetUserProperties(sid);
                    }
                }
                catch { }
            }
            else
            {
                try
                {
                    return GetUserPropertiesByCN(userName);
                }
                catch { }
            }
            return userObject;
        }

        private static void SetPropertiesToUnknown(UserObject ret)
        {
            for (int i = 0; i < propertiestoload.Length; i++)
            {
                PropertyInfo pi = ret.GetType().GetProperty(propertiestoload[i]);
                pi.SetValue(ret, "(unbekannt)");
            }
        }

        /// <summary>
        /// (überladen) Gibt Eigenschaften zu einer SID zurück
        /// </summary>
        /// <param name="sid">SID des gesuchten Benutzers</param>
        /// <returns>Dictionary mit den Eigenschaften</returns>
        private static UserObject GetUserProperties(SecurityIdentifier sid)
        {
            if (sid == null)
                throw new ArgumentNullException();

            UserObject ret = new UserObject();
            try
            {
                DirectoryEntry entry = new DirectoryEntry(string.Format(System.Globalization.CultureInfo.InvariantCulture,
                    "LDAP://<SID={0}>", sid));
                for (int i = 0; i < propertiestoload.Length; i++)
                {
                    PropertyInfo pi = ret.GetType().GetProperty(propertiestoload[i]);
                    pi.SetValue(ret, entry.Properties[propertiestoload[i]].Value == null ? "" : entry.Properties[propertiestoload[i]].Value.ToString());
                }
                ret.Source = UserObject.SourceType.Domain;
            }
            catch
            {
                try
                {
                    NTAccount account = sid.Translate(typeof(NTAccount)) as NTAccount;
                    ret = GetUserProperties(account);
                }
                catch
                {
                    SetPropertiesToUnknown(ret);
                }
            }
            return ret;
        }

        /// <summary>
        /// (überladen) Gibt Eigenschaften zu einem NTAccount zurück
        /// </summary>
        /// <param name="acc">NT Account des gesuchten Benutzers</param>
        /// <returns>Dictionary mit den Eigenschaften</returns>
        public static UserObject GetUserProperties(NTAccount acc)
        {
            PrincipalContext ctx = new PrincipalContext(ContextType.Machine, Environment.MachineName);
            UserPrincipal user = new UserPrincipal(ctx)
            {
                Name = "*",
            };
            PrincipalSearcher ps = new PrincipalSearcher();
            ps.QueryFilter = user;
            PrincipalSearchResult<Principal> result = ps.FindAll();
            UserObject ret = new UserObject() { Source = UserObject.SourceType.Unknown };
            SetPropertiesToUnknown(ret);
            Principal p = result.SingleOrDefault(u => u.SamAccountName.Equals(acc.Value.Split('\\')[1], StringComparison.CurrentCultureIgnoreCase));
            if (result.Count() == 0 || p == null)
            {
                ret.displayname = acc.Value;
                return ret;
            }
            using (UserPrincipal up = (UserPrincipal)p)
            {
                ret.Source = up.ContextType == ContextType.Machine ? UserObject.SourceType.LocalMachine : UserObject.SourceType.Domain;
                ret.displayname = up.Name;
                ret.samaccountname = up.SamAccountName;
                ret.NTAccount = acc;
            }
            return ret;
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
        public static UserObject GetSuperiorProperties(string sid)
        {
            try
            {
                UserObject employee = GetUserProperties(sid);
                if (employee == null)
                    return null;
                string query = string.Format(System.Globalization.CultureInfo.InvariantCulture,
                    "(&(objectClass=user)(objectCategory=person)(title={0})(userprincipalname=*@{1}))",
                    employee.title.Substring(0, employee.title.LastIndexOf(' ')),
                    employee.userprincipalname.Split('@')[1]);
                return QueryUserProperties(query);
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Gibt alle Benutzer der aktuellen Domain zurück
        /// </summary>
        /// <param name="namepart">Teil des Names, nach dem gesucht wird (leer für alle Benutzer)</param>
        public static IEnumerable<UserObject> GetUsers(string namepart)
        {
            if (IsInDomain())
            {
                string query = string.Format(System.Globalization.CultureInfo.InvariantCulture,
                    "(&(objectClass=user)(objectCategory=person)(userprincipalname={0}*@{1})(!(userAccountControl:1.2.840.113556.1.4.803:=2)))",
                    namepart, GetDefaultDomain());
                using (SearchResultCollection results = ReadGlobalCatalog(query))
                {
                    foreach (SearchResult result in results)
                    {
                        yield return CreateUserObject(result);
                    }
                }
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Machine, Environment.MachineName);
                UserPrincipal user = new UserPrincipal(ctx)
                {
                    Name = "*",
                };
                PrincipalSearcher ps = new PrincipalSearcher();
                ps.QueryFilter = user;
                PrincipalSearchResult<Principal> result = ps.FindAll();
                foreach (Principal p in result)
                {
                    if (p.SamAccountName.StartsWith(namepart, StringComparison.CurrentCultureIgnoreCase))
                    {
                        UserObject ret = new UserObject() { Source = UserObject.SourceType.Unknown };
                        SetPropertiesToUnknown(ret);
                        using (UserPrincipal up = (UserPrincipal)p)
                        {
                            ret.Source = up.ContextType == ContextType.Machine ? UserObject.SourceType.LocalMachine : UserObject.SourceType.Domain;
                            ret.displayname = up.Name;
                            ret.samaccountname = up.SamAccountName;
                            ret.NTAccount = (NTAccount)up.Sid.Translate(typeof(NTAccount));
                        }
                        yield return ret;
                    }
                }

            }
        }
    }
}