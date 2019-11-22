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
	[WebInvoke(Method = "POST", UriTemplate = "ConvertExcelToTable")]
	public string[][] ConvertExcelToTable(System.IO.Stream contentStream)
    {
        try
        {
            System.IO.MemoryStream stream = new System.IO.MemoryStream();
            contentStream.CopyTo(stream);
            stream.Position = 0;
            System.IO.File.WriteAllBytes(@"C:\Users\Michael\AppData\Local\Temp\0.xlsx", stream.ToArray());
            stream.Position = 0;

            return CmdbAPI.BusinessLogic.Helpers.ExcelHelper.GetLinesFromExcelDocument(stream).ToArray();
        }
        catch (Exception ex)
        {
            ServerError();
            return null;
        }
    }

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "ConvertCsvToTable")]
    public string[][] ConvertCsvToTable(System.IO.Stream contentStream)
    {
        try
        {
            return CmdbAPI.BusinessLogic.Helpers.ExcelHelper.GetLinesFromCSV(contentStream).ToArray();
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }
}
