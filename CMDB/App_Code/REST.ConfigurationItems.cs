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
    public ConfigurationItem[] GetConfigurationItems()
    {
        try
        {
            return DataHandler.GetConfigurationItems().ToArray();
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
    public ConfigurationItem[] SearchConfigurationItems(Search search)
    {
        try
        {
            return DataHandler.SearchConfigurationItems(search).ToArray();
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
    public NeighborItem[] SearchNeighborConfigurationItems(NeighborSearch search)
    {
        try
        {
            return DataHandler.SearchNeighbors(search).ToArray();
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
    public ConfigurationItem[] GetConfigurationItemsByType(Guid[] typeIds)
    {
        try
        {
            return DataHandler.GetConfigurationItemsByType(typeIds).ToArray();
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
    public ConfigurationItem[] GetConfigurationItemsByTypeName(string[] typeNames)
    {
        try
        {
            return DataHandler.GetConfigurationItemsByTypeName(typeNames).ToArray();
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
    public ConfigurationItem[] GetConfigurationItemsConnectableAsLowerItem(Guid itemId, Guid ruleId)
    {
        try
        {
            return DataHandler.GetConfigurationItemsConnectableAsLowerItem(itemId, ruleId).ToArray();
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
    public ConfigurationItem[] GetConfigurationItemsConnectableAsUpperItem(Guid itemId, Guid ruleId)
    {
        try
        {
            return DataHandler.GetConfigurationItemsConnectableAsUpperItem(itemId, ruleId).ToArray();
        }
        catch (Exception)
        {
            return null;
        }
    }

}