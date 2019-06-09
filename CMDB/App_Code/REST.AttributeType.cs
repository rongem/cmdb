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
    [WebInvoke(Method = "POST", UriTemplate = "AttributeType")]
    public OperationResult CreateAttributeType(AttributeType attributeType)
    {
        try
        {
            MetaDataHandler.CreateAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}")]
    public AttributeType GetAttributeType(string id)
    {
        Guid typeId;
        if (!Guid.TryParse(id, out typeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            AttributeType attributeType = MetaDataHandler.GetAttributeType(typeId);
            if (attributeType == null)
            {
                NotFound();
            }
            return attributeType;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}/CanDelete")]
    public bool CanDeleteAttributeType(string id)
    {
        Guid typeId;
        if (!Guid.TryParse(id, out typeId))
        {
            BadRequest();
            return false;
        }
        try
        {
            return MetaDataHandler.CanDeleteAttributeType(typeId);
        }
        catch
        {
            ServerError();
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "AttributeType/{id}")]
    public OperationResult UpdateAttributeType(string id, AttributeType attributeType)
    {
        try
        {
            if (!string.Equals(id, attributeType.TypeId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            MetaDataHandler.UpdateAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "AttributeType/{id}")]
    public OperationResult DeleteAttributeType(string id, AttributeType attributeType)
    {
        try
        {
            if (!string.Equals(id, attributeType.TypeId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            MetaDataHandler.DeleteAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}/ItemAttributes/Count")]
    public int GetItemAttributesCountForAttributeType(string id)
    {
        Guid attributeType;
        if (!Guid.TryParse(id, out attributeType))
        {
            BadRequest();
            return -1;
        }
        return MetaDataHandler.GetItemAttributesCountForAttributeType(attributeType);
    }
}