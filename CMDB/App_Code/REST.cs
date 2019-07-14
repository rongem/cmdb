using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

[ServiceContract(Namespace = "")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
//[System.Web.Http.Cors.EnableCors(origins: "*", headers: "*", methods: "*")]
public partial class REST
{
    /// <summary>
    /// Liefert alle Meta-Informationen zurück
    /// </summary>
    /// <returns></returns>
    [WebGet(UriTemplate = "MetaData")]
    public MetaData GetMetaData()
    {
        return new MetaData()
        {
            attributeGroups = MetaDataHandler.GetAttributeGroups().ToArray(),
            attributeTypes = MetaDataHandler.GetAttributeTypes().ToArray(),
            itemTypeAttributeGroupMappings = MetaDataHandler.GetItemTypeAttributeGroupMappings().ToArray(),
            connectionRules = MetaDataHandler.GetConnectionRules().ToArray(),
            connectionTypes = MetaDataHandler.GetConnectionTypes().ToArray(),
            itemTypes = MetaDataHandler.GetItemTypes().ToArray(),
            userName = ServiceSecurityContext.Current.WindowsIdentity.Name,
            userRole = GetRoleForUser(),
        };
    }


    /// <summary>
    /// Legt einen bestimmten HTTP-Rückgabewert für den aktuellen Response fest
    /// </summary>
    /// <param name="httpStatusCode">Festzulegender Rückgabewert</param>
    public static void SetStatusCode(System.Net.HttpStatusCode httpStatusCode)
    {
        WebOperationContext.Current.OutgoingResponse.StatusCode = httpStatusCode;
    }

    /// <summary>
    /// Gibt eine Erfolgsmeldung zurück
    /// </summary>
    /// <returns></returns>
    public static OperationResult Success()
    {
        return new OperationResult() { Success = true };
    }

    /// <summary>
    /// Gibt einen Parameterfehler zurück
    /// </summary>
    public static void BadRequest()
    {
        SetStatusCode(System.Net.HttpStatusCode.BadRequest);
    }

    /// <summary>
    /// Zeigt an, dass das gesuchte Objekt mit dieser Id nicht gefunden wurde
    /// </summary>
    public static void NotFound()
    {
        SetStatusCode(System.Net.HttpStatusCode.NotFound);
    }

    /// <summary>
    /// Zeigt an, dass bei der Verarbeitung ein Fehler aufgetreten ist
    /// </summary>
    public static void ServerError()
    {
        SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
    }

    /// <summary>
    /// Liefert zusätzlich die Fehlermeldung zurück
    /// </summary>
    /// <param name="ex">Fehler (Exception)</param>
    /// <returns></returns>
    public static OperationResult ServerError(Exception ex)
    {
        ServerError();
        return new OperationResult() { Success = false, Message = ex.Message };
    }

    /// <summary>
    /// Gibt an, dass die Id aus der URL nicht mit der des übertragenen Objekts übereinstimmt.
    /// </summary>
    /// <returns></returns>
    public static OperationResult IdMismatch()
    {
        BadRequest();
        return new OperationResult() { Success = false, Message = "Id mismatch" };
    }
}
