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
    [WebInvoke(Method = "POST", UriTemplate = "ItemTypeAttributeGroupMapping")]
    public OperationResult CreateItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeGroupMapping)
    {
        try
        {
            MetaDataHandler.CreateItemTypeAttributeGroupMapping(itemTypeAttributeGroupMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemTypeAttributeGroupMappings")]
    public IEnumerable<ItemTypeAttributeGroupMapping> GetItemTypeAttributeGroupMappings()
    {
        return MetaDataHandler.GetItemTypeAttributeGroupMappings();
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemTypeAttributeGroupMapping/Group/{group}/ItemType/{itemType}/CountAttributes")]
    public int CountAttributesForDeleteItemTypeAttributeGroupMapping(string group, string itemType)
    {
        Guid groupId, itemTypeId;
        if (!(Guid.TryParse(group, out groupId) && Guid.TryParse(itemType, out itemTypeId)))
        {
            BadRequest();
            return 0;
        }
        try
        {
            ItemTypeAttributeGroupMapping mapping = MetaDataHandler.GetItemTypeAttributeGroupMapping(groupId, itemTypeId);
            if (mapping == null)
            {
                NotFound();
                return 0;
            }
            return MetaDataHandler.CountAttributesForItemTypeAttributeGroupMapping(mapping);
        }
        catch
        {
            ServerError();
            return 0;
        }

    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemTypeAttributeGroupMapping/group/{group}/itemType/{itemType}/CanDelete")]
    public bool CanDeleteItemTypeAttributeGroupMapping(string group, string itemType)
    {
        Guid groupId, itemTypeId;
        if (!(Guid.TryParse(group, out groupId) && Guid.TryParse(itemType, out itemTypeId)))
        {
            BadRequest();
            return false;
        }
        try
        {
            ItemTypeAttributeGroupMapping mapping = MetaDataHandler.GetItemTypeAttributeGroupMapping(groupId, itemTypeId);
            if (mapping == null)
            {
                NotFound();
                return false;
            }
            return MetaDataHandler.CanDeleteItemTypeAttributeGroupMapping(mapping);
        }
        catch
        {
            ServerError();
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "ItemTypeAttributeGroupMapping/group/{attributeGroup}/itemType/{itemType}")]
    public OperationResult DeleteItemTypeAttributeGroupMapping(string itemType, string attributeGroup)
    {
        try
        {
            Guid itemTypeId, groupId;
            if (!(Guid.TryParse(itemType, out itemTypeId)&&Guid.TryParse(attributeGroup, out groupId)))
            {
                BadRequest();
                return null;
            }
            ItemTypeAttributeGroupMapping itemTypeAttributeGroupMapping = MetaDataHandler.GetItemTypeAttributeGroupMapping(groupId, itemTypeId);
            if (itemTypeAttributeGroupMapping == null)
            {
                return NotFound("Could not find a mapping with both ids");
            }
            MetaDataHandler.DeleteItemTypeAttributeGroupMapping(itemTypeAttributeGroupMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

}