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
    [WebInvoke(Method = "POST", UriTemplate = "ConnectionRule")]
    public OperationResult CreateConnectionRule(ConnectionRule connectionRule)
    {
        try
        {
            MetaDataHandler.CreateConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionRule/{id}")]
    public ConnectionRule GetConnectionRule(string id)
    {
        Guid ruleId;
        if (!Guid.TryParse(id, out ruleId))
        {
            BadRequest();
            return null;
        }
        try
        {
            ConnectionRule connectionRule = MetaDataHandler.GetConnectionRule(ruleId);
            if (connectionRule == null)
            {
                NotFound();
            }
            return connectionRule;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        };
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionRule/{id}/Connections/Count")]
    public int GetConnectionCountForConnectionRule(string id)
    {
        Guid ruleId;
        if (!Guid.TryParse(id, out ruleId))
        {
            BadRequest();
            return -1;
        }
        return MetaDataHandler.GetConnectionCountForConnectionRule(ruleId);
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionRule/upperItemType/{upper}/connectionType/{conn}/lowerItemType/{lower}")]
    public ConnectionRule GetConnectionRuleByContent(string upper, string conn, string lower)
    {
        Guid upperItemType, connectionType, lowerItemType;
        if (!(Guid.TryParse(upper, out upperItemType) && Guid.TryParse(conn, out connectionType) && Guid.TryParse(lower, out lowerItemType)))
        {
            BadRequest();
            return null;
        }
        ConnectionRule connectionRule = MetaDataHandler.GetConnectionRuleByContent(upperItemType, connectionType, lowerItemType);
        if (connectionRule == null)
        {
            NotFound();
        }
        return connectionRule;
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionRule/{id}/CanDelete")]
    public bool CanDeleteConnectionRule(string id)
    {
        Guid ruleId;
        if (!Guid.TryParse(id, out ruleId))
        {
            BadRequest();
            return false;
        }
        try
        {
            return MetaDataHandler.CanDeleteConnectionRule(ruleId);
        }
        catch
        {
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "ConnectionRule/{id}")]
    public OperationResult UpdateConnectionRule(string id, ConnectionRule connectionRule)
    {
        try
        {
            if (!string.Equals(id, connectionRule.RuleId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            MetaDataHandler.UpdateConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "ConnectionRule/{id}")]
    public OperationResult DeleteConnectionRule(string id, ConnectionRule connectionRule)
    {
        try
        {
            if (!string.Equals(id, connectionRule.RuleId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            MetaDataHandler.DeleteConnectionRule(connectionRule, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

}