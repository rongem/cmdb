using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
//using System.Text;
//using System.Threading.Tasks;

namespace CmdbAPI.BusinessLogic.Helpers
{
    public class ExcelHelper
    {
        /// <summary>
        /// Erzeugt aus einer beliebigen Menge von DataTable-Objekten eine Excel-Arbeitsmappe, wobei genau ein Blatt pro Tabelle verwendet wird
        /// </summary>
        /// <param name="stream">Ausgabe-Stream, in den geschrieben werden soll</param>
        /// <param name="tables">Tabellen; der Tabellen-Name wird zum Blattnamen, die Spaltennamen werden zur Titelzeile</param>
        public static void CreateExcelDocumentFromDataTable(System.IO.Stream stream, IEnumerable<System.Data.DataTable> tables)
        {
            using (SpreadsheetDocument document = SpreadsheetDocument.Create(stream, SpreadsheetDocumentType.Workbook))
            {
                WorkbookPart workbookPart = document.AddWorkbookPart();
                workbookPart.Workbook = new Workbook();
                uint ctr = 0;
                foreach (System.Data.DataTable t in tables)
                {

                    WorksheetPart worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                    worksheetPart.Worksheet = new Worksheet();
                    Sheets sheets = workbookPart.Workbook.AppendChild<Sheets>(new Sheets());
                    string relationshipId = workbookPart.GetIdOfPart(worksheetPart);
                    ctr++;
                    Sheet sheet = new Sheet()
                    {
                        Id = relationshipId,
                        SheetId = ctr,
                        Name = string.IsNullOrWhiteSpace(t.TableName) ? string.Format("Tabelle {0}", ctr) : t.TableName
                    };
                    sheets.Append(sheet);
                    SheetData sheetData = worksheetPart.Worksheet.AppendChild<SheetData>(new SheetData());
                    Row row = sheetData.AppendChild<Row>(new Row() { RowIndex = 1 });
                    for (int i = 0; i < t.Columns.Count; i++)
                    {
                        row.AppendChild<Cell>(ConstructCell(t.Columns[i].ColumnName, CellValues.String));
                    }
                    for (int i = 0; i < t.Rows.Count; i++)
                    {
                        row = sheetData.AppendChild<Row>(new Row() { RowIndex = (uint)i + 2 });
                        for (int j = 0; j < t.Columns.Count; j++)
                        {
                            row.AppendChild<Cell>(ConstructCell(t.Rows[i][j].ToString(), CellValues.String));
                        }
                    }
                    worksheetPart.Worksheet.AppendChild<AutoFilter>(new AutoFilter() { Reference = string.Format("A1:{0}{1}", GetColumnName(t.Columns.Count + 1), t.Rows.Count + 1) });
                }
                workbookPart.Workbook.Save();
            }
        }

        /// <summary>
        /// Gibt eine Liste mit String-Arrays zurück, die den Inhalt einer Excel-Tabelle enthalten.
        /// </summary>
        /// <param name="stream">Stream zum Lesen des Excel-Dokuments</param>
        /// <returns></returns>
        public static List<string[]> GetLinesFromExcelDocument(System.IO.Stream stream)
        {
            List<string[]> lines = new List<string[]>();
            SpreadsheetDocument xldoc = SpreadsheetDocument.Open(stream, false);
            WorkbookPart workbookPart = xldoc.WorkbookPart;
            SharedStringTablePart sstpart = workbookPart.GetPartsOfType<SharedStringTablePart>().First();
            SharedStringTable sst = sstpart.SharedStringTable;

            WorksheetPart worksheetPart = workbookPart.WorksheetParts.First();
            Worksheet sheet = worksheetPart.Worksheet;

            IEnumerable<Row> rows = sheet.Descendants<Row>();
            foreach (Row row in rows)
            {
                List<string> actLine = new List<string>();
                int columnIndex = 0;

                foreach (Cell c in row.Elements<Cell>())
                {
                    int cellColumnIndex = (int)GetColumnIndexFromName(GetColumnName(c.CellReference));
                    while (columnIndex < cellColumnIndex)
                    {
                        actLine.Add(string.Empty);
                        columnIndex++;
                    }
                    if ((c.DataType != null) && (c.DataType == CellValues.SharedString))
                    {
                        int ssid = int.Parse(c.CellValue.Text);
                        string str = sst.ChildElements[ssid].InnerText;
                        actLine.Add(str);
                    }
                    else if (c.CellValue != null)
                        actLine.Add(c.CellValue.Text);
                    else
                        actLine.Add(string.Empty);
                    columnIndex++;
                }
                lines.Add(actLine.ToArray());
            }
            return lines;
        }

        /// <summary>
        /// Lädt ein Excel-Dokument
        /// </summary>
        /// <param name="fileName">Dateiname</param>
        /// <returns></returns>
        public SpreadsheetDocument OpenExcelDocument(string fileName)
        {
            using (FileStream fs = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                return SpreadsheetDocument.Open(fs, false);
            }
        }

        /// <summary>
        /// Gibt den Inhalt eines Excel-Dokuments auf Debug aus
        /// </summary>
        /// <param name="doc">Excel-Dokument</param>
        public void WriteCellContents(SpreadsheetDocument doc)
        {
            WorkbookPart workbookPart = doc.WorkbookPart;
            SharedStringTablePart sstpart = workbookPart.GetPartsOfType<SharedStringTablePart>().First();
            SharedStringTable sst = sstpart.SharedStringTable;

            WorksheetPart worksheetPart = workbookPart.WorksheetParts.First();
            Worksheet sheet = worksheetPart.Worksheet;

            IEnumerable<Cell> cells = sheet.Descendants<Cell>();
            IEnumerable<Row> rows = sheet.Descendants<Row>();

            System.Diagnostics.Debug.WriteLine("Row count = {0}", rows.LongCount());
            System.Diagnostics.Debug.WriteLine("Cell count = {0}", cells.LongCount());

            // One way: go through each cell in the sheet
            foreach (Cell cell in cells)
            {
                if ((cell.DataType != null) && (cell.DataType == CellValues.SharedString))
                {
                    int ssid = int.Parse(cell.CellValue.Text);
                    string str = sst.ChildElements[ssid].InnerText;
                    System.Diagnostics.Debug.WriteLine("Shared string {0}: {1}", ssid, str);
                }
                else if (cell.CellValue != null)
                {
                    System.Diagnostics.Debug.WriteLine("Cell contents: {0}", cell.CellValue.Text);
                }
            }

            // Or... via each row
            foreach (Row row in rows)
            {
                foreach (Cell c in row.Elements<Cell>())
                {
                    if ((c.DataType != null) && (c.DataType == CellValues.SharedString))
                    {
                        int ssid = int.Parse(c.CellValue.Text);
                        string str = sst.ChildElements[ssid].InnerText;
                        System.Diagnostics.Debug.WriteLine("Shared string {0}: {1}", ssid, str);
                    }
                    else if (c.CellValue != null)
                    {
                        System.Diagnostics.Debug.WriteLine("Cell contents: {0}", c.CellValue.Text);
                    }
                }
            }
        }

        /// <summary>
        /// Erzeugt eine Zelle
        /// </summary>
        /// <param name="value">Wert, den die Zelle erhalten soll</param>
        /// <param name="dataType">DataTyp für die Zelle</param>
        /// <returns></returns>
        private static Cell ConstructCell(string value, CellValues dataType)
        {
            return new Cell()
            {
                CellValue = new CellValue(value),
                DataType = new EnumValue<CellValues>(dataType)
            };
        }

        /// <summary>
        /// Rechnet die numerische Spaltennummer in den Excel-Spaltennamen (A-Z, AA, AB, AC usw.)
        /// </summary>
        /// <param name="colNumber">Spaltennummer (1 - n)</param>
        /// <returns></returns>
        private static string GetColumnName(int colNumber)
        {
            int upper = (colNumber - 1) / 26, lower = (colNumber - 1) % 26;
            string ret = string.Empty;
            if (upper > 0)
            {
                ret += Convert.ToChar(upper + 64);
                lower++;
            }
            ret += Convert.ToChar(lower + 64);
            return ret;
        }

        private static List<char> Letters = new List<char>() { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ' };

        public static string GetColumnName(string cellReference)
        {
            // Create a regular expression to match the column name portion of the cell name.
            Regex regex = new Regex("[A-Za-z]+");
            Match match = regex.Match(cellReference);

            return match.Value;
        }

        /// <summary>
        /// Given just the column name (no row index), it will return the zero based column index.
        /// Note: This method will only handle columns with a length of up to two (ie. A to Z and AA to ZZ). 
        /// A length of three can be implemented when needed.
        /// </summary>
        /// <param name="columnName">Column Name (ie. A or AB)</param>
        /// <returns>Zero based index if the conversion was successful; otherwise null</returns>
        public static int? GetColumnIndexFromName(string columnName)
        {
            int? columnIndex = null;

            string[] colLetters = Regex.Split(columnName, "([A-Z]+)");
            colLetters = colLetters.Where(s => !string.IsNullOrEmpty(s)).ToArray();

            if (colLetters.Count() <= 2)
            {
                int index = 0;
                foreach (string col in colLetters)
                {
                    List<char> col1 = colLetters.ElementAt(index).ToCharArray().ToList();
                    int? indexValue = Letters.IndexOf(col1.ElementAt(index));

                    if (indexValue != -1)
                    {
                        // The first letter of a two digit column needs some extra calculations
                        if (index == 0 && colLetters.Count() == 2)
                        {
                            columnIndex = columnIndex == null ? (indexValue + 1) * 26 : columnIndex + ((indexValue + 1) * 26);
                        }
                        else
                        {
                            columnIndex = columnIndex == null ? indexValue : columnIndex + indexValue;
                        }
                    }

                    index++;
                }
            }

            return columnIndex;
        }

    }
}
