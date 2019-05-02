using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    /// <summary>
    /// Gibt ein Configuration Item mit Verantwortlichkeiten, aber ohne Verbindungen und Attribute zurück
    /// </summary>
    /// <param name="itemId">Guid des gewünschen CI</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ConfigurationItem GetConfigurationItem(Guid itemId)
    {
        try
        {
            return DataHandler.GetConfigurationItem(itemId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    /// <summary>
    /// Gibt den Anmeldenamen zurück
    /// </summary>
    /// <returns></returns>
    /// <summary>
    /// Gibt ein vollständiges Item als JSON zurück
    /// </summary>
    /// <param name="itemId">Guid des Items</param>
    /// <returns></returns>
    [OperationContract]
    public Item GetItem(string itemId)
    {
        Guid id;
        if (!Guid.TryParse(itemId, out id))
            return null;

        try
        {
            return DataHandler.GetItem(id);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public ConfigurationItem GetConfigurationItemByTypeIdAndName(Guid itemType, string itemName)
    {
        try
        {
            return DataHandler.GetConfigurationItemByTypeIdAndName(itemType, itemName);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult CreateConfigurationItem(ConfigurationItem item)
    {
        try
        {
            DataHandler.CreateConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult UpdateConfigurationItem(ConfigurationItem item)
    {
        try
        {
            DataHandler.UpdateConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult DeleteConfigurationItem(ConfigurationItem item)
    {
        try
        {
            DataHandler.DeleteConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult TakeResponsibilityForConfigurationItem(ConfigurationItem item)
    {
        try
        {
            SecurityHandler.TakeResponsibility(item.ItemId, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST")]
    public OperationResult AbandonResponsibilityForConfigurationItem(ConfigurationItem item)
    {
        try
        {
            SecurityHandler.AbandonResponsibility(item.ItemId, ServiceSecurityContext.Current.WindowsIdentity);
            return new OperationResult() { Success = true };
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
    }

}