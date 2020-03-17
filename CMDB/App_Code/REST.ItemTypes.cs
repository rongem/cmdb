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
    [WebGet(UriTemplate = "ItemType/ForUpper/{upper}/ConnectionType/{connType}")]
    public ItemType[] GetLowerItemTypeForUpperItemTypeAndConnectionType(string upper, string connType)
    {
        Guid upperItemTypeId, connectionTypeId;
        if (!(Guid.TryParse(upper, out upperItemTypeId) && Guid.TryParse(connType, out connectionTypeId)))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetLowerItemTypeForUpperItemTypeAndConnectionType(upperItemTypeId, connectionTypeId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemType/ForLower/{lower}/ConnectionType/{connType}")]
    public ItemType[] GetUpperItemTypeForLowerItemTypeAndConnectionType(string lower, string connType)
    {
        Guid lowerItemTypeId, connectionTypeId;
        if (!(Guid.TryParse(lower, out lowerItemTypeId) && Guid.TryParse(connType, out connectionTypeId)))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetUpperItemTypeForLowerItemTypeAndConnectionType(lowerItemTypeId, connectionTypeId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
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
}