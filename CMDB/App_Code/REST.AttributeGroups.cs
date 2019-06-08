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
    public IEnumerable<AttributeGroup> GetAttributeGroups()
    {
        return MetaDataHandler.GetAttributeGroups();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeGroups/InItemType/{id}")]
    public IEnumerable<AttributeGroup> GetAttributeGroupsAssignedToItemType(string id)
    {
        Guid itemType;
        if (!Guid.TryParse(id, out itemType))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return null;
        }
        try
        {
            return MetaDataHandler.GetAttributeGroupsAssignedToItemType(itemType);
        }
        catch (Exception)
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
            return null;
        };
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeGroups/NotInItemType/{id}")]
    public IEnumerable<AttributeGroup> GetAttributeGroupsNotAssignedToItemType(string id)
    {
        Guid itemType;
        if (!Guid.TryParse(id, out itemType))
        {
            SetStatusCode(System.Net.HttpStatusCode.BadRequest);
            return null;
        }
        try
        {
            return MetaDataHandler.GetAttributeGroupsNotAssignedToItemType(itemType);
        }
        catch (Exception)
        {
            SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
            return null;
        };
    }

}