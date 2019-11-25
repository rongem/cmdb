using CmdbAPI.BusinessLogic;
using CmdbAPI.TransferObjects;
using System;
using System.Collections.Generic;
using System.Data;
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
            List<HttpMultipartParser.FilePart> files = HttpMultipartParser.MultipartFormDataParser.Parse(contentStream).Files;
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

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "GetDataTable", ResponseFormat = WebMessageFormat.Xml)]
    public DataTable GetDataTable(string[][] lines, ColumnMap[] activeColumns, Guid itemTypeId, bool ignoreExisting)
    {
        try
        {
            List<string[]> lineList = new List<string[]>(lines);
            if (lineList.Count() < activeColumns.Length)
            {
                BadRequest();
                return null;
            }
            Dictionary<int, string> activeColumnsMap = new Dictionary<int, string>(activeColumns.Length);
            DataTable dt = new DataTable();
            for (int i = 0; i < activeColumns.Length; i++)
            {
                activeColumnsMap.Add(activeColumns[i].number, activeColumns[i].name);
                dt.Columns.Add(new DataColumn(activeColumns[i].name, typeof(string)) { Caption = activeColumns[i].caption });
            }
            OperationsHandler.FillDataTableWithLines(activeColumnsMap, dt, activeColumns.Single(c => c.name.Equals("name")).number, lineList, itemTypeId, ignoreExisting);
            return dt;
        }
        catch (Exception)
        {
            ServerError();
            return null;
        }
    }

}
