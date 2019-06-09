using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Linq;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItem/{id}/ResponibleUsers")]
    public ItemResponsibility[] GetResponsibilitesForConfigurationItem(string id)
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
            return DataHandler.GetResponsibilitesForConfigurationItem(itemId).ToArray();
        }
        catch
        {
            ServerError();
            return null;
        }
    }

}