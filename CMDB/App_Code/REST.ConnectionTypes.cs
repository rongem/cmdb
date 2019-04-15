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
    [WebGet]
    public IEnumerable<ConnectionType> GetConnectionTypes()
    {
        return MetaDataHandler.GetConnectionTypes();
    }

    [OperationContract]
    public IEnumerable<ConnectionType> GetAllowedDownwardConnnectionTypesForItemType(Guid itemTypeId)
    {
        try
        {
            return MetaDataHandler.GetAllowedDownwardConnnectionTypesForItemType(itemTypeId);
        }
        catch (Exception)
        {
            return null;
        }
    }

}