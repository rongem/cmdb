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
    [WebGet(UriTemplate = "ConfigurationItem/{id}/Links")]
    public ItemLink[] GetLinksForConfigurationItem(string id)
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
            return DataHandler.GetLinksForConfigurationItem(itemId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ItemLink")]
    public OperationResult CreateLink(ItemLink link)
    {
        try
        {
            DataHandler.CreateLink(link, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "ItemLink")]
    public OperationResult DeleteLink(ItemLink link)
    {
        try
        {
            DataHandler.DeleteLink(link, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

}