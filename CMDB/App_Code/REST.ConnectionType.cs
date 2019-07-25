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
    [WebInvoke(Method = "POST", UriTemplate = "ConnectionType")]
    public OperationResult CreateConnectionType(ConnectionType connectionType)
    {
        try
        {
            MetaDataHandler.CreateConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionType/{id}")]
    public ConnectionType GetConnectionType(string id)
    {
        Guid connType;
        if (!Guid.TryParse(id, out connType))
        {
            BadRequest();
            return null;
        }
        try
        {
            ConnectionType connectionType = MetaDataHandler.GetConnectionType(connType);
            if (connectionType == null)
            {
                NotFound();
            }
            return connectionType;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionType/{id}/CanDelete")]
    public bool CanDeleteConnectionType(string id)
    {
        Guid connType;
        if (!Guid.TryParse(id, out connType))
        {
            BadRequest();
            return false;
        }
        try
        {
            return MetaDataHandler.CanDeleteConnectionType(connType);
        }
        catch
        {
            ServerError();
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "ConnectionType/{id}")]
    public OperationResult UpdateConnectionType(string id, ConnectionType connectionType)
    {
        try
        {
            if (!string.Equals(id, connectionType.ConnTypeId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            MetaDataHandler.UpdateConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "ConnectionType/{id}")]
    public OperationResult DeleteConnectionType(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            ConnectionType connectionType = MetaDataHandler.GetConnectionType(guid);
            if (connectionType == null)
            {
                return NotFound("Could not find a connection type with id " + guid.ToString());
            }
            MetaDataHandler.DeleteConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

}