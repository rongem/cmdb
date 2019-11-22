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
	[WebInvoke(Method = "POST", UriTemplate = "ConvertFileToTable")]
	public string[][] ConvertFileToTable(System.IO.Stream contentStream)
    {
        try
        {
            List<HttpMultipartParser.FilePart> files = new HttpMultipartParser.MultipartFormDataParser(contentStream).Files;
            if (files.Count() != 1)
            {
                BadRequest();
                return null;
            }
            HttpMultipartParser.FilePart file = files[0];
            if (file.ContentType.ToLower() == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            {
                return CmdbAPI.BusinessLogic.Helpers.ExcelHelper.GetLinesFromExcelDocument(file.Data).ToArray();
            }
            if (file.ContentType.ToLower() == "text/csv" || (file.ContentType.ToLower() == "application/vnd.ms-excel" &&
                file.FileName.ToLower().EndsWith(".csv")))
            {
                return CmdbAPI.BusinessLogic.Helpers.ExcelHelper.GetLinesFromCSV(file.Data).ToArray();
            }
            BadRequest();
            return null;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

}
