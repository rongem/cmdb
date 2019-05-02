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
}