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
    public Connection[] GetConnectionsForItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetConnectionsForItem(itemId).ToArray();
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public Connection[] GetConnectionsToLowerForItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetConnectionsToLowerForItem(itemId).ToArray();
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public Connection[] GetConnectionsToUpperForItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetConnectionsToUpperForItem(itemId).ToArray();
        }
        catch (Exception)
        {
            return null;
        }
    }

}