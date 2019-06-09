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
    [WebInvoke(Method = "POST", UriTemplate = "GroupAttributeTypeMapping")]
    public OperationResult CreateGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping)
    {
        try
        {
            MetaDataHandler.CreateGroupAttributeTypeMapping(groupAttributeTypeMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "GroupAttributeTypeMappings")]
    public IEnumerable<GroupAttributeTypeMapping> GetGroupAttributeTypeMappings()
    {
        return MetaDataHandler.GetGroupAttributeTypeMappings();
    }

    [OperationContract]
    [WebGet(UriTemplate = "GroupAttributeTypeMapping/group/{group}/attributeType/{attributeType}")]
    public GroupAttributeTypeMapping GetGroupAttributeTypeMapping(string group, string attributeType)
    {
        Guid groupId, attributeTypeId;
        if (!(Guid.TryParse(group, out groupId) && Guid.TryParse(attributeType, out attributeTypeId)))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetGroupAttributeTypeMapping(groupId, attributeTypeId);
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "GroupAttributeTypeMapping/attributeType/{attributeType}")]
    public GroupAttributeTypeMapping GetGroupAttributeTypeMappingByAttributeType(string attributeType)
    {
        Guid attributeTypeId;
        if (!Guid.TryParse(attributeType, out attributeTypeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetGroupAttributeTypeMapping(attributeTypeId);
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "GroupAttributeTypeMapping/group/{group}/attributeType/{attributeType}/CanDelete")]
    public bool CanDeleteGroupAttributeTypeMapping(string group, string attributeType)
    {
        Guid groupId, attributeTypeId;
        if (!(Guid.TryParse(group, out groupId) && Guid.TryParse(attributeType, out attributeTypeId)))
        {
            BadRequest();
            return false;
        }
        try
        {
            GroupAttributeTypeMapping groupAttributeTypeMapping = MetaDataHandler.GetGroupAttributeTypeMapping(groupId, attributeTypeId);
            if (groupAttributeTypeMapping == null)
            {
                NotFound();
                return false;
            }
            return MetaDataHandler.CanDeleteGroupAttributeTypeMapping(groupAttributeTypeMapping);
        }
        catch
        {
            ServerError();
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "GroupAttributeTypeMapping")]
    public OperationResult DeleteGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping)
    {
        try
        {
            MetaDataHandler.DeleteGroupAttributeTypeMapping(groupAttributeTypeMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "GroupAttributeTypeMapping/{newGroup}")]
    public OperationResult UpdateGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping, string newGroup)
    {
        Guid newGroupId;
        if (!Guid.TryParse(newGroup, out newGroupId))
        {
            return IdMismatch();
        }
        try
        {
            MetaDataHandler.UpdateGroupAttributeTypeMapping(groupAttributeTypeMapping, newGroupId, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

}