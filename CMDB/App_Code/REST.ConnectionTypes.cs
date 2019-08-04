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
    [WebGet(UriTemplate = "ConnectionTypes")]
    public IEnumerable<ConnectionType> GetConnectionTypes()
    {
        return MetaDataHandler.GetConnectionTypes();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConnectionTypes/AllowedDownward/itemtype/{id}")]
    public IEnumerable<ConnectionType> GetAllowedDownwardConnnectionTypesForItemType(string id)
    {
        Guid itemTypeId;
        if (!Guid.TryParse(id, out itemTypeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetAllowedDownwardConnnectionTypesForItemType(itemTypeId);
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

}