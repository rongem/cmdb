using CmdbAPI.BusinessLogic;
using CmdbAPI.Security;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.ServiceModel;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
    public OperationResult CreateItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
    {
        try
        {
            MetaDataHandler.CreateItemTypeAttributeGroupMapping(itemTypeAttributeMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

    [OperationContract]
    public IEnumerable<ItemTypeAttributeGroupMapping> GetItemTypeAttributeGroupMappings()
    {
        return MetaDataHandler.GetItemTypeAttributeGroupMappings();
    }

    [OperationContract]
    public bool CanDeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
    {
        try
        {
            return MetaDataHandler.CanDeleteItemTypeAttributeGroupMapping(itemTypeAttributeMapping);
        }
        catch
        {
            return false;
        }

    }

    [OperationContract]
    public OperationResult DeleteItemTypeAttributeGroupMapping(ItemTypeAttributeGroupMapping itemTypeAttributeMapping)
    {
        try
        {
            MetaDataHandler.DeleteItemTypeAttributeGroupMapping(itemTypeAttributeMapping, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return new OperationResult() { Success = false, Message = ex.Message };
        }
        return new OperationResult() { Success = true };
    }

}