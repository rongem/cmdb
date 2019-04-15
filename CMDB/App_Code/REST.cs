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
    [OperationContract]
    public string Test()
    {
        return ServiceSecurityContext.Current.WindowsIdentity.Name;
    }
}
