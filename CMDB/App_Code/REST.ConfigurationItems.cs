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
            return DataHandler.GetItems(ids, ServiceSecurityContext.Current.WindowsIdentity).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItems/ByType/{types}")]
    public ConfigurationItem[] GetConfigurationItemsByType(string types)
    {
        List<Guid> ids = new List<Guid>();
        if (types.Contains(','))
        {
            string[] idstrings = types.Split(',');
            for (int i = 0; i < idstrings.Length; i++)
            {
                Guid id;
                if (Guid.TryParse(idstrings[i], out id))
                {
                    ids.Add(id);
                }
                else
                {
                    BadRequest();
                    return null;
                }
            }
        }
        else
        {
            Guid typeId;
            if (Guid.TryParse(types, out typeId))
            {
                ids.Add(typeId);
            }
            else
            {
                BadRequest();
                return null;
            }
        }
        try
        {
            return DataHandler.GetConfigurationItemsByType(ids.ToArray()).ToArray();
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
            return DataHandler.GetItems(DataHandler.SearchConfigurationItems(search).Select(i => i.ItemId), ServiceSecurityContext.Current.WindowsIdentity).ToArray();
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
    /// <param name="typeIds">Guid des ItemTypes</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "GET", UriTemplate = "ConfigurationItems/ByType/{type}/Full")]
    public Item[] GetFullConfigurationItemsByType(string type)
    {
        try
        {
            Guid typeId;
            if (!Guid.TryParse(type, out typeId))
            {
                BadRequest();
                return null;
            }
            return DataHandler.GetFullConfigurationItemsByType(typeId, ServiceSecurityContext.Current.WindowsIdentity).ToArray();
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
    [WebGet(UriTemplate = "ConfigurationItems/Available/{ruleId}/{itemsToConnect}")]
    public ConfigurationItem[] GetConfigurationItemsAvailabeForRule(string ruleId, string itemsToConnect)
    {
        Guid rule;
        int numItems;
        if (!(Guid.TryParse(ruleId, out rule) && int.TryParse(itemsToConnect, out numItems)))
        {
            BadRequest();
            return null;
        }
        ConnectionRule connectionRule = MetaDataHandler.GetConnectionRule(rule);
        if (connectionRule == null)
        {
            NotFound();
            return null;
        }
        if (numItems < 1 || numItems > connectionRule.MaxConnectionsToUpper)
        {
            BadRequest();
            return null;
        }
        try
        {
            return DataHandler.GetConfigurationItemsConnectableAsLowerItem(rule, numItems).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ConfigurationItems/ConnectableAsLowerItem/item/{item}/rule/{rule}")]
    public ConfigurationItem[] GetConfigurationItemsConnectableForItemAsLowerItem(string item, string rule)
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
    public ConfigurationItem[] GetConfigurationItemsConnectableForItemAsUpperItem(string item, string rule)
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