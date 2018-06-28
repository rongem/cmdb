using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CmdbAPI.DataAccess
{
    public static class Roles
    {
        /// <summary>
        /// Liefert alle Rollen zurück
        /// </summary>
        /// <returns></returns>
        public static CMDBDataSet.RolesDataTable GetAllRoles()
        {
            using (CMDBDataSetTableAdapters.RolesTableAdapter rolesTableAdapter = new CMDBDataSetTableAdapters.RolesTableAdapter())
            {
                return rolesTableAdapter.GetData();
            }
        }

        /// <summary>
        /// Gibt eine Datenzeile zurück, die zu einem angegebenen Benutzertoken gehört. Gibt null zurück, wenn keine Zeile gefunden wurde.
        /// </summary>
        /// <param name="userToken">Benutzername</param>
        /// <returns></returns>
        public static CMDBDataSet.RolesRow GetRole(string userToken)
        {
            using (CMDBDataSetTableAdapters.RolesTableAdapter rolesTableAdapter = new CMDBDataSetTableAdapters.RolesTableAdapter())
            {
                return rolesTableAdapter.GetDataByToken(userToken).FirstOrDefault();
            }
        }

        /// <summary>
        /// Überprüft, ob ein Benutzer direkt einer angegebenen Rolle zugewiesen ist
        /// </summary>
        /// <param name="userToken">Benutzername</param>
        /// <param name="role">Rolle, die überprüft werden soll</param>
        /// <returns></returns>
        public static bool HasUserRole(string userToken, CmdbAPI.Security.UserRole role)
        {
            using (CMDBDataSetTableAdapters.QueriesTableAdapter queriesTableAdapter = new CMDBDataSetTableAdapters.QueriesTableAdapter())
            {
                object retVal = queriesTableAdapter.Roles_GetRoleForToken(userToken, false);
                if (retVal == null)
                    return false;
                int userRole = (int)retVal;
                int assertedRole = (int)role;
                return userRole >= assertedRole;
            }
        }

        /// <summary>
        /// Gibt die Liste aller Gruppennamen zurück, die für eine angegebene Rolle zugelassen sind
        /// </summary>
        /// <param name="role">Rolle, die überprüft werden soll</param>
        /// <returns></returns>
        public static IEnumerable<string> GetUserGroupsForRole(CmdbAPI.Security.UserRole role)
        {
            using (CMDBDataSetTableAdapters.RolesTableAdapter rolesTableAdapter = new CMDBDataSetTableAdapters.RolesTableAdapter())
            {
                foreach (CMDBDataSet.RolesRow rr in rolesTableAdapter.GetDataByRole((int)role))
                {
                    yield return rr.Token;
                }
            }
        }

        /// <summary>
        /// Erzeugt eine neue Rollenzuweisung
        /// </summary>
        /// <param name="userToken">Benutzername</param>
        /// <param name="isGroup">Gruppe (true) oder Benutzer (false)</param>
        /// <param name="role">Rolle</param>
        public static void Insert(string userToken, bool isGroup, CmdbAPI.Security.UserRole role)
        {
            using (CMDBDataSetTableAdapters.RolesTableAdapter rolesTableAdapter = new CMDBDataSetTableAdapters.RolesTableAdapter())
            {
                rolesTableAdapter.Insert(userToken, isGroup, (int)role);
            }
        }

        /// <summary>
        /// Löscht eine Rollenzuweisung
        /// </summary>
        /// <param name="userToken">Benutzername</param>
        /// <param name="isGroup">Gruppe (true) oder Benutzer (false)</param>
        /// <param name="role">Rolle</param>
        public static void Delete(string userToken, bool isGroup, CmdbAPI.Security.UserRole role)
        {
            using (CMDBDataSetTableAdapters.RolesTableAdapter rolesTableAdapter = new CMDBDataSetTableAdapters.RolesTableAdapter())
            {
                rolesTableAdapter.Delete(userToken, isGroup, (int)role);
            }
        }

    }
}
