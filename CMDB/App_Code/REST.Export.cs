using System;
using System.Collections.Generic;
using System.IO;
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
    [WebGet(UriTemplate = "Export/{id}/{depth}/{format}")]
    public Stream Export(string id, string depth, string format)
    {
        Guid guid;
        if (!Guid.TryParse(id, out guid))
        {
            BadRequest();
            return null;
        }

        return new MemoryStream();
    }
}