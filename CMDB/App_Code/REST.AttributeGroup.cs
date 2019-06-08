using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Web;

/// <summary>
/// Alle Funktionen, die mit einer Attributgruppe Operieren
/// </summary>
public partial class REST
{
    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "AttributeGroup")]
    public OperationResult CreateAttributeGroup(AttributeGroup attributeGroup)
    {
        try
        {
            MetaDataHandler.CreateAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeGroup/{id}")]
    public AttributeGroup GetAttributeGroup(string id)
    {
        try
        {
            Guid groupId;
            if (!Guid.TryParse(id, out groupId))
            {
                SetStatusCode(System.Net.HttpStatusCode.BadRequest);
                return null;
            }
            AttributeGroup attributeGroup = MetaDataHandler.GetAttributeGroup(groupId);
            if (attributeGroup == null)
                SetStatusCode(System.Net.HttpStatusCode.NotFound);
            return attributeGroup;
        }
        catch (Exception)
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
            return null;
        };
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeGroup/{id}/CanDelete")]
    public bool CanDeleteAttributeGroup(string id)
    {
        try
        {
            Guid attributeGroupId;
            if (!Guid.TryParse(id, out attributeGroupId))
            {
                SetStatusCode(System.Net.HttpStatusCode.BadRequest);
                return false;
            }
            return MetaDataHandler.CanDeleteAttributeGroup(attributeGroupId);
        }
        catch
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "AttributeGroup/{id}")]
    public OperationResult UpdateAttributeGroup(string id, AttributeGroup attributeGroup)
    {
        try
        {
            if (!string.Equals(id, attributeGroup.GroupId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                SetStatusCode(System.Net.HttpStatusCode.BadRequest);
                return new OperationResult() { Success = false, Message = "Id mismatch" }; ;
            }
            MetaDataHandler.UpdateAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "AttributeGroup/{id}")]
    public OperationResult DeleteAttributeGroup(string id, AttributeGroup attributeGroup)
    {
        try
        {
            if (!string.Equals(id, attributeGroup.GroupId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                SetStatusCode(System.Net.HttpStatusCode.BadRequest);
                return new OperationResult() { Success = false, Message = "Id mismatch" };
            }
            MetaDataHandler.DeleteAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

}