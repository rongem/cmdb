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
    public List<AttributeType> GetAttributeTypes()
    {
        List<AttributeType> l = new List<AttributeType>();
        l.AddRange(MetaDataHandler.GetAttributeTypes());
        return l;
    }

    [OperationContract]
    public IEnumerable<AttributeType> GetAttributeTypesForAttributeGroup(AttributeGroup group)
    {
        return MetaDataHandler.GetAttributeTypesForAttributeGroup(group);
    }

    [OperationContract]
    [WebGet]
    public IEnumerable<AttributeType> GetAttributeTypesWithoutGroup()
    {
        return MetaDataHandler.GetAttributeTypesWithoutGroup();
    }

    [OperationContract]
    //[WebGet(UriTemplate = "AttributeTypes/CorrespondingValuesOfType/{attributeTypeId}")]
    public IEnumerable<AttributeType> GetAttributeTypesForCorrespondingValuesOfType(Guid attributeTypeId)
    {
        return MetaDataHandler.GetAttributeTypesForCorrespondingValuesOfType(attributeTypeId);
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, Method = "POST", RequestFormat = WebMessageFormat.Json)]
    public IEnumerable<AttributeType> GetAttributeTypesForItemType(Guid itemTypeId)
    {
        try
        {
            return MetaDataHandler.GetAllowedAttributeTypesForItemType(itemTypeId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    public int GetItemAttributesCountForAttributeType(Guid attributeType)
    {
        return MetaDataHandler.GetItemAttributesCountForAttributeType(attributeType);
    }

}