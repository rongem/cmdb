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
    [WebGet(UriTemplate = "Connection/{id}")]
    public Connection GetConnection(string id)
    {
        Guid connId;
        if (!Guid.TryParse(id, out connId))
        {
            BadRequest();
            return null;
        }
        try
        {
            return DataHandler.GetConnection(connId);
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "Connection/upperItem/{upperItem}/connectionType/{connType}/lowerItem/{lowerItem}")]
    public Connection GetConnectionByContent(string upperItem, string connType, string lowerItem)
    {
        Guid upperItemId, connectionTypeId, lowerItemId;
        if (!(Guid.TryParse(upperItem, out upperItemId) && Guid.TryParse(connType, out connectionTypeId) && Guid.TryParse(lowerItem, out lowerItemId)))
        {
            BadRequest();
            return null;
        }
        try
        {
            return DataHandler.GetConnectionByContent(upperItemId, connectionTypeId, lowerItemId);
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "Connection")]
    public OperationResult CreateConnection(Connection connection)
    {
        try
        {
            DataHandler.CreateConnection(connection, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "Connection/{id}")]
    public OperationResult UpdateConnection(string id, Connection connection)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
                return BadRequest("Not a valid Guid");
            if (connection == null)
                return BadRequest("Connection missing");
            if (!connection.ConnId.Equals(guid))
                return IdMismatch();
            DataHandler.UpdateConnectionDescription(connection, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "Connection/{id}")]
    public OperationResult DeleteConnection(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            Connection connection = DataHandler.GetConnection(guid);
            if (connection == null)
            {
                return NotFound("Could not find a connection with id " + guid.ToString());
            }
            DataHandler.DeleteConnection(connection, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

}