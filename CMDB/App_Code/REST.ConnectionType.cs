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
    public OperationResult CreateConnectionType(ConnectionType connectionType)
    {
        try
        {
            MetaDataHandler.CreateConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    public ConnectionType GetConnectionType(Guid id)
    {
        try
        {
            return MetaDataHandler.GetConnectionType(id);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    public bool CanDeleteConnectionType(ConnectionType connectionType)
    {
        try
        {
            return MetaDataHandler.CanDeleteConnectionType(connectionType.ConnTypeId);
        }
        catch
        {
            return false;
        }

    }

    [OperationContract]
    public OperationResult UpdateConnectionType(ConnectionType connectionType)
    {
        try
        {
            MetaDataHandler.UpdateConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    public OperationResult DeleteConnectionType(ConnectionType connectionType)
    {
        try
        {
            MetaDataHandler.DeleteConnectionType(connectionType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

}