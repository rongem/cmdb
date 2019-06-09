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
            return ServerError(ex);
        }
        return Success();
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
                BadRequest();
                return null;
            }
            AttributeGroup attributeGroup = MetaDataHandler.GetAttributeGroup(groupId);
            if (attributeGroup == null)
                NotFound();
            return attributeGroup;
        }
        catch (Exception)
        {
            ServerError();
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
                BadRequest();
                return false;
            }
            return MetaDataHandler.CanDeleteAttributeGroup(attributeGroupId);
        }
        catch
        {
            ServerError();
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
                return IdMismatch();
            }
            MetaDataHandler.UpdateAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "AttributeGroup/{id}")]
    public OperationResult DeleteAttributeGroup(string id, AttributeGroup attributeGroup)
    {
        try
        {
            if (!string.Equals(id, attributeGroup.GroupId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            MetaDataHandler.DeleteAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

}