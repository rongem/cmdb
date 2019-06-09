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
    [WebGet(UriTemplate = "ItemTypes")]
    public ItemType[] GetItemTypes()
    {
        return MetaDataHandler.GetItemTypes().ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemTypes/ByAllowedAttributeType/{id}")]
    public ItemType[] GetItemTypesByAllowedAttributeType(string id)
    {
        Guid attributeType;
        if (!Guid.TryParse(id, out attributeType))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetItemTypesByAllowedAttributeType(attributeType).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemTypes/Count")]
    public int GetItemTypesCount()
    {
        try
        {
            return MetaDataHandler.GetItemTypesCount();
        }
        catch (Exception)
        {
            ServerError();
            return -1;
        };
    }

}