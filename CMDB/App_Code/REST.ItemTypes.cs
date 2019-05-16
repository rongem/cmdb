using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
    [WebGet]
    public IEnumerable<ItemType> GetItemTypes()
    {
        return MetaDataHandler.GetItemTypes();
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public IEnumerable<ItemType> GetItemTypesByAllowedAttributeType(Guid id)
    {
        try
        {
            return MetaDataHandler.GetItemTypesByAllowedAttributeType(id);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebGet]
    public int GetItemTypesCount()
    {
        try
        {
            return MetaDataHandler.GetItemTypesCount();
        }
        catch (Exception)
        {
            return -1;
        };
    }

}