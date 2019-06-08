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
    [WebGet(UriTemplate = "AttributeTypes")]
    public List<AttributeType> GetAttributeTypes()
    {
        List<AttributeType> l = new List<AttributeType>();
        l.AddRange(MetaDataHandler.GetAttributeTypes());
        return l;
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeTypes/ForGroup/{id}")]
    public IEnumerable<AttributeType> GetAttributeTypesForAttributeGroup(string id)
    {
        Guid groupId;
        if (!Guid.TryParse(id, out groupId))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return null;
        }
        AttributeGroup group = MetaDataHandler.GetAttributeGroup(groupId);
        if (group == null)
        {
            SetStatusCode(System.Net.HttpStatusCode.NotFound);
            return null;
        }
        return MetaDataHandler.GetAttributeTypesForAttributeGroup(group);
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeTypes/WithoutGroup")]
    public IEnumerable<AttributeType> GetAttributeTypesWithoutGroup()
    {
        return MetaDataHandler.GetAttributeTypesWithoutGroup();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeTypes/CorrespondingValuesOfType/{id}")]
    public IEnumerable<AttributeType> GetAttributeTypesForCorrespondingValuesOfType(string id)
    {
        Guid attributeTypeId;
        if (!Guid.TryParse(id, out attributeTypeId))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return null;
        }
        return MetaDataHandler.GetAttributeTypesForCorrespondingValuesOfType(attributeTypeId);
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeTypes/ForItemType/{id}")]
    public IEnumerable<AttributeType> GetAttributeTypesForItemType(string id)
    {
        Guid itemTypeId;
        if (!Guid.TryParse(id, out itemTypeId))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return null;
        }
        try
        {
            return MetaDataHandler.GetAllowedAttributeTypesForItemType(itemTypeId);
        }
        catch (Exception)
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
            return null;
        }
    }
}