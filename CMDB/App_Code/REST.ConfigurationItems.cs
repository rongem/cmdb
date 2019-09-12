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
    /// Gibt alle Configuration Items zurück
    /// </summary>
    /// <returns></returns>
    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItems")]
    public ConfigurationItem[] GetConfigurationItems()
    {
        try
        {
            return DataHandler.GetConfigurationItems().ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    /// <summary>
    /// Get full configuration items as comma separated list
    /// </summary>
    /// <param name="items">comma separated guid list</param>
    /// <returns></returns>
    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItems/{items}/Full")]
    public Item[] GetFullConfigurationItems(string items)
    {
        try
        {
            string[] idstrings = items.Split(',');
            List<Guid> ids = new List<Guid>();
            for (int i = 0; i < idstrings.Length; i++)
            {
                Guid id;
                if (Guid.TryParse(idstrings[i], out id))
                {
                    ids.Add(id);
                }
            }
            return DataHandler.GetItems(ids).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    /// <summary>
    /// Sucht die Configuration Items nach Parametern ab
    /// </summary>
    /// <param name="search">Suchparameter</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItems/Search")]
    public ConfigurationItem[] SearchConfigurationItems(Search search)
    {
        try
        {
            return DataHandler.SearchConfigurationItems(search).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    /// <summary>
    /// Sucht die Configuration Items nach Parametern ab und gibt volle Items zurück
    /// </summary>
    /// <param name="search">Suchparameter</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItems/Search/Full")]
    public Item[] SearchFullConfigurationItems(Search search)
    {
        try
        {
            return DataHandler.GetItems(DataHandler.SearchConfigurationItems(search).Select(i => i.ItemId)).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    /// <summary>
    /// Sucht die Configation Items, ausgehend von einem angegebenen, nach Parametern ab
    /// </summary>
    /// <param name="search">Suchparamter</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItems/Search/Neighbor")]
    public NeighborItem[] SearchNeighborConfigurationItems(NeighborSearch search)
    {
        try
        {
            return DataHandler.SearchNeighbors(search).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }


    /// <summary>
    /// Gibt alle Configuration Items eines angegebenen Typs zurück
    /// </summary>
    /// <param name="typeIds">Guid des ItemTypes</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItems/ByType")]
    public ConfigurationItem[] GetConfigurationItemsByType(Guid[] typeIds)
    {
        try
        {
            return DataHandler.GetConfigurationItemsByType(typeIds).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    /// <summary>
    /// Gibt alle Configuration Items eines angegebenen Typs zurück
    /// </summary>
    /// <param name="typeNames">Name des ItemType</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ConfigurationItems/ByTypeNames")]
    public ConfigurationItem[] GetConfigurationItemsByTypeName(string[] typeNames)
    {
        try
        {
            return DataHandler.GetConfigurationItemsByTypeName(typeNames).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItems/ConnectableAsLowerItem/item/{item}/rule/{rule}")]
    public ConfigurationItem[] GetConfigurationItemsConnectableAsLowerItem(string item, string rule)
    {
        Guid itemId, ruleId;
        if (!(Guid.TryParse(item, out itemId) && Guid.TryParse(rule, out ruleId)))
        {
            BadRequest();
            return null;
        }
        try
        {
            return DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, ruleId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItems/ConnectableAsUpperItem/item/{item}/rule/{rule}")]
    public ConfigurationItem[] GetConfigurationItemsConnectableAsUpperItem(string item, string rule)
    {
        Guid itemId, ruleId;
        if (!(Guid.TryParse(item, out itemId) && Guid.TryParse(rule, out ruleId)))
        {
            BadRequest();
            return null;
        }
        try
        {
            return DataHandler.GetConfigurationItemsConnectableAsUpperItem(itemId, ruleId).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

}