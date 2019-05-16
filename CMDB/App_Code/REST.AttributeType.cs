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
    [WebInvoke(Method = "POST")]
    public AttributeType GetAttributeType(Guid id)
    {
        try
        {
            return MetaDataHandler.GetAttributeType(id);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public bool CanDeleteAttributeType(AttributeType attributeType)
    {
        try
        {
            return MetaDataHandler.CanDeleteAttributeType(attributeType.TypeId);
        }
        catch
        {
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult UpdateAttributeType(AttributeType attributeType)
    {
        try
        {
            MetaDataHandler.UpdateAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult DeleteAttributeType(AttributeType attributeType)
    {
        try
        {
            MetaDataHandler.DeleteAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

}