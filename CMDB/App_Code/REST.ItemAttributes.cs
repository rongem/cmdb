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
    [WebGet(UriTemplate = "ConfigurationItem/{id}/Attributes")]
    public ItemAttribute[] GetAttributesForConfigurationItem(string id)
    {
        Guid itemId;
        if (!Guid.TryParse(id, out itemId))
        {
            BadRequest();
            return null;
        }
        try
        {
            if (DataHandler.GetConfigurationItem(itemId) == null)
            {
                NotFound();
                return null;
            }
            return DataHandler.GetAttributesForConfigurationItem(itemId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}/Attributes")]
    public ItemAttribute[] GetAttributesForAttributeType(string id)
    {
        Guid attributeTypeId;
        if (!Guid.TryParse(id, out attributeTypeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            if (MetaDataHandler.GetAttributeType(attributeTypeId) == null)
            {
                NotFound();
                return null;
            }
            return DataHandler.GetAttributeForAttributeType(attributeTypeId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

}