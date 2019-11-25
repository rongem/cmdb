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
    [WebInvoke(Method = "PUT", UriTemplate = "ImportDataTable")]
    public LineMessage[] ImportDataTable(TransferTable table, Guid itemTypeId)
    {
        try
        {
            List<string[]> lines = new List<string[]>(table.rows);
            if (table.columns.Count() == 0 || lines[0].Count() != table.columns.Count())
            {
                BadRequest();
                return new LineMessage[] { new LineMessage() {
                    index = -1,
                    message = "column count mismatch",
                    severity = LineMessage.Severity.fatal,
                }};
            }
            if (lines.Count() == 0)
            {
                BadRequest();
                return new LineMessage[] { new LineMessage() {
                    index = -1,
                    message = "no lines in table",
                    severity = LineMessage.Severity.fatal,
                }};
            }
            return OperationsHandler.ImportData(table, itemTypeId, ServiceSecurityContext.Current.WindowsIdentity);
        }
        catch (Exception ex)
        {
            ServerError();
            return new LineMessage[] { new LineMessage() {
                index = -1,
                message = "server error",
                severity = LineMessage.Severity.fatal,
                details = ex.Message,
            }};
        }
    }

}
