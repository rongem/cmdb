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
    public ItemAttribute GetAttribute(Guid attributeId)
    {
        try
        {
            return DataHandler.GetAttribute(attributeId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ItemAttribute GetAttributeForConfigurationItemByAttributeType(Guid itemId, Guid attributeTypeId)
    {
        try
        {
            return DataHandler.GetAttributeForConfigurationItemByAttributeType(itemId, attributeTypeId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ItemAttribute GetAttributeForConfigurationItemByAttributeTypeName(Guid itemId, string attributeTypeName)
    {
        try
        {
            return DataHandler.GetAttributeForConfigurationItemByAttributeTypeName(itemId, attributeTypeName);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult CreateItemAttribute(ItemAttribute attribute)
    {
        try
        {
            DataHandler.CreateAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult UpdateItemAttribute(ItemAttribute attribute)
    {
        try
        {
            DataHandler.UpdateAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult DeleteItemAttribute(ItemAttribute attribute)
    {
        try
        {
            DataHandler.DeleteAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

}