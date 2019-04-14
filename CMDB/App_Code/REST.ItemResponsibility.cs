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
    public IEnumerable<ItemResponsibility> GetResponsibilitesForConfigurationItem(ConfigurationItem item)
    {
        try
        {
            return DataHandler.GetResponsibilitesForConfigurationItem(item.ItemId);
        }
        catch
        {
            return null;
        }
    }

}