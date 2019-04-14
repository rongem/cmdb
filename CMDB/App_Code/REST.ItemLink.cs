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
    public IEnumerable<ItemLink> GetLinksForConfigurationItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetLinksForConfigurationItem(itemId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    public OperationResult CreateLink(ItemLink link)
    {
        try
        {
            DataHandler.CreateLink(link, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    [OperationContract]
    public OperationResult DeleteLink(ItemLink link)
    {
        try
        {
            DataHandler.DeleteLink(link, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

}