using CmdbAPI.BusinessLogic;
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
    [WebInvoke(Method = "POST", UriTemplate = "ItemType")]
    public OperationResult CreateItemType(ItemType itemType)
    {
        try
        {
            MetaDataHandler.CreateItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            BadRequest();
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemType/{id}")]
    public ItemType GetItemType(string id)
    {
        Guid typeId;
        if (!Guid.TryParse(id, out typeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            ItemType itemType = MetaDataHandler.GetItemType(id);
            if (itemType == null)
            {
                NotFound();
            }
            return itemType;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "ItemType/{id}")]
    public OperationResult UpdateItemType(string id, ItemType itemType)
    {
        try
        {
            if (!string.Equals(id, itemType.TypeId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            MetaDataHandler.UpdateItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemType/{id}/CanDelete")]
    public bool CanDeleteItemType(string id)
    {
        Guid typeId;
        if (!Guid.TryParse(id, out typeId))
        {
            BadRequest();
            return false;
        }
        try
        {
            if (MetaDataHandler.GetItemType(typeId) == null)
            {
                NotFound();
                return false;
            }
            return MetaDataHandler.CanDeleteItemType(typeId);
        }
        catch
        {
            ServerError();
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "ItemType/{id}")]
    public OperationResult DeleteItemType(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            ItemType itemType = MetaDataHandler.GetItemType(guid);
            if (itemType == null)
            {
                return NotFound("Could not find an item type with id " + guid.ToString());
            }
            MetaDataHandler.DeleteItemType(itemType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }


}