using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;

/// <summary[]
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
    [WebGet]
    public ConnectionRule[] GetConnectionRules()
    {
        return MetaDataHandler.GetConnectionRules().ToArray();
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ConnectionRule[] GetConnectionRulesForItemType(Guid itemType)
    {
        return MetaDataHandler.GetConnectionRulesForItemType(itemType).ToArray();
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ConnectionRule[] GetConnectionRulesByUpperItemType(Guid itemType)
    {
        return MetaDataHandler.GetConnectionRulesByUpperItemType(itemType).ToArray();
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ConnectionRule[] GetConnectionRulesByLowerItemType(Guid itemType)
    {
        return MetaDataHandler.GetConnectionRulesByLowerItemType(itemType).ToArray();
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ConnectionRule[] GetConnectionRulesByUpperAndLowerItemType(Guid upperItemType, Guid lowerItemType)
    {
        return MetaDataHandler.GetConnectionRulesByUpperAndLowerItemType(upperItemType, lowerItemType).ToArray();
    }

}