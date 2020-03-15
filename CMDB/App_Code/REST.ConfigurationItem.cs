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
            Item item = DataHandler.GetItem(id, ServiceSecurityContext.Current.WindowsIdentity);
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

    /// <summary>
    /// Gibt alle Items zurück, die für ein bestimmtes Item mit einer angegebenen Regel verbunden werden können
    /// </summary>
    /// <param name="id">Guid des oberen Configuration Items</param>
    /// <param name="ruleId">Guid der Verbindungsregel</param>
    /// <returns></returns>
    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItem/{id}/Connectable/{ruleId}")]
    public ConfigurationItem[] GetConnectableItemsToLowerForItem(string id, string ruleId)
    {
        Guid itemId, ruleToLowerId;
        if (!Guid.TryParse(id, out itemId) || !Guid.TryParse(ruleId, out ruleToLowerId))
        {
            BadRequest();
            return null;
        }
        try
        {
            ConfigurationItem item = DataHandler.GetConfigurationItem(itemId);
            ConnectionRule rule = MetaDataHandler.GetConnectionRule(ruleToLowerId);
            if (item == null || rule == null)
            {
                NotFound();
                return null;
            }
            if (!item.ItemType.Equals(rule.ItemUpperType))
            {
                SetStatusCode(System.Net.HttpStatusCode.Gone);
                return null;
            }
            return DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, ruleToLowerId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    /// <summary>
    /// Gibt alle Items zurück, die mit einer angegebenen Regel verbunden werden können
    /// </summary>
    /// <param name="id">Guid des oberen Configuration Items</param>
    /// <param name="ruleId">Guid der Verbindungsregel</param>
    /// <returns></returns>
    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItems/Connectable/{ruleId}")]
    public ConfigurationItem[] GetConnectableItemsToLower(string ruleId)
    {
        Guid ruleToLowerId;
        if (!Guid.TryParse(ruleId, out ruleToLowerId))
        {
            BadRequest();
            return null;
        }
        try
        {
            ConnectionRule rule = MetaDataHandler.GetConnectionRule(ruleToLowerId);
            if (rule == null)
            {
                NotFound();
                return null;
            }
            return DataHandler.GetConfigurationItemsConnectableAsLowerItem(ruleToLowerId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItem/type/{itemType}/name/{itemName}")]
    /// <summary>
    /// Gibt ein Configuration Item zurück, dass durch seinen Typ und Namen eindeutig bezeichnet ist
    /// </summary>
    /// <param name="itemType">Guid des Item-Typs</param>
    /// <param name="itemName">Name des Configuration Items</param>
    public ConfigurationItem GetConfigurationItemByTypeIdAndName(string itemType, string itemName)
    {
        Guid typeId;
        if (!Guid.TryParse(itemType, out typeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            return DataHandler.GetConfigurationItemByTypeIdAndName(typeId, itemName);
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
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItem/Full")]
    public OperationResult CreateConfigurationItemFull(Item item)
    {
        try
        {
            OperationResult or = OperationsHandler.CreateItem(item, ServiceSecurityContext.Current.WindowsIdentity);
            if (!or.Success)
                ServerError();
            return or;
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
    public OperationResult DeleteConfigurationItem(string id)
    {

        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            ConfigurationItem item = DataHandler.GetConfigurationItem(guid);
            if (item == null)
            {
                return NotFound("Could not find a configuration item with id " + guid.ToString());
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
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItem/{id}/Responsibility")]
    public OperationResult TakeResponsibilityForConfigurationItem(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            ConfigurationItem item = DataHandler.GetConfigurationItem(guid);
            if (item == null)
            {
                return NotFound("Could not find a configuration item with id " + guid.ToString());
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
    [WebInvoke(Method = "DELETE", UriTemplate = "ConfigurationItem/{id}/Responsibility")]
    public OperationResult AbandonResponsibilityForConfigurationItem(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            ConfigurationItem item = DataHandler.GetConfigurationItem(guid);
            if (item == null)
            {
                return NotFound("Could not find a configuration item with id " + guid.ToString());
            }
            SecurityHandler.AbandonResponsibility(item.ItemId, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "ConfigurationItem/{id}/Responsibility")]
    public OperationResult DeleteInvalidResponsibilityForConfigurationItem(string id, string userToken)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            ConfigurationItem item = DataHandler.GetConfigurationItem(guid);
            if (item == null)
            {
                return NotFound("Could not find a configuration item with id " + guid.ToString());
            }
            SecurityHandler.DeleteInvalidResponsibility(item.ItemId, userToken, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItem/{id}/History")]
    public HistoryEntry[] GetHistoryEntries(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                BadRequest();
            }
            HistoryEntry[] historyEntries = HistoryHandler.GetAllHistoryEntriesForItem(guid).ToArray();
            if (historyEntries == null || historyEntries.Length == 0)
            {
                NotFound();
            }
            return historyEntries;
        }
        catch (Exception ex)
        {
            ServerError(ex);
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItem/{id}/History/Objects")]
    public HistoricConfigurationItem GetHistoryObjects(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                BadRequest();
            }
            HistoricConfigurationItem item = HistoryHandler.GetHistoricConfigurationItem(guid);
            if (item == null)
            {
                NotFound();
            }
            return item;
        }
        catch (Exception ex)
        {
            ServerError(ex);
            return null;
        }
    }



}