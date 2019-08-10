using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    /// <summary>
    /// Liefert den Kontonamen des angemeldeten Benutzers zurück
    /// </summary>
    /// <returns></returns>
    [OperationContract]
    [WebGet(UriTemplate = "User/Current")]
    public string GetCurrentUser()
    {
        return ServiceSecurityContext.Current.WindowsIdentity.Name;
    }

    /// <summary>
    /// Liefert die Rolle für den angemeldeten Benutzer zurück
    /// </summary>
    /// <returns></returns>
    [OperationContract]
    [WebGet(UriTemplate = "User/Role")]
    public UserRole GetRoleForUser()
    {
        try
        {
            return SecurityHandler.GetUserRole(ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch
        {
            return UserRole.Reader;
        }
    }

    /// <summary>
    /// Gibt eine Liste aller Benutzer zurück
    /// </summary>
    /// <returns></returns>
    [OperationContract]
    [WebGet(UriTemplate = "Users")]
    public UserRoleMapping[] GetUsers()
    {
        try
        {
            return SecurityHandler.GetRoles().OrderBy(u => u.Username).ToArray();
        }
        catch(Exception ex)
        {
            ServerError();
            return null;
        }
    }

    /// <summary>
    /// Löscht eine Benutzer-Rollen-Zuordnung aus der Datenbank
    /// </summary>
    /// <param name="userRoleMapping">Rollenzuorndung</param>
    /// <param name="DeleteResponsibilitiesAlso">Gibt an, ob auch alle Verantwortlichkeiten für CIs aus der Datenbank gelöscht werden sollen</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "User/{user}/Role/{role}/{deleteResponsibilities}")]
    public OperationResult RevokeRoleForUser(string user, string role, string deleteResponsibilities)
    {
        try
        {
            UserRoleMapping userRoleMapping = SecurityHandler.GetRole(user);
            if (userRoleMapping == null)
            {
                return NotFound("User with this token not found");
            }
            if (userRoleMapping == null || userRoleMapping.Role.ToString() != role)
            {
                return NotFound("User has role " + userRoleMapping.Role.ToString());
            }
            bool DeleteResponsibilitiesAlso = (deleteResponsibilities == "1" 
                || deleteResponsibilities.ToLower() == "true" 
                || deleteResponsibilities.ToLower() == "yes");
            SecurityHandler.RevokeRole(userRoleMapping, DeleteResponsibilitiesAlso, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    /// <summary>
    /// Liefert zu den gegebenen Account-Namen weitere Informationen zurück
    /// </summary>
    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "Users")]
    public UserInfo[] GetUserInfo(string[] accountNames)
    {
        if (accountNames == null)
            return null;
        List<UserInfo> users = new List<UserInfo>();
        for (int i = 0; i < accountNames.Length; i++)
        {
            try
            {
                ADSHelper.UserObject user = ADSHelper.GetUserProperties(accountNames[i]);
                users.Add(new UserInfo()
                {
                    AccountName = user.samaccountname,
                    DisplayName = user.displayname,
                    Mail = user.mail,
                    Office = user.physicaldeliveryofficename,
                    Phone = user.telephonenumber,
                });
            }
            catch (Exception)
            {
                users.Add(new UserInfo()
                {
                    AccountName = accountNames[i],
                    DisplayName = accountNames[i],
                });
            }
        }
        return users.ToArray();
    }
}