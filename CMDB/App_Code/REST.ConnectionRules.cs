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
    [WebGet(UriTemplate = "ConnectionRules")]
    public ConnectionRule[] GetConnectionRules()
    {
        return MetaDataHandler.GetConnectionRules().ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionRules/ForItemType/{id}")]
    public ConnectionRule[] GetConnectionRulesForItemType(string id)
    {
        Guid itemType;
        if (!Guid.TryParse(id, out itemType))
        {
            BadRequest();
            return null;
        }
        return MetaDataHandler.GetConnectionRulesForItemType(itemType).ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionRules/ByUpperItemType/{id}")]
    public ConnectionRule[] GetConnectionRulesByUpperItemType(string id)
    {
        Guid itemType;
        if (!Guid.TryParse(id, out itemType))
        {
            BadRequest();
            return null;
        }
        return MetaDataHandler.GetConnectionRulesByUpperItemType(itemType).ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionRules/ByLowerItemType/{id}")]
    public ConnectionRule[] GetConnectionRulesByLowerItemType(string id)
    {
        Guid itemType;
        if (!Guid.TryParse(id, out itemType))
        {
            BadRequest();
            return null;
        }
        return MetaDataHandler.GetConnectionRulesByLowerItemType(itemType).ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionRules/ByUpperItemType/{upper}/ByLowerItemType/{lower}")]
    public ConnectionRule[] GetConnectionRulesByUpperAndLowerItemType(string upper,  string lower)
    {
        Guid upperItemType, lowerItemType;
        if (!(Guid.TryParse(upper, out upperItemType) && Guid.TryParse(lower, out lowerItemType)))
        {
            BadRequest();
            return null;
        }
        return MetaDataHandler.GetConnectionRulesByUpperAndLowerItemType(upperItemType, lowerItemType).ToArray();
    }

}