using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Excel = Microsoft.Office.Interop.Excel;
using Powerpoint = Microsoft.Office.Interop.PowerPoint;
using Visio = Microsoft.Office.Interop.Visio;

namespace CmdbDataAccess
{
    public static class OfficeHelper
    {
        public static void CreateExcelSheetFromDataTable(DataTable dt, string fileName)
        {
            try
            {
                Process[] P0, P1;
                P0 = Process.GetProcessesByName("Excel"); // Prozesse vorher

                Excel.Application app = new Excel.Application();

                int I, J;

                P1 = Process.GetProcessesByName("Excel"); // Prozesse nachher
                I = 0;
                if (P1.Length > 1)
                {
                    for (I = 0; I < P1.Length; I++)
                    {
                        for (J = 0; J < P0.Length; J++)
                            if (P0[J].Id == P1[I].Id) break;
                        if (J == P0.Length) break;
                    }
                }
                Process P = P1[I]; // Das ist (hoffentlich) der hinzugekommene Prozess

                Excel.Workbook wb = app.Workbooks.Add();
                Excel.Sheets w = wb.Sheets; // Wird benötigt, um den Prozess später beenden zu können
                Excel.Worksheet ws = w[1];
                Excel.Range range = ws.UsedRange;
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    Excel.Range range1 = ws.Cells[i + 1][1];
                    range1.Value = dt.Columns[i].Caption;
                    range1.Font.Bold = true;
                    while (System.Runtime.InteropServices.Marshal.ReleaseComObject(range1) > 0) { } // Aufräumarbeiten
                    range1 = null;
                }
                for (int j = 0; j < dt.Rows.Count; j++)
                {
                    for (int i = 0; i < dt.Columns.Count; i++)
                    {
                        Excel.Range range2 = ws.Cells[i + 1][j + 2];
                        range2.Value = dt.Rows[j][i].ToString();
                        while (System.Runtime.InteropServices.Marshal.ReleaseComObject(range2) > 0) { } // Aufräumarbeiten
                        range2 = null;
                    }
                }
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    Excel.Range range3 = ws.Columns[i + 1].Columns;
                    range3.AutoFit();
                    while (System.Runtime.InteropServices.Marshal.ReleaseComObject(range3) > 0) { } // Aufräumarbeiten
                    range3 = null;
                }
                if (!fileName.Equals(string.Empty))
                {
                    wb.Close(true, fileName, Type.Missing);
                    while (System.Runtime.InteropServices.Marshal.ReleaseComObject(wb) > 0) { } // Aufräumarbeiten
                    wb = null;
                    while (System.Runtime.InteropServices.Marshal.ReleaseComObject(w) > 0) { } // Aufräumarbeiten
                    w = null;
                    while (System.Runtime.InteropServices.Marshal.ReleaseComObject(ws) > 0) { } // Aufräumarbeiten
                    ws = null;
                    while (System.Runtime.InteropServices.Marshal.ReleaseComObject(range) > 0) { } // Aufräumarbeiten
                    range = null;
                    GC();
                    app.Quit();
                    while (System.Runtime.InteropServices.Marshal.ReleaseComObject(app) > 0) { } // Aufräumarbeiten
                    app = null;
                    GC();
                    if (!P.HasExited) // Falls der Prozess immer noch existiert, gewaltsam killen
                        P.Kill();
                }
                else
                    app.Visible = true;
            }
            catch (Exception ex)
            {
                if (fileName.Equals(string.Empty))
                    System.Windows.MessageBox.Show(ex.Message);
                else
                    throw;
            }
        }

        private static void GC()
        {
            System.GC.Collect();
            System.GC.WaitForPendingFinalizers();
            System.GC.Collect();
            System.GC.WaitForPendingFinalizers();
        }

        public static void CreatePowerpointFromGraphObjectList(List<GraphObjectWpf> graphs)
        {
            try
            {
                // Powerpoint starten
                Powerpoint.Application app = new Powerpoint.Application();
                app.Visible = Microsoft.Office.Core.MsoTriState.msoTrue;
                Powerpoint.Presentation pr = app.Presentations.Add();
                Powerpoint.CustomLayout customLayout = pr.SlideMaster.CustomLayouts[Powerpoint.PpSlideLayout.ppLayoutTitle];
                Powerpoint.Slide sl = pr.Slides.AddSlide(1, customLayout);

                // Zuerst alle vorgegebenen Shapes löschen, die stören nur
                for (int i = sl.Shapes.Count; i > 0; i--)
                {
                    sl.Shapes[i].Delete();
                }

                // Wird zum Nachschlagen der Shapes in der zweiten Runde für die Verbindungen benötigt
                Dictionary<Guid, Powerpoint.Shape> shapes = new Dictionary<Guid, Powerpoint.Shape>(graphs.Count);
                List<Guid> handledConnections = new List<Guid>();

                // Erste Runde für die Graph-Objekte; doppelt vorhandene Objekte werden herausgefiltert
                foreach (GraphObjectWpf graph in graphs)
                {
                    if (!shapes.Keys.Contains(graph.OwnId))
                    {
                        Powerpoint.Shape pps = sl.Shapes.AddShape(Microsoft.Office.Core.MsoAutoShapeType.msoShapeRectangle, (float)graph.Left, (float)graph.Top, (float)graph.Width, (float)graph.Height);
                        pps.Fill.Solid();
                        pps.Fill.ForeColor.RGB = graph.ColorRGB;
                        pps.TextFrame.TextRange.Text = graph.Caption;
                        pps.TextFrame.TextRange.Font.Size = 12;
                        pps.TextFrame.TextRange.Font.Color.RGB = 0;
                        shapes.Add(graph.OwnId, pps);
                    }
                }

                // Zweite Runde für die Connections
                foreach (GraphObjectWpf graph in graphs)
                {
                    foreach (GraphLine line in graph.Connections)
                    {
                        if (!handledConnections.Contains(line.OwnId))
                        {
                            handledConnections.Add(line.OwnId);
                            Powerpoint.Shape connector = sl.Shapes.AddConnector(Microsoft.Office.Core.MsoConnectorType.msoConnectorStraight, 5, 5, 5, 5);
                            connector.Line.EndArrowheadStyle = Microsoft.Office.Core.MsoArrowheadStyle.msoArrowheadTriangle;
                            connector.ConnectorFormat.BeginConnect(shapes[line.OriginObject.OwnId], 1);
                            connector.ConnectorFormat.EndConnect(shapes[line.TargetObject.OwnId], 3);
                            connector.RerouteConnections();
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                System.Windows.MessageBox.Show(ex.Message);
            }
        }

        public static void CreateVisioFromGraphObjectList(List<GraphObjectWpf> graphs)
        {
            const double pixelFactor = 80; // Faktor, durch den die Pixel geteilt werden, Visio-Konform zu sein
            try
            {
                Visio.Application app = new Visio.Application();
                app.Visible = true;
                Visio.Document doc = app.Documents.Add("");
                Visio.Shape page = doc.Pages[1].PageSheet;
                //page.Cells["PrintPageOrientation"].ResultIU = (double)Visio.VisCellVals.visPPOLandscape; //Funktioniert nicht
                Visio.Document stencil = app.Documents.OpenEx("BASIC_M.VSSX", (short)Visio.VisOpenSaveArgs.visOpenRO + (short)Visio.VisOpenSaveArgs.visOpenDocked);
                Visio.Document stencilConn = app.Documents.OpenEx("CONNEC_M.VSSX", (short)Visio.VisOpenSaveArgs.visOpenRO + (short)Visio.VisOpenSaveArgs.visOpenDocked);

                // Wird zum Nachschlagen der Shapes in der zweiten Runde für die Verbindungen benötigt
                Dictionary<Guid, Visio.Shape> shapes = new Dictionary<Guid, Visio.Shape>(graphs.Count);
                List<Guid> handledConnections = new List<Guid>();

                // Erste Runde für die Graph-Objekte; doppelt vorhandene Objekte werden herausgefiltert
                foreach (GraphObjectWpf graph in graphs)
                {
                    if (!shapes.Keys.Contains(graph.OwnId))
                    {
                        Visio.Shape vsh = page.Drop(stencil.Masters.ItemU["Rectangle"], 1.4 + graph.Left / pixelFactor, (double)7.13889466839495 - graph.Top / pixelFactor);
                        vsh.Cells["Height"].ResultIU = graph.Height / pixelFactor;
                        vsh.Cells["Width"].ResultIU = graph.Width / pixelFactor;
                        vsh.Text = graph.Caption;
                        vsh.Cells["FillForegnd"].FormulaU = string.Format("THEMEGUARD(RGB({0},{1},{2}))", graph.Color.R, graph.Color.G, graph.Color.B);
                        vsh.Cells["Char.Size"].FormulaU = "=12 pt";
                        shapes.Add(graph.OwnId, vsh);
                    }
                }

                // Zweite Runde für die Connections
                foreach (GraphObjectWpf graph in graphs)
                {
                    foreach (GraphLine line in graph.Connections)
                    {
                        if (!handledConnections.Contains(line.OwnId))
                        {
                            Visio.Shape conn = page.Drop(stencilConn.Masters.ItemU["Dynamic connector"], 1, 1);
                            conn.Text = line.ConnectionTypeName;
                            conn.Cells["EndArrow"].ResultIU = 4; // Pfeilspitze
                            conn.Cells["ShapeRouteStyle"].ResultIU = 16; // Gerade verbinden (0 ist Default (rechtwinklig), 1 ist rechtwinklig)
                            handledConnections.Add(line.OwnId);
                            Visio.Cell ShapeConnectionPoint, ConnectorEndPoint;

                            ShapeConnectionPoint = shapes[line.OriginObject.OwnId].Cells["Connections.X1"]; // Unterer Verbinder am oberen Objekt
                            ConnectorEndPoint = conn.Cells["BeginX"];
                            ConnectorEndPoint.GlueTo(ShapeConnectionPoint);

                            ShapeConnectionPoint = shapes[line.TargetObject.OwnId].Cells["Connections.X3"]; // Oberer Verbinder am unteren Objekt
                            ConnectorEndPoint = conn.Cells["EndX"];
                            ConnectorEndPoint.GlueTo(ShapeConnectionPoint);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Windows.MessageBox.Show(ex.Message);
            }
        }
    }
}
