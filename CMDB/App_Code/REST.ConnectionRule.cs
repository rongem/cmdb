using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.ServiceModel;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
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
    public int GetConnectionCountForConnectionRule(Guid ruleId)
    {
        return MetaDataHandler.GetConnectionCountForConnectionRule(ruleId);
    }

    public ConnectionRule GetConnectionRuleByContent(Guid upperItemType, Guid connectionType, Guid lowerItemType)
    {
        return MetaDataHandler.GetConnectionRuleByContent(upperItemType, connectionType, lowerItemType);
    }

    [OperationContract]
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