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
    public IEnumerable<Connection> GetConnectionsForItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetConnectionsForItem(itemId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    public IEnumerable<Connection> GetConnectionsToLowerForItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetConnectionsToLowerForItem(itemId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    public IEnumerable<Connection> GetConnectionsToUpperForItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetConnectionsToUpperForItem(itemId);
        }
        catch (Exception)
        {
            return null;
        }
    }

}