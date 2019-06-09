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
    [WebGet(UriTemplate = "AttributeGroups")]
    public AttributeGroup[] GetAttributeGroups()
    {
        return MetaDataHandler.GetAttributeGroups().ToArray();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeGroups/InItemType/{id}")]
    public AttributeGroup[] GetAttributeGroupsAssignedToItemType(string id)
    {
        Guid itemType;
        if (!Guid.TryParse(id, out itemType))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetAttributeGroupsAssignedToItemType(itemType).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        };
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeGroups/NotInItemType/{id}")]
    public AttributeGroup[] GetAttributeGroupsNotAssignedToItemType(string id)
    {
        Guid itemType;
        if (!Guid.TryParse(id, out itemType))
        {
            BadRequest();
            return null;
        }
        try
        {
            return MetaDataHandler.GetAttributeGroupsNotAssignedToItemType(itemType).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        };
    }

}