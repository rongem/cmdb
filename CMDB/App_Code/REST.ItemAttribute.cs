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
    [WebGet(UriTemplate = "ItemAttribute/{id}")]
    public ItemAttribute GetAttribute(string id)
    {
        Guid attributeId;
        if (!Guid.TryParse(id, out attributeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            ItemAttribute attribute = DataHandler.GetAttribute(attributeId);
            if (attribute == null)
            {
                NotFound();
            }
            return attribute;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemAttribute/item/{item}/attributeType/{attributeType}")]
    public ItemAttribute GetAttributeForConfigurationItemByAttributeType(string item, string attributeType)
    {
        Guid itemId, attributeTypeId;
        if (!(Guid.TryParse(item, out itemId) && Guid.TryParse(attributeType, out attributeTypeId)))
        {
            BadRequest();
            return null;
        }
        try
        {
            ItemAttribute attribute = DataHandler.GetAttributeForConfigurationItemByAttributeType(itemId, attributeTypeId);
            if (attribute == null)
            {
                NotFound();
            }
            return attribute;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "ItemAttribute/item/{item}/attributeTypeName/{attributeTypeName}")]
    public ItemAttribute GetAttributeForConfigurationItemByAttributeTypeName(string item, string attributeTypeName)
    {
        Guid itemId;
        if (!Guid.TryParse(item, out itemId))
        {
            BadRequest();
            return null;
        }
        try
        {
            ItemAttribute attribute = DataHandler.GetAttributeForConfigurationItemByAttributeTypeName(itemId, attributeTypeName);
            if (attribute == null)
            {
                NotFound();
            }
            return attribute;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ItemAttribute")]
    public OperationResult CreateItemAttribute(ItemAttribute attribute)
    {
        try
        {
            DataHandler.CreateAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "ItemAttribute/{id}")]
    public OperationResult UpdateItemAttribute(string id, ItemAttribute attribute)
    {
        try
        {
            if (!string.Equals(id, attribute.AttributeId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            DataHandler.UpdateAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "ItemAttribute/{id}")]
    public OperationResult DeleteItemAttribute(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            ItemAttribute attribute = DataHandler.GetAttribute(guid);
            if (attribute == null)
            {
                return NotFound("Could not find an attribute with id " + guid.ToString());
            }
            DataHandler.DeleteAttribute(attribute, ServiceSecurityContext.Current.WindowsIdentity);
            return Success();
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }

}