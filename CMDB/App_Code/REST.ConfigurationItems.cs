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
    [WebGet]
    public IEnumerable<ConfigurationItem> GetConfigurationItems()
    {
        try
        {
            return DataHandler.GetConfigurationItems();
        }
        catch (Exception)
        {
            return null;
        }
    }

    /// <summary>
    /// Sucht die Configuration Items nach Parametern ab
    /// </summary>
    /// <param name="search">Suchparameter</param>
    /// <returns></returns>
    [OperationContract]
    public IEnumerable<ConfigurationItem> SearchConfigurationItems(Search search)
    {
        try
        {
            return DataHandler.SearchConfigurationItems(search);
        }
        catch (Exception)
        {
            return null;
        }
    }

    /// <summary>
    /// Sucht die Configation Items, ausgehend von einem angegebenen, nach Parametern ab
    /// </summary>
    /// <param name="search">Suchparamter</param>
    /// <returns></returns>
    [OperationContract]
    public IEnumerable<NeighborItem> SearchNeighborConfigurationItems(NeighborSearch search)
    {
        try
        {
            return DataHandler.SearchNeighbors(search);
        }
        catch (Exception)
        {
            return null;
        }
    }


    /// <summary>
    /// Gibt alle Configuration Items eines angegebenen Typs zurück
    /// </summary>
    /// <param name="typeIds">Guid des ItemTypes</param>
    /// <returns></returns>
    [OperationContract]
    public IEnumerable<ConfigurationItem> GetConfigurationItemsByType(Guid[] typeIds)
    {
        try
        {
            return DataHandler.GetConfigurationItemsByType(typeIds);
        }
        catch (Exception)
        {
            return null;
        }
    }

    /// <summary>
    /// Gibt alle Configuration Items eines angegebenen Typs zurück
    /// </summary>
    /// <param name="typeNames">Name des ItemType</param>
    /// <returns></returns>
    [OperationContract]
    public IEnumerable<ConfigurationItem> GetConfigurationItemsByTypeName(string[] typeNames)
    {
        try
        {
            return DataHandler.GetConfigurationItemsByTypeName(typeNames);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
    public IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsLowerItem(Guid itemId, Guid ruleId)
    {
        try
        {
            return DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, ruleId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
    public IEnumerable<ConfigurationItem> GetConfigurationItemsConnectableAsUpperItem(Guid itemId, Guid ruleId)
    {
        try
        {
            return DataHandler.GetConfigurationItemsConnectableAsUpperItem(itemId, ruleId);
        }
        catch (Exception)
        {
            return null;
        }
    }

}