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
    [WebInvoke(Method = "POST")]
    public OperationResult CreateGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping)
    {
        try
        {
            MetaDataHandler.CreateGroupAttributeTypeMapping(groupAttributeTypeMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebGet]
    public IEnumerable<GroupAttributeTypeMapping> GetGroupAttributeTypeMappings()
    {
        return MetaDataHandler.GetGroupAttributeTypeMappings();
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public GroupAttributeTypeMapping GetGroupAttributeTypeMapping(Guid groupId, Guid attributeTypeId)
    {
        try
        {
            return MetaDataHandler.GetGroupAttributeTypeMapping(groupId, attributeTypeId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public GroupAttributeTypeMapping GetGroupAttributeTypeMappingByAttributeType(Guid attributeTypeId)
    {
        try
        {
            return MetaDataHandler.GetGroupAttributeTypeMapping(attributeTypeId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public bool CanDeleteGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping)
    {
        try
        {
            return MetaDataHandler.CanDeleteGroupAttributeTypeMapping(groupAttributeTypeMapping);
        }
        catch
        {
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult DeleteGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping)
    {
        try
        {
            MetaDataHandler.DeleteGroupAttributeTypeMapping(groupAttributeTypeMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult UpdateGroupAttributeTypeMapping(GroupAttributeTypeMapping groupAttributeTypeMapping, Guid newGroupId)
    {
        try
        {
            MetaDataHandler.UpdateGroupAttributeTypeMapping(groupAttributeTypeMapping, newGroupId, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

}