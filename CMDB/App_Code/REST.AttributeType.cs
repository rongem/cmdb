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
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}")]
    public AttributeType GetAttributeType(string id)
    {
        Guid typeId;
        if (!Guid.TryParse(id, out typeId))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return null;
        }
        try
        {
            return MetaDataHandler.GetAttributeType(typeId);
        }
        catch (Exception)
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
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
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return false;
        }
        try
        {
            return MetaDataHandler.CanDeleteAttributeType(typeId);
        }
        catch
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "AttributeType/{id}")]
    public OperationResult UpdateAttributeType(string id, AttributeType attributeType)
    {
        if (!string.Equals(id, attributeType.TypeId.ToString(), StringComparison.CurrentCultureIgnoreCase))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return new OperationResult() { Success = false, Message = "Id mismatch" }; ;
        }
        try
        {
            MetaDataHandler.UpdateAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "AttributeType/{id}")]
    public OperationResult DeleteAttributeType(string id, AttributeType attributeType)
    {
        if (!string.Equals(id, attributeType.TypeId.ToString(), StringComparison.CurrentCultureIgnoreCase))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return new OperationResult() { Success = false, Message = "Id mismatch" }; ;
        }
        try
        {
            MetaDataHandler.DeleteAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}/ItemAttributesCount")]
    public int GetItemAttributesCountForAttributeType(string id)
    {
        Guid attributeType;
        if (!Guid.TryParse(id, out attributeType))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return -1;
        }
        return MetaDataHandler.GetItemAttributesCountForAttributeType(attributeType);
    }
}