﻿using CmdbAPI.BusinessLogic;
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
    [OperationContract]
    public OperationResult CreateItemType(ItemType itemType)
    {
        try
        {
            MetaDataHandler.CreateItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    public ItemType GetItemType(Guid id)
    {
        try
        {
            return MetaDataHandler.GetItemType(id);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
    public IEnumerable<ItemType> GetLowerItemTypeForUpperItemTypeAndConnectionType(Guid upperItemTypeId, Guid connectionTypeId)
    {
        try
        {
            return MetaDataHandler.GetLowerItemTypeForUpperItemTypeAndConnectionType(upperItemTypeId, connectionTypeId);
        }
        catch (Exception)
        {
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest)]
    public IEnumerable<ItemType> GetUpperItemTypeForLowerItemTypeAndConnectionType(Guid lowerItemTypeId, Guid connectionTypeId)
    {
        try
        {
            return MetaDataHandler.GetUpperItemTypeForLowerItemTypeAndConnectionType(lowerItemTypeId, connectionTypeId);
        }
        catch (Exception)
        {
            return null;
        }
    }


    [OperationContract]
    public OperationResult UpdateItemType(ItemType itemType)
    {
        try
        {
            MetaDataHandler.UpdateItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    public OperationResult DeleteItemType(ItemType itemType)
    {
        try
        {
            MetaDataHandler.DeleteItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    public bool CanDeleteItemType(ItemType itemType)
    {
        try
        {
            return MetaDataHandler.CanDeleteItemType(itemType.TypeId);
        }
        catch
        {
            return false;
        }

    }


}