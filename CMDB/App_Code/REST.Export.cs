﻿using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
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
    [WebGet(UriTemplate = "Export/Table/ForItem/Connections/{id}")]
    public Stream ExportConnectionsForItem(string id)
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
        return OperationsHandler.GetConnectionsAsFile(item, format == Constants.Excel ? FileFormats.Excel : FileFormats.Csv);
    }

    [OperationContract]
    [WebGet(UriTemplate = "Export/Table/ForItem/Links/{id}")]
    public Stream ExportLinksForItem(string id)
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
        return OperationsHandler.GetLinksAsFile(item, format == Constants.Excel ? FileFormats.Excel : FileFormats.Csv);
    }

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "Export/Table")]
    public Stream Export(Guid[] ids, string format)
    {
        return null;
    }

    [OperationContract]
    [WebGet(UriTemplate = "Export/Graph/ForItem/{id}/{depth}")]
    public Stream ExportGraph(string id, string depth)
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

        return new MemoryStream();
    }

    [OperationContract]
    [WebGet(UriTemplate ="Export/Graph/Schema")]
    public Stream ExportSchema()
    {
        return null;
    }
}