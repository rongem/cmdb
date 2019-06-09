﻿using CmdbAPI.BusinessLogic;
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
    [WebGet(UriTemplate = "ConfigurationItem/{id}")]
    public ConfigurationItem GetConfigurationItem(string id)
    {
        Guid itemId;
        if (!Guid.TryParse(id, out itemId))
        {
            BadRequest();
            return null;
        }
        try
        {
            ConfigurationItem configurationItem = DataHandler.GetConfigurationItem(itemId);
            if (configurationItem == null)
            {
                NotFound();
            }
            return configurationItem;
        }
        catch (Exception)
        {
            ServerError();
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
    [WebGet(UriTemplate = "ConfigurationItem/{itemId}/Full")]
    public Item GetItem(string itemId)
    {
        Guid id;
        if (!Guid.TryParse(itemId, out id))
        {
            BadRequest();
            return null;
        }
        try
        {
            Item item = DataHandler.GetItem(id);
            if (item == null)
            {
                NotFound();
            }
            return item;
        }
        catch (Exception)
        {
            ServerError();
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
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItem")]
    public OperationResult CreateConfigurationItem(ConfigurationItem item)
    {
        try
        {
            DataHandler.CreateConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "ConfigurationItem/{id}")]
    public OperationResult UpdateConfigurationItem(string id, ConfigurationItem item)
    {
        try
        {
            if (!string.Equals(id, item.ItemId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            DataHandler.UpdateConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "ConfigurationItem/{id}")]
    public OperationResult DeleteConfigurationItem(string id, ConfigurationItem item)
    {

        try
        {
            if (!string.Equals(id, item.ItemId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            DataHandler.DeleteConfigurationItem(item, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItem/{id}/TakeResponsibility")]
    public OperationResult TakeResponsibilityForConfigurationItem(string id, ConfigurationItem item)
    {
        try
        {
            if (!string.Equals(id, item.ItemId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            SecurityHandler.TakeResponsibility(item.ItemId, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "ConfigurationItem/{id}/AbandonResponsibility")]
    public OperationResult AbandonResponsibilityForConfigurationItem(string id, ConfigurationItem item)
    {
        try
        {
            if (!string.Equals(id, item.ItemId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            SecurityHandler.AbandonResponsibility(item.ItemId, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

}