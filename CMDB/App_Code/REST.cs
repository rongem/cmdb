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
    // Fügen Sie zum Verwenden von HTTP GET das Attribut [WebGet] hinzu. (Das standardmäßige ResponseFormat ist WebMessageFormat.Json.)
    // Fügen Sie zum Erstellen eines Vorgangs, der XML zurückgibt,
    //     [WebGet(ResponseFormat=WebMessageFormat.Xml)] hinzu,
    //     und fügen Sie die folgende Zeile in den Vorgangstext ein:
    //         WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml";
    public static void SetStatusCode(System.Net.HttpStatusCode httpStatusCode)
    {
        WebOperationContext.Current.OutgoingResponse.StatusCode = httpStatusCode;
    }

    public static OperationResult Success()
    {
        return new OperationResult() { Success = true };
    }

    public static void BadRequest()
    {
        SetStatusCode(System.Net.HttpStatusCode.BadRequest);
    }

    public static void NotFound()
    {
        SetStatusCode(System.Net.HttpStatusCode.NotFound);
    }

    public static void ServerError()
    {
        SetStatusCode(System.Net.HttpStatusCode.InternalServerError);
    }

    public static OperationResult ServerError(Exception ex)
    {
        ServerError();
        return new OperationResult() { Success = false, Message = ex.Message };
    }

    public static OperationResult IdMismatch()
    {
        BadRequest();
        return new OperationResult() { Success = false, Message = "Id mismatch" };
    }
}
