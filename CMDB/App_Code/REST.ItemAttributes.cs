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
    public IEnumerable<ItemAttribute> GetAttributesForConfigurationItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetAttributesForConfigurationItem(itemId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    public IEnumerable<ItemAttribute> GetAttributesForAttributeType(Guid attributeTypeId)
    {
        try
        {
            return DataHandler.GetAttributeForAttributeType(attributeTypeId);
        }
        catch (Exception)
        {
            return null;
        }
    }

}