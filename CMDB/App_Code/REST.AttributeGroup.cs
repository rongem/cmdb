using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
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
    public AttributeGroup GetAttributeGroup(Guid id)
    {
        try
        {
            return MetaDataHandler.GetAttributeGroup(id);
        }
        catch (Exception)
        {
            return null;
        };
    }

    [OperationContract]
    public bool CanDeleteAttributeGroup(AttributeGroup attributeGroup)
    {
        try
        {
            return MetaDataHandler.CanDeleteAttributeGroup(attributeGroup.GroupId);
        }
        catch
        {
            return false;
        }

    }

    [OperationContract]
    public OperationResult UpdateAttributeGroup(AttributeGroup attributeGroup)
    {
        try
        {
            MetaDataHandler.UpdateAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    public OperationResult DeleteAttributeGroup(AttributeGroup attributeGroup)
    {
        try
        {
            MetaDataHandler.DeleteAttributeGroup(attributeGroup, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

}