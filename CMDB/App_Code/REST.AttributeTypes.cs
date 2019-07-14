using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
    [WebGet(UriTemplate = "AttributeTypes")]
    public AttributeType[] GetAttributeTypes()
    {
        List<AttributeType> l = new List<AttributeType>();
        l.AddRange(MetaDataHandler.GetAttributeTypes());
        return l.ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeTypes/ForGroup/{id}")]
    public AttributeType[] GetAttributeTypesForAttributeGroup(string id)
    {
        Guid groupId;
        if (!Guid.TryParse(id, out groupId))
        {
            BadRequest();
            return null;
        }
        AttributeGroup group = MetaDataHandler.GetAttributeGroup(groupId);
        if (group == null)
        {
            NotFound();
            return null;
        }
        return MetaDataHandler.GetAttributeTypesForAttributeGroup(group).ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeTypes/CorrespondingValuesOfType/{id}")]
    public AttributeType[] GetAttributeTypesForCorrespondingValuesOfType(string id)
    {
        Guid attributeTypeId;
        if (!Guid.TryParse(id, out attributeTypeId))
        {
            BadRequest();
            return null;
        }
        return MetaDataHandler.GetAttributeTypesForCorrespondingValuesOfType(attributeTypeId).ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeTypes/ForItemType/{id}")]
    public AttributeType[] GetAttributeTypesForItemType(string id)
    {
        Guid itemTypeId;
        if (!Guid.TryParse(id, out itemTypeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetAllowedAttributeTypesForItemType(itemTypeId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }
}