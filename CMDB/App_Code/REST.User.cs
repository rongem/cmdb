using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    /// <summary>
    /// Liefert die Rolle für den angemeldeten Benutzer zurück
    /// </summary>
    /// <returns></returns>
    [OperationContract]
    [WebGet]
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
    /// Löscht eine Benutzer-Rollen-Zuordnung aus der Datenbank
    /// </summary>
    /// <param name="userRoleMapping">RollenzuOrndung</param>
    /// <param name="DeleteResponsibilitiesAlso">Gibt an, ob auch alle Verantwortlichkeiten für CIs aus der Datenbank gelöscht werden sollen</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult RevokeRoleForUser(UserRoleMapping userRoleMapping, bool DeleteResponsibilitiesAlso)
    {
        try
        {
            SecurityHandler.RevokeRole(userRoleMapping, DeleteResponsibilitiesAlso, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    /// <summary>
    /// Liefert zu einem gegebenen Account-Namen weitere Informationen zurück
    /// </summary>
    [OperationContract]
    [WebInvoke(Method = "POST")]
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