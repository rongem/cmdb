using CmdbAPI.ExportHelper;
using System;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace CmdbEditor
{
    /// <summary>
    /// Klasse zur Anzeige von grafischen Items in WPF
    /// </summary>
    public class GraphLineWpf : GraphLine
    {
        public GraphLineWpf(Guid connectionId, GraphItem origin, GraphItem target, string lineDescription) :
            base(connectionId, origin, target, lineDescription)
        {

        }
        /// <summary>
        /// Fügt eine Polyline der Leinwand hinzu, die vom Ursprungs-Item zum Ziel-Item führt
        /// </summary>
        /// <param name="parent">Canvas, auf der gezeichnet wird</param>
        public void AddToCanvas(Canvas parent)
        {
            Polyline pl = new Polyline();
            pl.Points.Add(new System.Windows.Point(this.TopX, this.TopY));
            pl.Points.Add(new System.Windows.Point(this.TopX, this.TopY + Math.Abs(this.TopY - this.BottomY) / 2 - 1.5 * GraphItemWpf.Margin));
            pl.Points.Add(new System.Windows.Point(this.BottomX, this.TopY + Math.Abs(this.TopY - this.BottomY) / 2 + 1.5 * GraphItemWpf.Margin));
            pl.Points.Add(new System.Windows.Point(this.BottomX, this.BottomY));
            pl.StrokeThickness = 1;
            pl.Stroke = Brushes.Black;
            pl.StrokeEndLineCap = PenLineCap.Triangle;
            pl.StrokeLineJoin = PenLineJoin.Bevel;
            parent.Children.Add(pl);
            // Unsichtbare dickere Linie zeichnen, um das Tooltip leichter sichtbar zu machen
            pl = (Polyline)WpfHelper.CloneUIElement(pl);
            pl.StrokeThickness = 4;
            pl.Stroke = Brushes.Transparent;
            pl.ToolTip = this.ConnectionTypeName;
            parent.Children.Add(pl);
        }
    }
}
