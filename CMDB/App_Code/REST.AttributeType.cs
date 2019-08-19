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
    [WebInvoke(Method = "POST", UriTemplate = "AttributeType")]
    public OperationResult CreateAttributeType(AttributeType attributeType)
    {
        try
        {
            MetaDataHandler.CreateAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}")]
    public AttributeType GetAttributeType(string id)
    {
        Guid typeId;
        if (!Guid.TryParse(id, out typeId))
        {
            BadRequest();
            return null;
        }
        try
        {
            AttributeType attributeType = MetaDataHandler.GetAttributeType(typeId);
            if (attributeType == null)
            {
                NotFound();
            }
            return attributeType;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}/CanDelete")]
    public bool CanDeleteAttributeType(string id)
    {
        Guid typeId;
        if (!Guid.TryParse(id, out typeId))
        {
            BadRequest();
            return false;
        }
        try
        {
            return MetaDataHandler.CanDeleteAttributeType(typeId);
        }
        catch
        {
            ServerError();
            return false;
        }

    }

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "AttributeType/{id}")]
    public OperationResult UpdateAttributeType(string id, AttributeType attributeType)
    {
        try
        {
            if (!string.Equals(id, attributeType.TypeId.ToString(), StringComparison.CurrentCultureIgnoreCase))
            {
                return IdMismatch();
            }
            MetaDataHandler.UpdateAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "AttributeType/{id}")]
    public OperationResult DeleteAttributeType(string id)
    {
        try
        {
            Guid guid;
            if (!Guid.TryParse(id, out guid))
            {
                return BadRequest("Not a valid Guid");
            }
            AttributeType attributeType = MetaDataHandler.GetAttributeType(guid);
            if (attributeType == null)
            {
                return NotFound("Could not find an attribute type with id " + guid.ToString());
            }
            MetaDataHandler.DeleteAttributeType(attributeType, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
        return Success();
    }

    [OperationContract]
    [WebGet(UriTemplate = "AttributeType/{id}/ItemAttributes/Count")]
    public int GetItemAttributesCountForAttributeType(string id)
    {
        Guid attributeType;
        if (!Guid.TryParse(id, out attributeType))
        {
            BadRequest();
            return -1;
        }
        return MetaDataHandler.GetItemAttributesCountForAttributeType(attributeType);
    }

    /// <summary>
    /// Wandelt einen Attributtypen in einen Item-Typen um, wobei Attributwerte zu Configuration Items werden
    /// </summary>
    /// <param name="id">ID des AttributTyps</param>
    /// <param name="newItemTypeName">Neuer Name des Item-Typen; ggf. identisch mit dem Namen des Attributtyps</param>
    /// <param name="colorCode">Farbwert für den neuen Item-Typ</param>
    /// <param name="connectionTypeId">Verbindungstyp, mit dem die neuen Verbindungen gebildet werden sollen</param>
    /// <param name="position">0 = die neuen Items sind oberhalb der existierenden, 1 = unterhalb</param>
    /// <param name="attributeTypesToTransfer">Weitere Attributtypen, die zum neuen Configuration Item transferiert werden sollen</param>
    /// <returns></returns>
    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "AttributeType/{id}/ConvertToItemType")]
    public OperationResult ConvertAttributeTypeToItemType(string id, string newItemTypeName, string colorCode, Guid connectionTypeId,
        Position position, AttributeType[] attributeTypesToTransfer)
    {
        try
        {
            Guid attributeTypeId;
            if (!Guid.TryParse(id, out attributeTypeId))
                return BadRequest("Not a valid id");
            AttributeType attributeType = MetaDataHandler.GetAttributeType(attributeTypeId);
            if (attributeType == null)
                return NotFound("No attribute type found with id " + id);
            ConnectionType connectionType = MetaDataHandler.GetConnectionType(connectionTypeId);
            if (connectionType == null)
                return NotFound("No connection type found with id " + connectionTypeId.ToString());
            OperationResult or = OperationsHandler.ConvertAttributeTypeToCIType(attributeType, newItemTypeName, colorCode.ToUpper(),
               connectionType, position, attributeTypesToTransfer, ServiceSecurityContext.Current.WindowsIdentity);
            if (!or.Success)
                ServerError();
            return or;
        }
        catch (Exception ex)
        {
            return ServerError(ex);
        }
    }
}