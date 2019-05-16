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
    [WebInvoke(Method = "POST")]
    public OperationResult CreateConnectionRule(ConnectionRule connectionRule)
    {
        try
        {
            MetaDataHandler.CreateConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ConnectionRule GetConnectionRule(Guid id)
    {
        try
        {
            return MetaDataHandler.GetConnectionRule(id);
        }
        catch (Exception)
        {
            return null;
        };
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public int GetConnectionCountForConnectionRule(Guid ruleId)
    {
        return MetaDataHandler.GetConnectionCountForConnectionRule(ruleId);
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ConnectionRule GetConnectionRuleByContent(Guid upperItemType, Guid connectionType, Guid lowerItemType)
    {
        return MetaDataHandler.GetConnectionRuleByContent(upperItemType, connectionType, lowerItemType);
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public bool CanDeleteConnectionRule(ConnectionRule connectionRule)
    {
        try
        {
            return MetaDataHandler.CanDeleteConnectionRule(connectionRule.RuleId);
        }
        catch
        {
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult UpdateConnectionRule(ConnectionRule connectionRule)
    {
        try
        {
            MetaDataHandler.UpdateConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult DeleteConnectionRule(ConnectionRule connectionRule)
    {
        try
        {
            MetaDataHandler.DeleteConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

}