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
    public OperationResult CreateItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
    {
        try
        {
            MetaDataHandler.CreateItemTypeAttributeGroupMapping(itemTypeAttributeMapping, ServiceSecurityContext.Current.WindowsIdentity);
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
    [WebGet(UriTemplate = "ItemTypeAttributeGroupMapping/group/{group}/itemType{itemType}/CanDelete")]
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
    [WebInvoke(Method = "DELETE", UriTemplate = "ItemTypeAttributeGroupMapping")]
    public OperationResult DeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
    {
        try
        {
            MetaDataHandler.DeleteItemTypeAttributeGroupMapping(itemTypeAttributeMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

}