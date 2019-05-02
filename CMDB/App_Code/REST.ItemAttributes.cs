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
    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ItemAttribute[] GetAttributesForConfigurationItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetAttributesForConfigurationItem(itemId).ToArray();
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ItemAttribute[] GetAttributesForAttributeType(Guid attributeTypeId)
    {
        try
        {
            return DataHandler.GetAttributeForAttributeType(attributeTypeId).ToArray();
        }
        catch (Exception)
        {
            return null;
        }
    }

}