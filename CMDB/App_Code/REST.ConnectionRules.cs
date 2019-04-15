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
    public IEnumerable<ConnectionRule> GetConnectionRules()
    {
        return MetaDataHandler.GetConnectionRules();
    }

    [OperationContract]
    public IEnumerable<ConnectionRule> GetConnectionRulesForItemType(Guid itemType)
    {
        return MetaDataHandler.GetConnectionRulesForItemType(itemType);
    }

    [OperationContract]
    public IEnumerable<ConnectionRule> GetConnectionRulesByUpperItemType(Guid itemType)
    {
        return MetaDataHandler.GetConnectionRulesByUpperItemType(itemType);
    }

    [OperationContract]
    public IEnumerable<ConnectionRule> GetConnectionRulesByLowerItemType(Guid itemType)
    {
        return MetaDataHandler.GetConnectionRulesByLowerItemType(itemType);
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
    public IEnumerable<ConnectionRule> GetConnectionRulesByUpperAndLowerItemType(Guid upperItemType, Guid lowerItemType)
    {
        return MetaDataHandler.GetConnectionRulesByUpperAndLowerItemType(upperItemType, lowerItemType);
    }

}