using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Web;

/// <summary>
/// Zusammenfassungsbeschreibung für REST
/// </summary>
public partial class REST
{

    [OperationContract]
    [WebGet(UriTemplate = "Export/Table/ForItem/Connections/{id}")]
    public string ExportConnectionsForItem(string id)
    {
        string format = WebOperationContext.Current.IncomingRequest.Headers["Accept"].ToLower();
        if (format != Constants.Excel && format != Constants.Csv)
        {
            BadRequest();
            return null;
        }
        Guid guid;
        if (!Guid.TryParse(id, out guid))
        {
            BadRequest();
            return null;
        }
        ConfigurationItem item = DataHandler.GetConfigurationItem(guid);
        if (item == null)
        {
            NotFound();
            return null;
        }
        return Encoding.UTF8.GetString(OperationsHandler.GetConnectionsAsFile(item, format == Constants.Excel ? FileFormats.Excel : FileFormats.Csv).ToArray());
    }

    [OperationContract]
    [WebGet(UriTemplate = "Export/Table/ForItem/Links/{id}")]
    public string ExportLinksForItem(string id)
    {
        string format = WebOperationContext.Current.IncomingRequest.Headers["Accept"].ToLower();
        if (format != Constants.Excel && format != Constants.Csv)
        {
            BadRequest();
            return null;
        }
        Guid guid;
        if (!Guid.TryParse(id, out guid))
        {
            BadRequest();
            return null;
        }
        ConfigurationItem item = DataHandler.GetConfigurationItem(guid);
        if (item == null)
        {
            NotFound();
            return null;
        }
        return Encoding.UTF8.GetString(OperationsHandler.GetLinksAsFile(item, format == Constants.Excel ? FileFormats.Excel : FileFormats.Csv).ToArray());
    }

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "Export/Table")]
    public String Export(Guid[] ids, string format)
    {
        return null;
    }

    [OperationContract]
    [WebGet(UriTemplate = "Export/Graph/ForItem/{id}/{depth}")]
    public String ExportGraph(string id, string depth)
    {
        Guid guid;
        if (!Guid.TryParse(id, out guid))
        {
            BadRequest();
            return null;
        }
        ConfigurationItem item = DataHandler.GetConfigurationItem(guid);
        if (item == null)
        {
            NotFound();
            return null;
        }

        return Encoding.UTF8.GetString(new MemoryStream().ToArray());
    }

    [OperationContract]
    [WebGet(UriTemplate ="Export/Graph/Schema")]
    public string ExportSchema()
    {
        return null;
    }
}