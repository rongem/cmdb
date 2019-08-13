using CmdbAPI;
using CmdbAPI.DataAccess;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.Security
{
    /// <summary>
    /// Klasse zum Überprüfen der Berechtigungen eines Benutzers
    /// </summary>
    public static class SecurityHandler
    {
        /// <summary>
        /// Überprüft, ob ein Benutzer direkt oder über eine Gruppe Mitglied der angegebenen Rolle (oder einer höher berechtigten) ist
        /// </summary>
        /// <param name="identity">WindowsIdentity, die geprüft wird</param>
        /// <param name="role">Rolle, für die die Prüfung erfolgt</param>
        /// <returns></returns>
        public static bool UserIsInRole(System.Security.Principal.WindowsIdentity identity, UserRole role)
        {
            return ((int)GetUserRole(identity) >= (int)role);
        }

        /// <summary>
        /// Gibt an, ob ein Benutzername in der Datenbank vorhanden ist
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public static bool UserTokenExists(string token)
        {
            return Roles.GetRole(token) != null;
        }

        /// <summary>
        /// Gibt die höchste Rolle eines Benutzers zurück
        /// </summary>
        /// <param name="identity">Identität, die überprüft wird</param>
        /// <returns></returns>
        public static UserRole GetUserRole(System.Security.Principal.WindowsIdentity identity)
        {
            CMDBDataSet.RolesDataTable rolesTable = Roles.GetAllRoles();
            if (IsNoAdminPresent(rolesTable)) // Wenn keine Administratoren in der Datenbank existieren, sind alle Administratoren
                return UserRole.Administrator;
            CMDBDataSet.RolesRow rr = Roles.GetRole(identity.Name); // Benutzer überprüfen
            if (rr != null)
                return (UserRole)rr.Role;
            // wenn der Benutzer nicht gefunden wurde, Gruppen überprüfen
            List<string> groupNames = new List<string>(identity.Groups.Count);
            groupNames.AddRange(identity.Groups.Select(g => g.Translate(typeof(System.Security.Principal.NTAccount)).Value.ToUpper()));

            int max = 0; // Mindestrolle ist Reader

            foreach (CMDBDataSet.RolesRow roleEntry in rolesTable.Where(r => r.IsGroup))
            {
                if (groupNames.Contains(roleEntry.Token.ToUpper()) && roleEntry.Role > max)
                    max = roleEntry.Role; // Maximale Rolle ermitteln.
            }
            return (UserRole)max;
        }

        /// <summary>
        /// Liefert zurück, ob es einen Benutzer in der Rolle Administrator gibt
        /// </summary>
        /// <param name="rolesTable">Tabelle mit den Rollen</param>
        /// <returns></returns>
        private static bool IsNoAdminPresent(CMDBDataSet.RolesDataTable rolesTable)
        {
            return rolesTable.Where(r => r.Role == (int)UserRole.Administrator).Count() == 0;
        }

        /// <summary>
        /// Gibt an, ob es einen Benutzer in der Rolle Administrator gibt
        /// </summary>
        /// <returns></returns>
        public static bool IsNoAdminPresent()
        {
            return IsNoAdminPresent(Roles.GetAllRoles());
        }

        /// <summary>
        /// Überprüft, ob ein Benutzer direkt oder über eine Gruppe Mitglied der angegebenen Rolle ist, und wirf eine Exception, wenn das nicht der Fall ist
        /// </summary>
        /// <param name="identity">WindowsIdentity, die geprüft wird</param>
        /// <param name="role">Rolle, für die die Prüfung erfolgt</param>
        public static void AssertUserInRole(System.Security.Principal.WindowsIdentity identity, UserRole role)
        {
            if (identity == null || !UserIsInRole(identity, role))
                throw new System.Security.SecurityException(string.Format("Benutzer {0} besitzt nicht die Rolle {1}", identity.Name, role.ToString()));
        }

        /// <summary>
        /// Überprüft, ob ein Benutzer verantwortlich für ein Configuration Item ist
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="userName">Benutzername</param>
        /// <returns></returns>
        public static bool UserIsResponsible(Guid itemId, string userName)
        {
            return Responsibility.CheckResponsibility(itemId, userName);
        }

        /// <summary>
        /// Der angegebene Benutzer übernimmt die Verantwortung für ein Configuration Item
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="identity">Identität des Benutzers</param>
        public static void TakeResponsibility(Guid itemId, System.Security.Principal.WindowsIdentity identity)
        {
            if (!UserIsInRole(identity, UserRole.Editor))
                throw new SecurityException("Der Benutzer muss Editor sein, um die Verantwortung übernehmen zu können.");
            
            if (UserIsResponsible(itemId, identity.Name))
                throw new InvalidOperationException("Der Benutzer ist schon für das Configuration Item verantwortlich.");
            CMDBDataSet.ConfigurationItemsRow r = ConfigurationItems.SelectOne(itemId);
            if (r == null)
                throw new NullReferenceException("Für die angegebene ID wurde kein Datensatz gefunden.");
            Responsibility.TakeResponsibility(itemId, identity.Name);
        }

        /// <summary>
        /// Der angegebene Benutzer gibt die Verantwortung für ein Configuration Item auf
        /// </summary>
        /// <param name="itemId">Guid des Configuration Item</param>
        /// <param name="identity">Identität des Benutzers</param>
        public static void AbandonResponsibility(Guid itemId, System.Security.Principal.WindowsIdentity identity)
        {
            
            if (!Responsibility.CheckResponsibility(itemId, identity.Name))
                throw new NullReferenceException("Der angegebene Benutzer besitzt keine Verantwortung für das Configuration Item.");
            Responsibility.AbandonResponsibility(itemId, identity.Name);
        }

        /// <summary>
        /// Liefert die Rolle für einen Benutzer zurück
        /// </summary>
        /// <param name="userToken">Benutzername</param>
        /// <returns></returns>
        public static UserRoleMapping GetRole(string userToken)
        {
            CMDBDataSet.RolesRow rolesRow = Roles.GetRole(userToken);
            if (rolesRow == null)
                return null;
            return new UserRoleMapping()
            {
                Username = rolesRow.Token,
                IsGroup = rolesRow.IsGroup,
                Role = (UserRole)rolesRow.Role,
            };
        }

        /// <summary>
        /// Weist einem Benutzer oder einer Gruppe eine Rolle zu
        /// </summary>
        /// <param name="userRoleMapping">Zuordnung eines Benutzers zu einer Gruppe</param>
        /// <param name="identity">Identität des Benutzers, der die Aktion durchführt</param>
        public static void GrantRole(UserRoleMapping userRoleMapping, System.Security.Principal.WindowsIdentity identity)
        {
            AssertUserInRole(identity, UserRole.Administrator);
            if (userRoleMapping.Role == UserRole.Reader)
                throw new InvalidOperationException("Die Rolle 'Leser' hat ohnehin jeder inne, deshalb muss sie nicht explizit gesetzt werden. Verwenden Sie stattdessen die Funktion RevokeRole.");
            
            if (string.IsNullOrWhiteSpace(userRoleMapping.Username))
                throw new ArgumentNullException("Der Benutzername darf nicht leer sein");

            if (Roles.GetRole(userRoleMapping.Username) != null)
                throw new InvalidOperationException("Der Benutzer bzw. die Gruppe existiert schon. Bitte zuerst löschen, bevor eine Zuweisung vorgenommen wird.");

            Roles.Insert(userRoleMapping.Username, userRoleMapping.IsGroup, userRoleMapping.Role);
        }

        /// <summary>
        /// Wechselt zwischen der Rolle Administrator und Editor hin und her
        /// </summary>
        /// <param name="userToken">Benutzername</param>
        /// <param name="identity">Identität des Benutzers, der die Aktion durchführt</param>
        public static void ToggleRole(string userToken, System.Security.Principal.WindowsIdentity identity)
        {
            AssertUserInRole(identity, UserRole.Administrator);
            UserRoleMapping userRoleMapping = GetRole(userToken);
            if (userRoleMapping == null || userRoleMapping.Role == UserRole.Reader)
                throw new InvalidOperationException("Diese Funktion kann nur auf Benutzer angewendet werden, die in der Rolle Editor oder Administrator sind.");
            Roles.Delete(userRoleMapping.Username, userRoleMapping.IsGroup, userRoleMapping.Role, false);
            Roles.Insert(userRoleMapping.Username, userRoleMapping.IsGroup, 3 - userRoleMapping.Role);
        }

        /// <summary>
        /// Enzieht einem Benutzer oder einer Gruppe eine Rolle
        /// </summary>
        /// <param name="userRoleMapping">Zuordnung eines Benutzers zu einer Gruppe</param>
        /// <param name="DeleteResponsibilitiesAlso">Gibt an, ob auch die Verantwortlichkeiten des Benutzers gelöscht werden sollen</param>
        /// <param name="identity">Identität des Benutzers, der die Aktion durchführt</param>
        public static void RevokeRole(UserRoleMapping userRoleMapping, bool DeleteResponsibilitiesAlso, System.Security.Principal.WindowsIdentity identity)
        {
            AssertUserInRole(identity, UserRole.Administrator);
            
            if (Roles.GetRole(userRoleMapping.Username) == null)
                throw new InvalidOperationException("Der Benutzer bzw. die Gruppe existiert nicht. Bitte zuerst löschen, bevor eine Zuweisung vorgenommen wird.");
            Roles.Delete(userRoleMapping.Username, userRoleMapping.IsGroup, userRoleMapping.Role, DeleteResponsibilitiesAlso);
        }

        /// <summary>
        /// Liefert alle definierten Benutzer zurück
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<UserRoleMapping> GetRoles()
        {
            foreach (CMDBDataSet.RolesRow rolesRow in Roles.GetAllRoles())
            {
                yield return new UserRoleMapping()
                {
                    Username = rolesRow.Token,
                    IsGroup = rolesRow.IsGroup,
                    Role = (UserRole)rolesRow.Role,
                };
            }
        }
    }
}
