using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.ServiceModel;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
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
    public IEnumerable<GroupAttributeTypeMapping> GetGroupAttributeTypeMappings()
    {
        return MetaDataHandler.GetGroupAttributeTypeMappings();
    }

    [OperationContract]
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