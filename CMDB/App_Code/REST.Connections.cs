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
    [WebGet(UriTemplate = "ConfigurationItem/{id}/Connections")]
    public Connection[] GetConnectionsForItem(string id)
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
            return DataHandler.GetConnectionsForItem(itemId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItem/{id}/Connections/ToLower")]
    public Connection[] GetConnectionsToLowerForItem(string id)
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
            return DataHandler.GetConnectionsToLowerForItem(itemId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItem/{id}/Connections/ToUpper")]
    public Connection[] GetConnectionsToUpperForItem(string id)
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
            return DataHandler.GetConnectionsToUpperForItem(itemId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

}