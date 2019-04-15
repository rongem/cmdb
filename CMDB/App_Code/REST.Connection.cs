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
    public Connection GetConnection(Guid connId)
    {
        try
        {
            return DataHandler.GetConnection(connId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
    public Connection GetConnectionByContent(Guid upperItemId, Guid connectionTypeId, Guid lowerItemId)
    {
        try
        {
            return DataHandler.GetConnectionByContent(upperItemId, connectionTypeId, lowerItemId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    public OperationResult CreateConnection(Connection connection)
    {
        try
        {
            DataHandler.CreateConnection(connection, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    [OperationContract]
    public OperationResult DeleteConnection(Connection connection)
    {
        try
        {
            DataHandler.DeleteConnection(connection, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

}