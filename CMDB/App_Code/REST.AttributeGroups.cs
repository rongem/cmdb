using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{
    [OperationContract]
    public IEnumerable<AttributeGroup> GetAttributeGroups()
    {
        return MetaDataHandler.GetAttributeGroups();
    }

    [OperationContract]
    public IEnumerable<AttributeGroup> GetAttributeGroupsAssignedToItemType(Guid itemType)
    {
        try
        {
            return MetaDataHandler.GetAttributeGroupsAssignedToItemType(itemType);
        }
        catch (Exception)
        {
            return null;
        };
    }

    [OperationContract]
    public IEnumerable<AttributeGroup> GetAttributeGroupsNotAssignedToItemType(Guid itemType)
    {
        try
        {
            return MetaDataHandler.GetAttributeGroupsNotAssignedToItemType(itemType);
        }
        catch (Exception)
        {
            return null;
        };
    }

}