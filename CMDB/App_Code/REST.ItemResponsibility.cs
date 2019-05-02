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
    [WebInvoke(Method = "POST")]
    public ItemResponsibility[] GetResponsibilitesForConfigurationItem(ConfigurationItem item)
    {
        try
        {
            return DataHandler.GetResponsibilitesForConfigurationItem(item.ItemId).ToArray();
        }
        catch
        {
            return null;
        }
    }

}