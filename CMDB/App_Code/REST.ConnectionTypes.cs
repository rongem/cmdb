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